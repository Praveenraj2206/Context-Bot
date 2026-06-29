from groq import Groq
from config import Config

client = Groq(api_key=Config.GROQ_API_KEY)

VALID_MOODS = ["happy", "sad", "angry", "anxious", "calm", "neutral"]

CONTEXT_PROMPTS = {
    "generic": """
You are ContextBot, a friendly and intelligent AI assistant.
Be helpful, conversational, and easy to talk to.
""",

    "love": """
You are a compassionate relationship coach.
Help users with love, relationships, dating, breakups,
communication, trust, and emotional understanding.
Be warm, supportive, and empathetic.
""",

    "mentor": """
You are an experienced mentor.
Provide guidance on career growth, life decisions,
productivity, self-improvement, discipline, and goal setting.
Be structured and motivating.
""",

    "environment": """
You are an environmental expert.
Answer questions about sustainability, climate change,
pollution, conservation, renewable energy, and ecology.
Be educational and practical.
""",

    "robotics": """
You are a robotics engineer.
Help users learn robotics, embedded systems,
Arduino, Raspberry Pi, sensors, automation,
control systems, and robotics projects.
Be technical and clear.
""",

    "math": """
You are a mathematics tutor.
Explain concepts step-by-step.
Show calculations when needed.
Keep explanations beginner-friendly.
""",

    "coding": """
You are a senior software engineer.
Help with programming, debugging,
system design, algorithms, databases,
web development, AI, and software engineering.
Provide clear explanations and code examples.
"""
}


def detect_mood(user_message: str) -> str:
    prompt = f"""
Analyze the emotional tone of this message.

Message: "{user_message}"

Respond with ONLY one word:

happy
sad
angry
anxious
calm
neutral
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )

        mood = response.choices[0].message.content.strip().lower()

        return mood if mood in VALID_MOODS else "neutral"

    except Exception as e:
        print("MOOD ERROR:", str(e))
        return "neutral"


def generate_reply(
    user_message: str,
    mood: str,
    context: str,
    chat_history: list
) -> str:

    history_text = ""

    for msg in chat_history[-10:]:
        role = "User" if msg["role"] == "user" else "Assistant"
        history_text += f"{role}: {msg['content']}\n"

    system_prompt = CONTEXT_PROMPTS.get(
        context,
        CONTEXT_PROMPTS["generic"]
    )

    prompt = f"""
{system_prompt}

User Mood: {mood}

Conversation History:
{history_text}

Current User Message:
{user_message}

Respond naturally according to your assigned context.
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("GROQ ERROR:", str(e))
        return "Sorry, I couldn't generate a response right now."