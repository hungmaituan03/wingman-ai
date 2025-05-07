# service/ai_chatbot.py

import os
from uuid import uuid4
from dotenv import load_dotenv
from openai import OpenAI

from .google_maps_service import get_places_from_google

# Load env vars (OPENAI_API_KEY)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def handle_chat(message: str, conversation_id: str = None) -> dict:
    """
    Handle user chat input, fetch places via Google service,
    and generate GPT explanations.
    """
    if not conversation_id:
        conversation_id = str(uuid4())

    places = get_places_from_google(message)
    if not places:
        raise ValueError("No places found for the given input.")

    # Build place info string
    place_info = "\n".join(
        f"{chr(65+i)}. {p['name']} - {p['address']} "
        f"(Rating: {p['rating']} ⭐️, {p['user_ratings_total']} reviews)"
        for i, p in enumerate(places)
    )

    system_prompt = (
        "You are a helpful travel companion. Your job:\n"
        "1. Write a short, friendly 1-2 sentence **summary** at the very top.\n"
        "2. Then, for each place, ONLY write:\n"
        "   - A short friendly description\n"
        "   - Why the user might like it\n\n"
        "Rules:\n"
        "- Do NOT repeat name, address, or rating.\n"
        "- No headers between places.\n"
        "- Separate each place with TWO line breaks.\n"
        "- Keep tone casual and natural."
    )

    user_prompt = (
        f"The user is searching for: '{message}'\n\n"
        f"Here are some places based on their query:\n\n{place_info}\n\n"
        "Follow the instructions above."
    )

    resp = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_tokens=1000,
        temperature=0.7,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    output = resp.choices[0].message.content.strip()
    sections = [blk.strip() for blk in output.split("\n\n") if blk.strip()]
    summary = sections[0] if sections else ""
    descriptions = sections[1:]

    # Prepare final structured response with extended info
    return {
        "summary": summary,
        "explanations": descriptions,
        "conversation_id": conversation_id,
        "places": [
            {
                "id": str(uuid4()),
                "name": p["name"],
                "address": p["address"],
                "rating": p["rating"],
                "user_ratings_total": p["user_ratings_total"],
                "lat": p["geometry"]["location"]["lat"],
                "lng": p["geometry"]["location"]["lng"],
                "types": p.get("types", []),
                "photoUrls": p.get("photoUrls", []),
                "phone_number": p.get("phone_number", "N/A"),
                "website": p.get("website", "N/A"),
                "opening_hours": p.get("opening_hours", []),
                "price_level": p.get("price_level", "N/A"),
                "google_maps_url": p.get("google_maps_url", "N/A"),
            }
            for p in places
        ],
    }
