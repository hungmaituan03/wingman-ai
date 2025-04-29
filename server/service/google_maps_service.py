# service/google_maps_service.py

import os
import json
from dotenv import load_dotenv
import requests
from typing import List

# Load env vars (GOOGLE_MAPS_API_KEY)
load_dotenv()
google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")


def autocomplete_places(input_text: str) -> List[dict]:
    """Fetch place autocomplete suggestions based on user input"""
    params = {
        "input": input_text,
        "key": google_maps_api_key,
    }
    resp = requests.get(
        "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        params=params,
    )
    data = resp.json()
    if resp.status_code != 200 or data.get("status") != "OK":
        raise RuntimeError(f"Failed to fetch autocomplete results: {data.get('status')}")

    return [
        {
            "description": p.get("description", "N/A"),
            "place_id": p.get("place_id", "N/A"),
        }
        for p in data.get("predictions", [])
    ]


def get_places_from_google(query: str, max_results: int = 5) -> List[dict]:
    """Fetch places from Google Places Text Search + Details"""
    # 1) Text Search
    params = {"query": query, "key": google_maps_api_key}
    resp = requests.get(
        "https://maps.googleapis.com/maps/api/place/textsearch/json",
        params=params,
    )
    data = resp.json()
    status = data.get("status")
    if resp.status_code != 200 or status not in ("OK", "ZERO_RESULTS"):
        raise RuntimeError(f"Failed to fetch places for '{query}': {status}")

    results = data.get("results", [])[:max_results]
    place_details = []

    # 2) For each result, fetch Details
    for place in results:
        loc = place.get("geometry", {}).get("location", {})
        pid = place.get("place_id")
        photo_urls = []
        extra = {
            "formatted_phone_number": "N/A",
            "website": "N/A",
            "opening_hours": [],
            "price_level": "N/A",
            "url": "N/A",
        }

        if pid:
            det_params = {
                "place_id": pid,
                "fields": ",".join([
                    "photos",
                    "formatted_phone_number",
                    "website",
                    "opening_hours",
                    "price_level",
                    "url",
                ]),
                "key": google_maps_api_key,
            }
            det_resp = requests.get(
                "https://maps.googleapis.com/maps/api/place/details/json",
                params=det_params,
            )
            det_data = det_resp.json()
            if det_resp.status_code != 200 or det_data.get("status") != "OK":
                # skip this place if details call fails
                continue

            result = det_data.get("result", {})
            extra["formatted_phone_number"] = result.get("formatted_phone_number", "N/A")
            extra["website"] = result.get("website", "N/A")
            extra["opening_hours"] = result.get("opening_hours", {}).get("weekday_text", [])
            extra["price_level"] = result.get("price_level", "N/A")
            extra["url"] = result.get("url", "N/A")

            for photo in result.get("photos", [])[:3]:
                ref = photo.get("photo_reference")
                if ref:
                    photo_urls.append(
                        "https://maps.googleapis.com/maps/api/place/photo"
                        f"?maxwidth=800&photo_reference={ref}&key={google_maps_api_key}"
                    )

        detail = {
            "name": place.get("name", "N/A"),
            "address": place.get("formatted_address", "N/A"),
            "rating": place.get("rating", "N/A"),
            "user_ratings_total": place.get("user_ratings_total", "N/A"),
            "geometry": {"location": loc},
            "types": place.get("types", []),
            "photoUrls": photo_urls,
            "phone_number": extra["formatted_phone_number"],
            "website": extra["website"],
            "opening_hours": extra["opening_hours"],
            "price_level": extra["price_level"],
            "google_maps_url": extra["url"],
        }
        place_details.append(detail)

    return place_details


def get_places_from_names(names: List[str]) -> List[dict]:
    """
    Given a list of place names, fetch via autocomplete → place_id → details.
    """
    details_list = []
    for name in names:
        suggestions = autocomplete_places(name)
        if not suggestions:
            continue

        pid = suggestions[0]["place_id"]
        try:
            info = get_place_details(pid)
            details_list.append(info)
        except Exception:
            continue

    return details_list


def get_place_details(place_id: str) -> dict:
    """
    Fetch Place Details (phone, website, photos, hours, price, URL).
    """
    if not place_id:
        raise ValueError("place_id must be provided")

    params = {
        "place_id": place_id,
        "fields": ",".join([
            "name",
            "formatted_address",
            "geometry",
            "types",
            "rating",
            "user_ratings_total",
            "photos",
            "formatted_phone_number",
            "website",
            "opening_hours",
            "price_level",
            "url",
        ]),
        "key": google_maps_api_key,
    }
    det_resp = requests.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        params=params,
    )
    data = det_resp.json()
    if det_resp.status_code != 200 or data.get("status") != "OK":
        raise RuntimeError(f"Failed to fetch place details for {place_id}: {data.get('status')}")

    r = data.get("result", {})
    loc = r.get("geometry", {}).get("location", {})
    photo_urls = [
        f"https://maps.googleapis.com/maps/api/place/photo"
        f"?maxwidth=800&photo_reference={p.get('photo_reference')}&key={google_maps_api_key}"
        for p in r.get("photos", [])[:3]
        if p.get("photo_reference")
    ]

    return {
        "name": r.get("name", "N/A"),
        "address": r.get("formatted_address", "N/A"),
        "rating": float(r.get("rating", 0) or 0),
        "user_ratings_total": int(r.get("user_ratings_total", 0) or 0),
        "geometry": {"location": loc},
        "types": r.get("types", []),
        "photoUrls": photo_urls,
        "phone_number": r.get("formatted_phone_number", "N/A"),
        "website": r.get("website", "N/A"),
        "opening_hours": r.get("opening_hours", {}).get("weekday_text", []),
        "price_level": str(r.get("price_level", "N/A")),
        "google_maps_url": r.get("url", "N/A"),
    }
