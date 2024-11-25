"""
FastAPI WebRTC and Chat Server
=============================

This module implements a production-ready WebRTC and WebSocket-based chat server using FastAPI.
It provides secure, scalable handling of:
- WebRTC signaling for audio/video streaming
- WebSocket-based real-time chat
- Room-based communication
- Connection management
- Error handling and logging

Author: Claude
Version: 1.0.0
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Set, Optional, Any
from dataclasses import dataclass
from uuid import uuid4

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlette.websockets import WebSocketState

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="WebRTC and Chat Server",
    description="A production-ready WebRTC signaling and chat server",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class WebRTCOffer(BaseModel):
    sdp: str
    type: str = Field(..., regex="^offer$")
    
class WebRTCAnswer(BaseModel):
    sdp: str
    type: str = Field(..., regex="^answer$")
    
class ICECandidate(BaseModel):
    candidate: str
    sdpMLineIndex: int
    sdpMid: str
    
class ChatMessage(BaseModel):
    content: str
    room_id: str
    client_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
@dataclass
class Room:
    """Represents a chat/video room with its participants and messages."""
    room_id: str
    created_at: datetime
    participants: Dict[str, WebSocket]
    messages: list
    webrtc_offers: Dict[str, Dict]
    last_activity: datetime

class RoomManager:
    """Manages rooms, their participants, and message history."""
    
    def __init__(self):
        self.rooms: Dict[str, Room] = {}
        self.cleanup_task: Optional[asyncio.Task] = None
        
    async def start_cleanup_task(self):
        """Starts the periodic cleanup of inactive rooms."""
        if not self.cleanup_task:
            self.cleanup_task = asyncio.create_task(self._cleanup_inactive_rooms())
            
    async def _cleanup_inactive_rooms(self):
        """Periodically removes inactive rooms older than 24 hours."""
        while True:
            try:
                current_time = datetime.utcnow()
                rooms_to_remove = []
                
                for room_id, room in self.rooms.items():
                    if (current_time - room.last_activity) > timedelta(hours=24):
                        rooms_to_remove.append(room_id)
                        
                for room_id in rooms_to_remove:
                    await self.close_room(room_id)
                    logger.info(f"Removed inactive room: {room_id}")
                    
                await asyncio.sleep(3600)  # Check every hour
            except Exception as e:
                logger.error(f"Error in cleanup task: {e}")
                await asyncio.sleep(60)  # Retry after a minute if there's an error
                
    async def create_room(self, room_id: str) -> Room:
        """Creates a new room if it doesn't exist."""
        if room_id not in self.rooms:
            self.rooms[room_id] = Room(
                room_id=room_id,
                created_at=datetime.utcnow(),
                participants={},
                messages=[],
                webrtc_offers={},
                last_activity=datetime.utcnow()
            )
        return self.rooms[room_id]
        
    async def close_room(self, room_id: str):
        """Closes all connections in a room and removes it."""
        if room_id in self.rooms:
            room = self.rooms[room_id]
            for websocket in room.participants.values():
                try:
                    await websocket.close(code=status.WS_1000_NORMAL_CLOSURE)
                except Exception as e:
                    logger.error(f"Error closing websocket in room {room_id}: {e}")
            del self.rooms[room_id]
            
    async def add_participant(self, room_id: str, client_id: str, websocket: WebSocket) -> None:
        """Adds a participant to a room."""
        room = await self.create_room(room_id)
        room.participants[client_id] = websocket
        room.last_activity = datetime.utcnow()
        
    async def remove_participant(self, room_id: str, client_id: str) -> None:
        """Removes a participant from a room."""
        if room_id in self.rooms:
            room = self.rooms[room_id]
            room.participants.pop(client_id, None)
            room.last_activity = datetime.utcnow()
            
            if not room.participants:
                await self.close_room(room_id)
                
    async def broadcast_to_room(
        self,
        room_id: str,
        message: Any,
        exclude_client: Optional[str] = None
    ) -> None:
        """Broadcasts a message to all participants in a room except the sender."""
        if room_id not in self.rooms:
            return
            
        room = self.rooms[room_id]
        message_str = json.dumps(message) if isinstance(message, dict) else message
        
        for client_id, websocket in room.participants.items():
            if client_id != exclude_client:
                try:
                    if websocket.client_state == WebSocketState.CONNECTED:
                        await websocket.send_text(message_str)
                except Exception as e:
                    logger.error(f"Error broadcasting to client {client_id}: {e}")
                    await self.remove_participant(room_id, client_id)

# Initialize the room manager
room_manager = RoomManager()

