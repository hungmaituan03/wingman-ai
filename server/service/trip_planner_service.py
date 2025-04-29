import os
import json
from uuid import uuid4
from dotenv import load_dotenv
from openai import OpenAI
from typing import List, Tuple, Dict, Any

from models import (
    TripRequest,
    TripOut,
    ChatMessage,
    PlaceCard,
    ItinerarySegment,
    Budget,
    BudgetBreakdown,
)
from service.google_maps_service import get_places_from_names

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def handle_day_trip(trip: TripRequest) -> TripOut:
    """
    1) Build 'general_places' (hotel, restaurant, quick_stop)
    2) Build 'itinerary' places (what to visit), then segment them
    3) Fetch summary & tips, stub budget, assemble TripOut (with full chat history)
    """
    # ─── PREPARE CHAT HISTORY & SESSION ID ─────────────────────────────────────
    messages: List[ChatMessage] = []
    convo_id = trip.conversation_id or str(uuid4())

    print("🔔 [handle_day_trip] got TripRequest:")
    print(json.dumps(trip.model_dump(), ensure_ascii=False, indent=2))

    # ─── 1) ESSENTIAL / GENERAL PLACES ────────────────────────────────────────
    essential = _get_ai_essential_place_list(trip, messages)
    raw_general = []
    for e in essential:
        details = get_places_from_names([e["name"]])
        if details:
            details[0]["category"] = e["category"]
            raw_general.append(details[0])

    general_cards: List[PlaceCard] = []
    for p in raw_general:
        loc = p["geometry"]["location"]
        general_cards.append(
            PlaceCard(
                id=str(uuid4()),
                name=p.get("name", ""),
                address=p.get("address", p.get("formatted_address", "")),
                lat=loc.get("lat", 0.0),
                lng=loc.get("lng", 0.0),
                photoUrls=p.get("photoUrls", []),
                rating=float(p.get("rating", 0) or 0),
                user_ratings_total=int(p.get("user_ratings_total", 0) or 0),
                price_level=str(p.get("price_level", "") or ""),
                types=p.get("types", []) + [p.get("category")],
                phone_number=p.get("phone_number"),
                website=p.get("website"),
                opening_hours=p.get("opening_hours", []),
                google_maps_url=p.get("google_maps_url"),
            )
        )

    # ─── 2) ITINERARY PLACES ──────────────────────────────────────────────────
    itinerary_names = _get_ai_itinerary_place_list(trip, num_places=5, messages=messages)
    raw_itinerary = get_places_from_names(itinerary_names)

    itinerary_cards: List[PlaceCard] = []
    for p in raw_itinerary:
        loc = p["geometry"]["location"]
        itinerary_cards.append(
            PlaceCard(
                id=str(uuid4()),
                name=p.get("name", ""),
                address=p.get("address", p.get("formatted_address", "")),
                lat=loc.get("lat", 0.0),
                lng=loc.get("lng", 0.0),
                photoUrls=p.get("photoUrls", []),
                rating=float(p.get("rating", 0) or 0),
                user_ratings_total=int(p.get("user_ratings_total", 0) or 0),
                price_level=str(p.get("price_level", "") or ""),
                types=p.get("types", []),
                phone_number=p.get("phone_number"),
                website=p.get("website"),
                opening_hours=p.get("opening_hours", []),
                google_maps_url=p.get("google_maps_url"),
            )
        )

    # ─── SEGMENT ITINERARY ────────────────────────────────────────────────────
    seg_map = _get_ai_itinerary_segments(trip, itinerary_cards, messages)
    itinerary_seg = ItinerarySegment(
        morning=[c for c in itinerary_cards if c.id in seg_map.get("morning", [])],
        afternoon=[c for c in itinerary_cards if c.id in seg_map.get("afternoon", [])],
        evening=[c for c in itinerary_cards if c.id in seg_map.get("evening", [])],
    )

    # ─── 3) SUMMARY, TIPS ──────────────────────────────────────────────────────
    summary, tips = _get_ai_summary_and_tips(trip, messages)

    # ─── 4) STUB BUDGET & ASSEMBLE OUTPUT ─────────────────────────────────────
    breakdown = BudgetBreakdown(accommodation=100, transport=50, food=75, activities=75)
    budget = Budget(
        total_per_person=(
            breakdown.accommodation
            + breakdown.transport
            + breakdown.food
            + breakdown.activities
        ),
        currency=trip.currency or "USD",
        breakdown=breakdown,
    )

    trip_out = TripOut(
        conversation_id=convo_id,
        messages=messages,
        summary=summary,
        tips=tips,
        budget=budget,
        general_places=general_cards,
        itinerary=itinerary_seg,
    )

    print("🚀 [handle_day_trip] response TripOut:")
    print(json.dumps(trip_out.model_dump(), ensure_ascii=False, indent=2))

    return trip_out


