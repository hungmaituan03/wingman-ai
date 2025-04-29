# test/tripPlannerTest.py

import os
import sys
import json
from dotenv import load_dotenv

# 1) ensure 'service' is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# 2) load your .env so OPENAI_API_KEY & GOOGLE_MAPS_API_KEY are available
load_dotenv()

from service.trip_planner_service import handle_trip_planning
from models import TripRequest


def main():
    # --- 3) Build a mock TripRequest
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

    try:
        # 4) Call your planner
        result = handle_trip_planning(mock_request)

        # 5) Basic sanity checks
        assert isinstance(result, dict), "Expected a dict"
        assert "summary" in result and isinstance(result["summary"], str), "Missing or invalid 'summary'"
        assert "places" in result and isinstance(result["places"], list), "Missing or invalid 'places'"

        # 6) Print it out for manual inspection
        print(json.dumps(result, indent=2, ensure_ascii=False))

    except AssertionError as ae:
        print(f"❌ Assertion failed: {ae}")
        sys.exit(1)

    except Exception as e:
        print(f"❌ Sanity check failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
