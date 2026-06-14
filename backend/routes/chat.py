from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from models.chat import (
    create_message,
    create_chat_session,
    generate_title
)
import os

from utils.gemini import (
    detect_mood,
    generate_reply
)

chat_bp = Blueprint("chat", __name__)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["moodchatbot"]


@chat_bp.route("/sessions", methods=["GET"])
@jwt_required()
def get_sessions():
    user_id = get_jwt_identity()

    sessions = list(
        db.chat_sessions.find(
            {"user_id": user_id},
            {"user_id": 0}
        ).sort("updated_at", -1)
    )

    for session in sessions:
        session["_id"] = str(session["_id"])

    return jsonify(sessions), 200


@chat_bp.route("/sessions", methods=["POST"])
@jwt_required()
def create_session():
    user_id = get_jwt_identity()

    data = request.get_json()

    context = data.get("context", "generic")
    title = data.get("title", "New Chat")

    session = create_chat_session(
        user_id=user_id,
        title=title,
        context=context
    )

    result = db.chat_sessions.insert_one(session)

    return jsonify({
        "session_id": str(result.inserted_id),
        "title": title,
        "context": context
    }), 201


@chat_bp.route("/history/<session_id>", methods=["GET"])
@jwt_required()
def get_history(session_id):
    messages = list(
        db.messages.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1)
    )

    return jsonify({
        "messages": messages
    }), 200


@chat_bp.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    data = request.get_json()

    user_message = data.get("message", "").strip()
    context = data.get("context", "generic")
    session_id = data.get("session_id")

    if session_id:
        existing_session = db.chat_sessions.find_one(
            {"_id": ObjectId(session_id)}
        )

        if existing_session:
            context = existing_session["context"]

    if not user_message:
        return jsonify({
            "error": "Message is required"
        }), 400

    user_id = get_jwt_identity()

    if not session_id:
        title = generate_title(
                context,
                user_message
            )

        session = create_chat_session(
            user_id=user_id,
            title=title,
            context=context
        )

        result = db.chat_sessions.insert_one(session)

        session_id = str(result.inserted_id)

    history = list(
        db.messages.find(
            {"session_id": session_id},
            {"_id": 0, "role": 1, "content": 1}
        )
        .sort("timestamp", 1)
        .limit(20)
    )

    mood = detect_mood(user_message)

    reply = generate_reply(
        user_message=user_message,
        mood=mood,
        context=context,
        chat_history=history
    )

    db.messages.insert_many([
        create_message(
            user_id=user_id,
            session_id=session_id,
            role="user",
            content=user_message,
            mood=mood,
            context=context
        ),
        create_message(
            user_id=user_id,
            session_id=session_id,
            role="assistant",
            content=reply,
            mood=mood,
            context=context
        )
    ])

    db.chat_sessions.update_one(
        {"_id": ObjectId(session_id)},
        {
            "$set": {
                "updated_at": datetime.utcnow()
            }
        }
    )

    return jsonify({
        "reply": reply,
        "mood": mood,
        "context": context,
        "session_id": session_id
    }), 200


@chat_bp.route("/sessions/<session_id>", methods=["DELETE"])
@jwt_required()
def delete_session(session_id):

    db.messages.delete_many({
        "session_id": session_id
    })

    db.chat_sessions.delete_one({
        "_id": ObjectId(session_id)
    })

    return jsonify({
        "message": "Session deleted"
    }), 200
    
@chat_bp.route("/sessions/<session_id>/rename", methods=["PUT"])
@jwt_required()
def rename_session(session_id):
    data = request.get_json()

    new_title = data.get("title", "").strip()

    if not new_title:
        return jsonify({
            "error": "Title required"
        }), 400

    db.chat_sessions.update_one(
        {"_id": ObjectId(session_id)},
        {
            "$set": {
                "title": new_title
            }
        }
    )

    return jsonify({
        "message": "Session renamed"
    }), 200