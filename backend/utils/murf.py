import os
from murf import Murf

client = Murf(
    api_key=os.getenv("MURF_API_KEY")
)

VOICE_MAP = {
    "generic": "Tyler",
    "love": "Ivy",
    "mentor": "Daisy",
    "coding": "Rory",
    "math": "Leyton",
    "robotics": "Atlas",   # Change to Matthew if Atlas isn't available
    "environment": "Hazel",
}

def generate_speech(text, context="generic"):
    try:
        voice = VOICE_MAP.get(context, "Tyler")

        response = client.text_to_speech.generate(
            text=text,
            voice_id=voice,
            locale="en-US"
        )

        return response.audio_file

    except Exception as e:
        print("Murf Error:", e)
        return None