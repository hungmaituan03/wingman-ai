from openai import OpenAI
import os
from dotenv import load_dotenv
import requests

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

def get_places_from_google(query: str) -> list:
    try:
        url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&key={google_maps_api_key}"
        response = requests.get(url)
        data = response.json()

        print("Google Maps API Response:", data)

        if response.status_code != 200:
            raise RuntimeError(f"Google Places API error: {response.status_code} - {data}")

        places = data.get('results', [])

        place_details = []
        for place in places[:5]:  # Top 5 only
            location = place.get("geometry", {}).get("location")
            if not location or 'lat' not in location or 'lng' not in location:
                continue  # Skip if no coordinates

            place_details.append({
                "name": place.get("name", "N/A"),
                "address": place.get("formatted_address", "N/A"),
                "rating": place.get("rating", "N/A"),
                "geometry": {"location": location},
            })

        print("Filtered Places with Geometry:", place_details)
        return place_details

    except Exception as e:
        raise RuntimeError(f"Error while fetching places from Google Maps: {str(e)}")


def handle_chat(message: str, conversation_id: str = None) -> dict:
    try:
        print(f"Processing message: {message}")
        places = get_places_from_google(message)
        if not places:
            raise ValueError("No places found for the given input.")

        place_info = "\n".join([
            f"{chr(65 + i)}. {place['name']} - {place['address']} (Rating: {place['rating']})"
            for i, place in enumerate(places)
        ])

        # Generate GPT summary (description only)
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            max_tokens=700,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful travel companion. Help me find 5 places and summarize each place in a friendly tone."
                },
                {
                    "role": "user",
                    "content": (
                        f"Here are some places I found based on the query: '{message}'\n\n"
                        f"{place_info}\n\n"
                        f"Can you recommend up to 5 different places and describe them briefly for a traveler?"
                    )
                }
            ]
        )

        bot_response = response.choices[0].message.content.strip()

        return {
            "response": bot_response,
            "conversation_id": conversation_id or "new_convo",
            "places": [
                {
                    "name": p["name"],
                    "address": p["address"],
                    "rating": p["rating"],
                    "lat": p["geometry"]["location"]["lat"],
                    "lng": p["geometry"]["location"]["lng"]
                }
                for p in places
            ]
        }

    except Exception as e:
        raise RuntimeError(f"ChatService Error: {str(e)}")
