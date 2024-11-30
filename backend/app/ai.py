from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from typing import List
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

class Settings(BaseSettings):
    huggingface_token: str

    class Config:
        env_file = ".env"

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_model(message: ChatMessage):
    try:
        # Validate message
        if not message.message or not message.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Get API token using pydantic settings
        try:
            #api_token = "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"
            api_token = "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"
        except Exception as e:
            raise HTTPException(status_code=500, detail="Invalid Hugging Face API token configuration")

        # API endpoint for Hugging Face Inference API
        API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
        
        headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }

        # Prepare the payload
        payload = {
            "inputs": message.message,
        }

        # Make request to Hugging Face API with timeout
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        except requests.exceptions.Timeout:
            raise HTTPException(status_code=504, detail="Request to Hugging Face API timed out")
        except requests.exceptions.ConnectionError:
            raise HTTPException(status_code=503, detail="Could not connect to Hugging Face API")
        
        # Handle API response status codes
        if response.status_code == 401:
            raise HTTPException(status_code=401, detail="Invalid API token")
        elif response.status_code == 429:
            raise HTTPException(status_code=429, detail="Too many requests to Hugging Face API")
        elif response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error from Hugging Face API: {response.text}"
            )

        # Parse and validate response
        try:
            response_data = response.json()
        except ValueError:
            raise HTTPException(status_code=500, detail="Invalid JSON response from API")

        if not isinstance(response_data, list):
            raise HTTPException(status_code=500, detail="Unexpected response format from API")

        if len(response_data) == 0:
            return ChatResponse(response="I'm sorry, I couldn't generate a response.")

        # Fix: response_data[0] is a list, so we need to handle it differently
        # Let's extract the sentiment with highest score
        sentiments = response_data[0]
        max_sentiment = max(sentiments, key=lambda x: x['score'])
        bot_response = f"The sentiment is {max_sentiment['label']} with confidence {max_sentiment['score']:.2%}"

        return ChatResponse(response=bot_response)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
