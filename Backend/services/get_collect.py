import os
from dotenv import load_dotenv
import chromadb
from openai import AzureOpenAI
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
from flask_jwt_extended import get_jwt_identity  # ✅ Added JWT authentication
from models import db, Collection  # ✅ Import database models

def list_collections(user_id):
    """
    Fetch collections only for the logged-in user.
    If not logged in, return all collections (public access).
    """

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


    try:
        print(f"✅ DEBUG: Authenticated user ID: {user_id}")
        
        if user_id:
            # ✅ Fetch collections belonging to the logged-in user
            user_collections_db = Collection.query.filter_by(user_id=user_id).all()
            print(user_collections_db)
            if user_collections_db:
                print(f"✅ DEBUG: Collections found in DB for user {user_id}: {[col.name for col in user_collections_db]}")
            else:
                print(f"⚠️ DEBUG: No collections found in DB for user {user_id}")
            
            collection_names = [col.name for col in user_collections_db]
        else:
            print("No data")
            collection_names = []

        # ✅ Get all collections from ChromaDB
        all_collections = chroma_client.list_collections()
        print(all_collections)
        # ✅ Filter ChromaDB collections to only include user-specific collections
        user_collections = [name.name for name in all_collections if name.name in collection_names]
        print(f"Filtered collections for user: {user_collections}")
        print(f"✅ DEBUG: Final filtered collections for user {user_id}: {user_collections}")

        return user_collections  # ✅ Return filtered collection names
    except Exception as e:
        print(f"Error fetching user collections: {e}")  # Debugging
        return []
# Example call to list collections
# collections = list_collections()
# print("Available Collections:")
# for collection in collections:
#     print(collection)
