from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from service.ai_chatbot import handle_chat
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, but you can restrict it to your specific frontend URL.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all headers.
)

class ChatRequest(BaseModel):
    place: str
    radius: str
    unit: str
    description: str
    conversation_id: Optional[str] = None

@app.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    try:
        # Combine all parameters into a structured message
        full_message = (
            f"Place: {chat_request.place}\n"
            f"Radius: {chat_request.radius} {chat_request.unit}\n"
            f"Looking for: {chat_request.description}"
        )
        
        # You might want to pass the structured data separately to handle_chat
        # for more sophisticated processing
        result = handle_chat(full_message, chat_request.conversation_id)
        return result
    
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)