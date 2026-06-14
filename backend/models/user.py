from datetime import datetime

def create_user(username, email, hashed_password):
    return {
        "username": username,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
