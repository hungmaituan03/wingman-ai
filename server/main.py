from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from models import TripRequest, TripOut
from service.ai_chatbot import handle_chat
from service.google_maps_service import autocomplete_places
from service.trip_planner_service import handle_day_trip

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict to your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class ChatRequest(BaseModel):
    place: str
    radius: str
    unit: str
    description: str
    conversation_id: Optional[str] = None

# Chat endpoint
@app.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    try:
        full_message = (
            f"Place: {chat_request.place}\n"
            f"Radius: {chat_request.radius} {chat_request.unit}\n"
            f"Looking for: {chat_request.description}"
        )
        result = handle_chat(full_message, chat_request.conversation_id)
        return result

    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Autocomplete endpoint
@app.get("/autocomplete")
async def autocomplete_endpoint(query: str = Query(..., min_length=1)):
    try:
        results = autocomplete_places(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Autocomplete error: {str(e)}")

@app.post("/generateTrip", response_model=TripOut)
async def generate_day_trip(trip_req: TripRequest):
    try:
        out = handle_day_trip(trip_req)
        print(">>> outgoing JSON:", out.model_dump_json())
        return out
    except Exception as e:
        raise HTTPException(500, str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
