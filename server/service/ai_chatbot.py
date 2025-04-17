import os
import uuid  # Import uuid to generate unique IDs
from dotenv import load_dotenv
import requests
from openai import OpenAI

# Load environment variables
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
        for place in places[:5]:  # Limit to top 5
            location = place.get("geometry", {}).get("location")
            if not location or 'lat' not in location or 'lng' not in location:
                continue  # Skip if no coordinates

            place_id = place.get("place_id")

            # Fetch additional photo references via Place Details API
            photo_urls = []
            if place_id:
                details_url = (
                    f"https://maps.googleapis.com/maps/api/place/details/json"
                    f"?place_id={place_id}&fields=photos&key={google_maps_api_key}"
                )
                details_response = requests.get(details_url)
                details_data = details_response.json()
                photos = details_data.get("result", {}).get("photos", [])[:3]

                for photo in photos:
                    ref = photo.get('photo_reference')
                    if ref:
                        photo_url = (
                            f"https://maps.googleapis.com/maps/api/place/photo"
                            f"?maxwidth=800&photo_reference={ref}&key={google_maps_api_key}"
                        )
                        photo_urls.append(photo_url)

            place_details.append({
                "name": place.get("name", "N/A"),
                "address": place.get("formatted_address", "N/A"),
                "rating": place.get("rating", "N/A"),
                "geometry": {"location": location},
                "photoUrls": photo_urls  # Up to 3 real photos
            })

        print("Filtered Places with Geometry and Photos:", place_details)
        return place_details

    except Exception as e:
        raise RuntimeError(f"Error while fetching places from Google Maps: {str(e)}")


def handle_chat(message: str, conversation_id: str = None) -> dict:
    try:
        # Generate a new unique conversation ID if none is provided
        if not conversation_id or conversation_id.strip() == "":
            conversation_id = str(uuid.uuid4())

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
                        f"Can you recommend at least 3 different places and describe them briefly with name, address, rating, a brief description, and pictures for a traveler?"
                    )
                }
            ]
        )

        bot_response = response.choices[0].message.content.strip()

        return {
            "response": bot_response,
            "conversation_id": conversation_id,  # Now always a unique value
            "places": [
                {
                    "name": p["name"],
                    "address": p["address"],
                    "rating": p["rating"],
                    "lat": p["geometry"]["location"]["lat"],
                    "lng": p["geometry"]["location"]["lng"],
                    "photoUrls": p.get("photoUrls", [])  # Send list of image URLs
                }
                for p in places
            ]
        }

    except Exception as e:
        raise RuntimeError(f"ChatService Error: {str(e)}")