@app.on_event("startup")
async def startup_event():
    """Initialize necessary components on server startup."""
    await room_manager.start_cleanup_task()
    logger.info("Server started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on server shutdown."""
    for room_id in list(room_manager.rooms.keys()):
        await room_manager.close_room(room_id)
    if room_manager.cleanup_task:
        room_manager.cleanup_task.cancel()
    logger.info("Server shutdown completed")

# WebRTC Signaling endpoints
@app.post("/api/webrtc/offer/{room_id}")
async def handle_offer(room_id: str, offer: WebRTCOffer) -> JSONResponse:
    """
    Handle incoming WebRTC offers.
    
    Parameters:
        room_id (str): The ID of the room
        offer (WebRTCOffer): The WebRTC offer details
        
    Returns:
        JSONResponse: Contains the offer ID and timestamp
    """
    try:
        room = await room_manager.create_room(room_id)
        offer_id = str(uuid4())
        room.webrtc_offers[offer_id] = {
            "offer": offer.dict(),
            "timestamp": datetime.utcnow().isoformat()
        }
        return JSONResponse({
            "status": "success",
            "offer_id": offer_id
        })
    except Exception as e:
        logger.error(f"Error handling WebRTC offer: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process WebRTC offer"
        )

@app.post("/api/webrtc/answer/{room_id}/{offer_id}")
async def handle_answer(
    room_id: str,
    offer_id: str,
    answer: WebRTCAnswer
) -> JSONResponse:
    """
    Handle WebRTC answer for a specific offer.
    
    Parameters:
        room_id (str): The ID of the room
        offer_id (str): The ID of the offer being answered
        answer (WebRTCAnswer): The WebRTC answer details
        
    Returns:
        JSONResponse: Contains the status and original offer details
    """
    try:
        room = await room_manager.create_room(room_id)
        if offer_id not in room.webrtc_offers:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found"
            )
            
        offer = room.webrtc_offers.pop(offer_id)
        await room_manager.broadcast_to_room(
            room_id,
            {
                "type": "webrtc-answer",
                "offer_id": offer_id,
                "answer": answer.dict()
            }
        )
        
        return JSONResponse({
            "status": "success",
            "offer": offer
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error handling WebRTC answer: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process WebRTC answer"
        )

@app.post("/api/webrtc/ice-candidate/{room_id}/{client_id}")
async def handle_ice_candidate(
    room_id: str,
    client_id: str,
    candidate: ICECandidate
) -> JSONResponse:
    """
    Handle ICE candidates for WebRTC peer connection.
    
    Parameters:
        room_id (str): The ID of the room
        client_id (str): The ID of the client sending the ICE candidate
        candidate (ICECandidate): The ICE candidate details
        
    Returns:
        JSONResponse: Contains the status of the operation
    """
    try:
        await room_manager.broadcast_to_room(
            room_id,
            {
                "type": "ice-candidate",
                "sender": client_id,
                "candidate": candidate.dict()
            },
            exclude_client=client_id
        )
        return JSONResponse({"status": "success"})
    except Exception as e:
        logger.error(f"Error handling ICE candidate: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process ICE candidate"
        )

@app.websocket("/ws/chat/{room_id}/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    client_id: str
):
    """
    Handle WebSocket connections for chat functionality.
    
    Parameters:
        websocket (WebSocket): The WebSocket connection
        room_id (str): The ID of the room
        client_id (str): The ID of the client
    """
    try:
        await websocket.accept()
        await room_manager.add_participant(room_id, client_id, websocket)
        
        # Notify room about new participant
        await room_manager.broadcast_to_room(
            room_id,
            {
                "type": "system",
                "content": f"User {client_id} has joined the room",
                "timestamp": datetime.utcnow().isoformat()
            },
            exclude_client=client_id
        )
        
        try:
            while True:
                # Wait for messages from this client
                data = await websocket.receive_text()
                message = {
                    "type": "chat",
                    "sender": client_id,
                    "content": data,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                # Store message in room history
                if room_id in room_manager.rooms:
                    room_manager.rooms[room_id].messages.append(message)
                    # Keep only last 100 messages
                    room_manager.rooms[room_id].messages = room_manager.rooms[room_id].messages[-100:]
                
                # Broadcast the message
                await room_manager.broadcast_to_room(room_id, message)
                
        except WebSocketDisconnect:
            await room_manager.remove_participant(room_id, client_id)
            await room_manager.broadcast_to_room(
                room_id,
                {
                    "type": "system",
                    "content": f"User {client_id} has left the room",
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
        except Exception as e:
            logger.error(f"Error in WebSocket connection: {e}")
            await room_manager.remove_participant(room_id, client_id)
            
    except Exception as e:
        logger.error(f"Error establishing WebSocket connection: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to establish WebSocket connection"
        )

@app.get("/api/room/{room_id}/status")
async def get_room_status(room_id: str) -> JSONResponse:
    """
    Get the current status of a room.
    
    Parameters:
        room_id (str): The ID of the room
        
    Returns:
        JSONResponse: Contains room statistics and status
    """
    try:
        if room_id not in room_manager.rooms:
            return JSONResponse({
                "status": "not_found",
                "participants": 0,
                "messages": 0
            })
            
        room = room_manager.rooms[room_id]
        return JSONResponse({
            "status": "active",
            "participants": len(room.participants),
            "messages": len(room.messages),
            "created_at": room.created_at.isoformat(),
            "last_activity": room.last_activity.isoformat()
        })
    except Exception as e:
        logger.error(f"Error getting room status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get room status"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=False  # Disable in production
    )