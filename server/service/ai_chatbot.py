from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def handle_chat(message: str, conversation_id: str = None) -> dict:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            max_tokens=500,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message}
            ]
        )

        return {
            "response": response.choices[0].message.content.strip(),
            "conversation_id": conversation_id or "new_convo"
        }
    except Exception as e:
        raise RuntimeError(f"ChatService Error: {str(e)}")
