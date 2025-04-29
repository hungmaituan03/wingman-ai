# src/models.py

from pydantic import BaseModel, root_validator, Field
from typing import List, Optional, Dict, Any, Literal


class TripRequest(BaseModel):
    location: str                   # e.g. "Shibuya, Tokyo"
    description: str                # e.g. "anime-themed"
    budget: float                   # total budget for the day
    currency: str = "USD"           # defaults to USD
    number_of_members: int = 1      # how many people
    age_group: Optional[str] = None # e.g. "Teens"
    theme: Optional[str] = None     # e.g. "Anime Culture"
    avoid_activities: Optional[str] = None   # e.g. "nightclubs"
    interests: Dict[str, int]       # e.g. {"history":3, "food":5, ...}
    conversation_id: Optional[str] = None    # auto-filled if you need to track context
    trip_type: str = "day"


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class PlaceCard(BaseModel):
    id: str
    name: str
    address: str

    # make geometry optional with an empty default
    geometry: Dict[str, Any] = Field(default_factory=dict)

    # lat/lng still come from geometry if present
    lat: float = 0.0
    lng: float = 0.0

    photoUrls: List[str] = []
    rating: float
    user_ratings_total: int = 0
    price_level: Optional[str] = None
    types: List[str] = []

    phone_number: Optional[str] = None
    website: Optional[str] = None
    opening_hours: List[str] = []

    google_maps_url: Optional[str] = None

    @root_validator(pre=True)
    def extract_lat_lng(cls, values):
        geom = values.get("geometry", {})
        loc = geom.get("location", {})
        # only override lat/lng if they weren't explicitly passed
        values.setdefault("lat", loc.get("lat", 0.0))
        values.setdefault("lng", loc.get("lng", 0.0))
        return values

    class Config:
        extra = "allow"


class ItinerarySegment(BaseModel):
    morning: List[PlaceCard]
    afternoon: List[PlaceCard]
    evening: List[PlaceCard]


class BudgetBreakdown(BaseModel):
    accommodation: float
    transport: float
    food: float
    activities: float


class Budget(BaseModel):
    total_per_person: float
    currency: str
    breakdown: BudgetBreakdown


class TripOut(BaseModel):
    conversation_id: str
    messages: List[ChatMessage]

    summary: str
    tips: List[str]
    budget: Budget
    general_places: List[PlaceCard]
    itinerary: ItinerarySegment
