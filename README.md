# MoodChat 🧠💬

A mood-aware AI chatbot built with React, Flask, MongoDB, and Gemini API.

## Tech Stack
- **Frontend**: React + Tailwind CSS (Vite)
- **Backend**: Flask + Flask-JWT-Extended
- **Database**: MongoDB Atlas
- **AI**: Google Gemini 1.5 Flash
- **Auth**: JWT

## Project Structure
```
mood-chatbot/
├── backend/
│   ├── app.py              # Flask app entry point
│   ├── config.py           # Environment config
│   ├── requirements.txt
│   ├── .env.example        # Copy this to .env and fill in your keys
│   ├── models/
│   │   ├── user.py
│   │   └── chat.py
│   └── routes/
│       ├── auth.py         # /api/auth/register, /api/auth/login
│       └── chat.py         # /api/chat, /api/history, /api/mood-stats
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Chat.jsx
    │   ├── components/
    │   │   ├── MoodSelector.jsx
    │   │   └── MessageBubble.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── utils/
    │       └── api.js
    ├── package.json
    └── tailwind.config.js
```

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Fill in your keys
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Keys Needed
- **MongoDB Atlas**: Free cluster at mongodb.com/atlas
- **Gemini API**: Free at aistudio.google.com
- **JWT Secret**: Any random long string
# Context-Bot
