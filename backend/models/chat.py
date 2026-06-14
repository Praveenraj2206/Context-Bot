from datetime import datetime


def create_message(
    user_id,
    session_id,
    role,
    content,
    mood=None,
    context="generic"
):
    return {
        "user_id": user_id,
        "session_id": session_id,
        "role": role,
        "content": content,
        "mood": mood,
        "context": context,
        "timestamp": datetime.utcnow()
    }


def generate_title(context, first_message):
    titles = {
        "love": "❤️ Relationship Advice",
        "mentor": "🧠 Career Guidance",
        "coding": "💻 Coding Help",
        "math": "📐 Math Discussion",
        "robotics": "🤖 Robotics Project",
        "environment": "🌱 Environment Discussion",
        "generic": "💬 Casual Conversation"
    }

    return titles.get(context, first_message[:30])


def create_chat_session(
    user_id,
    title,
    context="generic"
):
    return {
        "user_id": user_id,
        "title": title,
        "context": context,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }