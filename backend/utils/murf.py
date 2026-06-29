import os
from murf import Murf

client = Murf(
    api_key=os.getenv("MURF_API_KEY")
)

VOICE_MAP = {
    "generic": "Molly",        # was Tyler
    "love": "Ivy",
    "mentor": "Daisy",
    "coding": "Ezekiel",       # was Rory
    "math": "Gordon",          # was Leyton
    "robotics": "Matthew",     # or Atlas if Matthew isn't available
    "environment": "Hazel",    # if Hazel is unavailable, replace with another available voice
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