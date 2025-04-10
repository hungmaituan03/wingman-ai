# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from service.ai_chatbot import handle_chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, but you can restrict it to your specific frontend URL.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all headers.
)

class ChatRequest(BaseModel):
    message: str
    conversation_id: str = None

@app.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    try:
        result = handle_chat(chat_request.message, chat_request.conversation_id)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
