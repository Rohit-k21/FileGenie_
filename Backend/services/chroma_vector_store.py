import os
import json
import chromadb
from dotenv import load_dotenv
from openai import AzureOpenAI
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
import config
from tiktoken import encoding_for_model
from flask_jwt_extended import get_jwt_identity
from models import db, Collection  # ✅ Importing database models


CHUNK_SIZE = 500  
OVERLAP_SIZE = 100

def store_vectors_to_chroma(TXT_FILEPATH, collection_name, user_id):
    load_dotenv()
    AZURE_OPENAI_API_KEY = os.getenv('AZURE_OPENAI_API_KEY')
    AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")
    AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_EMBEDDING_MODEL = os.getenv("AZURE_OPENAI_EMBEDDING_MODEL")

    openai_client = AzureOpenAI(
        api_key=AZURE_OPENAI_API_KEY,
        api_version=AZURE_OPENAI_API_VERSION,
        azure_endpoint=AZURE_OPENAI_ENDPOINT
    )

    chroma_client = chromadb.PersistentClient(
        path="chroma_store",
        settings=Settings(),
        tenant=DEFAULT_TENANT,
        database=DEFAULT_DATABASE,
    )

    collection = chroma_client.get_or_create_collection(name=collection_name)
    print("collection stored for - ", user_id)
    print("entred in collections - " , collection)

    with open(TXT_FILEPATH, 'r', encoding='utf-8') as file:
        text = file.read()

    text_chunks = []
    start = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end]
        text_chunks.append(chunk.strip())
        start += CHUNK_SIZE - OVERLAP_SIZE

    encoder = encoding_for_model(AZURE_OPENAI_EMBEDDING_MODEL)

    def get_embeddings(text_chunks):
        embeddings = []
        total_tokens = 0
        for idx, chunk in enumerate(text_chunks):
            token_count = len(encoder.encode(chunk.strip()))
            total_tokens += token_count
            print(f"Chunk {idx + 1} uses {token_count} tokens.")
        
            response = openai_client.embeddings.create(
                input=chunk.strip(),
                model=AZURE_OPENAI_EMBEDDING_MODEL
            )
            embeddings.append({
                "text": chunk.strip(),
                "embedding": response.data[0].embedding,
                "chunk_id": f"chunk_{idx + 1}"
            })
        return embeddings

    def store_embeddings_in_chroma(embeddings):
        for item in embeddings:
            collection.upsert(
                documents=[item['text']],
                embeddings=[item['embedding']],
                ids=[str(hash(item['text']))],
                metadatas=[{"chunk_id": item['chunk_id']}]
            )

    

    embeddings = get_embeddings(text_chunks)
    store_embeddings_in_chroma(embeddings)
    output_path = os.path.join(config.OUTPUT_PATH, f"{collection_name}.json")

    print("Embeddings stored in ChromaDB successfully.")
    
    print(user_id)
    
    # ✅ Store collection in database if the user is logged in
    if user_id:
        print("Entered in if block")
        existing_collection = Collection.query.filter_by(name=collection_name, user_id=user_id).first()

        if not existing_collection:
            new_collection = Collection(name=collection_name, user_id=user_id)
            db.session.add(new_collection)
            db.session.commit()
            print(f"Collection '{collection_name}' stored in database for user {user_id}")
            
    return "Collection " + collection_name + " Created Successfully"
