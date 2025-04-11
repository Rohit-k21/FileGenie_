import os
import chromadb
from dotenv import load_dotenv
from openai import AzureOpenAI
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
import openpyxl
from datetime import datetime
import tiktoken
from flask_jwt_extended import get_jwt_identity  # ✅ Added JWT authentication
from models import db, Collection  # ✅ Import database models

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

def query_similar_content(existing_collection, query):
    """
    Fetch relevant vectors from the user's collection.
    Users can only query collections they uploaded.
    """

    print(existing_collection, query)

    user_id = get_jwt_identity()  # ✅ Get logged-in user ID

    # ✅ Check if the user owns the collection
    if user_id:
        user_collection = Collection.query.filter_by(name=existing_collection, user_id=user_id).first()
        if not user_collection:
            return {"error": "Unauthorized access to collection"}  # ✅ Prevent access to other users' collections

    collection = chroma_client.get_collection(name=existing_collection)

    def query_embedding(query_text):
        try:
            response = openai_client.embeddings.create(
                input=query_text,
                model=AZURE_OPENAI_EMBEDDING_MODEL
            )
            query_vector = response.data[0].embedding

            results = collection.query(
                query_embeddings=[query_vector],
                n_results=3  
            )
        except Exception as e:            
            print(e)
            return {"error": "Query failed due to an internal issue"}  # ✅ Added error handling

        return results

    query_results = query_embedding(query)

    if "documents" not in query_results or not query_results['documents'][0]:
        return {"error": "No matching results found"}  # ✅ Handle empty results

    matched_result = query_results['documents'][0]
    matched_result = ''.join(matched_result)
    
    return matched_result

# Example call (make sure to provide an existing collection name)
# documents, page_numbers = query_similar_content('file', 'What is the Total comprehensive income?')
