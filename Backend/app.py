import os
import config
import services.pdf_reader as pdf_reader
import services.prompt_model as prompt_model
import services.chroma_vector_store as chroma_vector_store
import services.chroma_vector_query as chroma_vector_query
from flask_cors import CORS
from flask import Flask, request, jsonify
import services.get_collect
import json
from models import db, User, Collection, QueryHistory
from services.auth import auth_bp, init_bcrypt
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from services.get_collect import list_collections

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

CORS(app)

# ✅ Configure JWT Secret Key
app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
jwt = JWTManager(app)

# ✅ Register Database & Authentication
app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Initialize SQLAlchemy
init_bcrypt(app)  # Initialize Bcrypt for password hashing
app.register_blueprint(auth_bp, url_prefix='/auth')  # Register authentication routes

# ✅ Create database tables if they don't exist
with app.app_context():
    db.create_all()

existing_collection = ''
history_folder = 'history_file'  # Folder where history files are stored
history_filename = 'query_response_history.json'  # Name of the history file
history_file_path = os.path.join(history_folder, history_filename)

@app.route('/test')
def test():
    print("Test connection successful")
    return "Test connection successful"

# ✅ PDF Upload - Now stores collections only for logged-in users
@app.route('/pdf_upload', methods=['POST'])
@jwt_required(optional=True)  # Allow access without login
def upload_and_store():
    global existing_collection

    user_id = get_jwt_identity()  # Get logged-in user ID (None if not logged in)
    print(f"helooooooooo{user_id}")

    if 'file' not in request.files:
        return jsonify(status=400, message="No file part in the request")

    file = request.files['file']
    user_id = request.form.get('id')  
    print(f"USER ID FROM APP>PY: {user_id}" )
    file_name = file.filename.split(".")[0]
    existing_collection = file_name

    if file_name == '':
        return jsonify(status=400, message="No selected file")

    try:
        pdf_path = os.path.join(config.PDF_FILEPATH, file_name)
        file.save(pdf_path)

        pdf_bytes = pdf_reader.read_pdf_as_bytes(pdf_path)
        result = pdf_reader.process_pdf_to_text_file(pdf_bytes, pdf_path)

        json_path = os.path.join(config.JSON_FILEPATH, f"{file_name}.json")

        if not os.path.exists(json_path):
            return jsonify(status=404, message="JSON file does not exist at the expected path")

        embedding_result = chroma_vector_store.store_vectors_to_chroma(json_path, file_name, user_id)

        return jsonify(status=200, message={
            "pdf_processing": result,
            "vector_embedding": embedding_result
        })

    except Exception as e:
        return jsonify(status=500, message='Error processing PDF: ' + str(e))

# ✅ Fetch collections only for logged-in users
@app.route('/get_collection', methods=['GET'])
@jwt_required()
def get_collection_name():
    user_id = get_jwt_identity()
    print(f"Fetching collections for user: {user_id}")  # Debugging step
    
    # ✅ Call the correct function
    collection_names = list_collections(user_id)
    
    print(f"Collections found: {collection_names}")  # Debugging
    
    return jsonify(collections=collection_names)

# ✅ Set current collection
@app.route('/set_collection', methods=['POST'])
def set_collection_name():
    global existing_collection
    existing_collection = request.json.get('collection_name')
    return jsonify(collection_name=existing_collection)

# ✅ Querying - Works without login but only stores history if logged in
@app.route('/prompt_query', methods=['POST'])
@jwt_required(optional=True)
def prompt_vectors_query():
    query = request.json.get("query")
    if not query:
        return jsonify(status=404, message="Query is not available")

    user_id = get_jwt_identity()

    try:
        matched_result = chroma_vector_query.query_similar_content(existing_collection, query)
        response = prompt_model.prompt_model_for_response(matched_result, query, existing_collection, user_id)
        return jsonify(collection=existing_collection, model_response=response)
    except Exception as e:
        return jsonify(status=500, message='Error querying vectors and prompting model', error=str(e))

# ✅ Fetch query history only for logged-in user
@app.route('/get_query_history', methods=['GET'])
@jwt_required()
def get_query_history():
    user_id = get_jwt_identity()
    try:
        history = QueryHistory.query.filter_by(user_id=user_id).all()
        history_data = [{"collection_name": h.collection_name, "query": h.query, "response": h.response} for h in history]
        return jsonify(status=200, history=history_data)
    except Exception as e:
        return jsonify(status=500, message=f"Error fetching query history: {str(e)}")

# ✅ Get last context for a collection (only for logged-in users)
@app.route('/get_last_context', methods=['GET'])
@jwt_required()
def get_last_context():
    user_id = get_jwt_identity()
    collection_name = request.args.get('collection_name')
    if not collection_name:
        return jsonify({"error": "Collection name is required"}), 400

    last_context = prompt_model.fetch_last_context(collection_name, user_id)
    return jsonify({"context": last_context})

if __name__ == '__main__':
    app.run(port=8954, debug="True")