def _get_ai_essential_place_list(
    trip: TripRequest, messages: List[ChatMessage]
) -> List[Dict[str, str]]:
    """
    Returns [{"category":"hotel","name":"..."},
             {"category":"restaurant","name":"..."},
             {"category":"quick_stop","name":"..."}]
    """
    payload = json.dumps(trip.model_dump(), ensure_ascii=False)
    system = (
        "You are a travel planner. Return ONLY a JSON array of three objects:\n"
        '  - "category": one of "hotel","restaurant","quick_stop"\n'
        '  - "name": the place name string\n'
        "Do not include any other keys or text."
    )
    user = f"Trip data:\n{payload}\n\nSuggest exactly one hotel, one restaurant, and one quick stop."

    # record prompts
    messages.append(ChatMessage(role="system", content=system))
    messages.append(ChatMessage(role="user", content=user))

    resp = client.chat.completions.create(
        model="gpt-4-turbo",
        temperature=0.0,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        max_tokens=150,
    )
    raw = resp.choices[0].message.content.strip()

    # record assistant reply
    messages.append(ChatMessage(role="assistant", content=raw))

    # parse JSON
    try:
        arr = json.loads(raw)
        if (
            isinstance(arr, list)
            and {o.get("category") for o in arr} == {"hotel", "restaurant", "quick_stop"}
        ):
            return arr
    except json.JSONDecodeError:
        pass

    # fallback
    lines = [l.strip("• ") for l in raw.splitlines() if l.strip()]
    cats = ["hotel", "restaurant", "quick_stop"]
    return [
        {"category": cats[i], "name": lines[i] if i < len(lines) else ""}
        for i in range(3)
    ]


def _get_ai_itinerary_place_list(
    trip: TripRequest, num_places: int, messages: List[ChatMessage]
) -> List[str]:
    """
    Ask GPT for a JSON array of place names to visit based on the trip request.
    """
    payload = json.dumps(trip.model_dump(), ensure_ascii=False)
    system = (
        "You are a travel assistant. Return ONLY a JSON array of place names "
        "that would make a good day-trip itinerary."
    )
    user = f"Trip data:\n{payload}\n\nSuggest exactly {num_places} places to visit."

    messages.append(ChatMessage(role="system", content=system))
    messages.append(ChatMessage(role="user", content=user))

    resp = client.chat.completions.create(
        model="gpt-4-turbo",
        temperature=0.0,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        max_tokens=200,
    )
    raw = resp.choices[0].message.content.strip()
    messages.append(ChatMessage(role="assistant", content=raw))

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return [l.strip("• ") for l in raw.splitlines() if l.strip()]


def _get_ai_itinerary_segments(
    trip: TripRequest, cards: List[PlaceCard], messages: List[ChatMessage]
) -> Dict[str, List[str]]:
    """
    Given cards, ask GPT to segment them into morning/afternoon/evening by ID.
    """
    opts = [{"id": c.id, "name": c.name} for c in cards]
    payload = json.dumps(trip.model_dump(), ensure_ascii=False)
    places_payload = json.dumps(opts, ensure_ascii=False)

    system = (
        "You are a JSON-only itinerary planner. "
        "Given trip data and a list of {id,name}, assign each id to morning, afternoon, or evening. "
        "Reply with exactly:\n"
        "{\n"
        '  "morning": ["id1","id2"],\n'
        '  "afternoon": ["id3",...],\n'
        '  "evening": ["id4",...]\n'
        "}\nUse only provided ids."
    )
    user = f"Trip data:\n{payload}\n\nPlace options:\n{places_payload}"

    messages.append(ChatMessage(role="system", content=system))
    messages.append(ChatMessage(role="user", content=user))

    resp = client.chat.completions.create(
        model="gpt-4-turbo",
        temperature=0.0,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        max_tokens=200,
    )
    raw = resp.choices[0].message.content.strip()
    messages.append(ChatMessage(role="assistant", content=raw))

    # parse JSON block
    start = raw.find("{")
    end = raw.rfind("}")
    if start != -1 and end != -1:
        try:
            seg = json.loads(raw[start : end + 1])
            return {
                "morning": seg.get("morning", []),
                "afternoon": seg.get("afternoon", []),
                "evening": seg.get("evening", []),
            }
        except json.JSONDecodeError:
            pass

    # fallback round-robin
    ids = [c.id for c in cards]
    return {"morning": ids[:1], "afternoon": ids[1:2], "evening": ids[2:]}


def _get_ai_summary_and_tips(
    trip: TripRequest, messages: List[ChatMessage]
) -> Tuple[str, List[str]]:
    """
    Return exactly {"summary":..., "tips":[...]} or fallback to raw summary.
    """
    system = (
        "You are a JSON-only travel assistant. Reply only with:\n"
        "{\n"
        '  "summary":"<one paragraph>",\n'
        '  "tips":["tip1","tip2","tip3"]\n'
        "}\n"
    )
    user = f"Plan a day trip in {trip.location} themed “{trip.description}”. Reply only with that JSON."

    messages.append(ChatMessage(role="system", content=system))
    messages.append(ChatMessage(role="user", content=user))

    resp = client.chat.completions.create(
        model="gpt-4-turbo",
        temperature=0.0,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        max_tokens=300,
    )
    raw = resp.choices[0].message.content.strip()
    messages.append(ChatMessage(role="assistant", content=raw))

    # extract JSON
    start, end = raw.find("{"), raw.rfind("}")
    if start != -1 and end != -1:
        try:
            obj = json.loads(raw[start : end + 1])
            summary = obj.get("summary", "").strip()
            tips = obj.get("tips", [])
            if isinstance(tips, list):
                return summary, tips
        except json.JSONDecodeError:
            pass

    return raw, []
