import os
from flask import Flask
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}}, supports_credentials=True)

auth_bp = Blueprint('auth', __name__)  
bcrypt = Bcrypt()

def init_bcrypt(app):
    """
    Initialize bcrypt with the Flask app.
    """
    bcrypt.init_app(app)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Register a new user.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Log in an existing user and return a JWT token.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    print(user)
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))  # Fix: Convert user.id to string
    return jsonify({"access_token": access_token, "userId" : user.id}), 200


@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """
    Example of a protected route that requires authentication.
    """
    user_id = get_jwt_identity()
    return jsonify({"message": "Access granted", "user_id": user_id}), 200
