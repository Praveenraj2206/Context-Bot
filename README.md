# ContextBot – Mood-Based Context-Aware AI Conversational Assistant

> A full-stack AI chatbot that adapts responses based on user-selected context, supports authentication, stores conversation history, and provides AI-powered voice responses.

## Live Demo

Demo URL:

`https://context-bot-eight.vercel.app`

## Demo Video

![](https://github.com/Praveenraj2206/Praveenraj2206/blob/main/my-folder/ContextBot.mp4)

## Screenshots

Home

![](https://raw.githubusercontent.com/Praveenraj2206/Praveenraj2206/main/my-folder/Home.png)

Sign Up

![](https://raw.githubusercontent.com/Praveenraj2206/Praveenraj2206/main/my-folder/SignUp.png)

Themes

![](https://raw.githubusercontent.com/Praveenraj2206/Praveenraj2206/main/my-folder/Themes.png)

Generic Chat

![](https://raw.githubusercontent.com/Praveenraj2206/Praveenraj2206/main/my-folder/GenericChat.png)

Theme Chat

![](https://raw.githubusercontent.com/Praveenraj2206/Praveenraj2206/main/my-folder/ThemeChat.png)

## Features

- JWT Authentication
- Context-aware AI conversations
- Multiple chat themes
- Conversation history
- MongoDB Atlas cloud storage
- Groq AI integration
- Murf voice responses
- React + Flask architecture
- Responsive UI
- Cloud deployment with Render and Vercel

## Architecture

```text
User
  │
  ▼
React Frontend (Vercel)
  │
Axios
  │
Flask Backend (Render)
  ├──────────────┐
  ▼              ▼
Groq API     MongoDB Atlas
  │              │
  ▼              ▼
AI Reply    Chat History
      │
      ▼
  Murf Voice
```

## Project Structure

```text
mood-chatbot/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models/
│   ├── routes/
│   └── utils/
└── frontend/
    ├── public/backgrounds/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── utils/
```

## Tech Stack

Frontend: React (Vite), Axios

Backend: Flask, Flask-JWT-Extended, Flask-CORS

Database: MongoDB Atlas

AI: Groq

Voice: Murf

Deployment: Render + Vercel

## Environment Variables

```env
MONGO_URI=
JWT_SECRET_KEY=
GROQ_API_KEY=
MURF_API_KEY=
```

## Running Locally

Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python app.py
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

## Forking

1. Fork this repository.
2. Configure your own API keys.
3. Configure MongoDB Atlas.
4. Install dependencies.
5. Deploy your own copy.

## Future Improvements

- Gunicorn
- Docker
- Rate limiting
- Email verification
- Password reset
- Analytics

## Author

Praveen Raj

GitHub:

`https://github.com/Praveenraj2206`

## License

Educational and portfolio use.
