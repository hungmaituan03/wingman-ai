# test/test_trip_out_sanity.py

import os
import sys
import json
from dotenv import load_dotenv
from pydantic import ValidationError

# 1) Make sure 'service' is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# 2) Load API keys from .env
load_dotenv()

# 3) Absolute imports
from service.trip_planner_service import handle_trip_planning
from models import TripRequest, TripOut

def main():
    # 4) Construct a minimal TripRequest
    mock_request = TripRequest(
        location="Shibuya, Tokyo",
        description="anime-themed",
        budget=300.0,
        theme="Anime Culture",
        avoid_activities="nightclubs",
        age_group="Teens",
        number_of_members=2,
        trip_type="day",
        interests={
            "history": 3,
            "art": 2,
            "food": 5,
            "nature": 2,
            "mobility": 4,
            "physical_engagement": 3
        }
    )

    # 5) Run your planner
    raw = handle_trip_planning(mock_request)

    # 6) Try to validate as TripOut
    try:
        trip: TripOut = TripOut.model_validate(raw)
    except ValidationError as e:
        print("❌ Output did not match TripOut schema:")
        print(e.json(indent=2))
        sys.exit(1)

    # 7) If we get here, it’s valid!
    print("✅ Output is a valid TripOut!")
    print(json.dumps(trip.model_dump(), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
