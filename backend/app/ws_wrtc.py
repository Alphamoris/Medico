import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional, Set
import re

from fastapi import APIRouter, WebSocket, HTTPException, status, Depends
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from .database import get_db
from .models import RoomModel

router = APIRouter()

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# WebRTC configuration
WEBRTC_CONFIG = {
    'iceServers': [
        {'urls': ['stun:stun.l.google.com:19302']},
        {'urls': ['stun:stun1.l.google.com:19302']},
    ]
}

class RoomJoinRequest(BaseModel):
    """Pydantic model for room join requests with validation"""
    join_code: int = Field(..., description="6-digit join code to identify the room")
    password: str = Field(..., min_length=1, description="Room access password")

    @field_validator('join_code')
    def validate_join_code(cls, v):
        if not (100000 <= v <= 999999):
            raise ValueError("Join code must be a 6-digit integer")
        return v

    @field_validator('password')
    def validate_password(cls, v):
        if not v.strip():
            raise ValueError("Password cannot be empty")
        return v.strip()

class RoomManager:
    def __init__(self):
        self.rooms: Dict[int, Dict] = {}
        self.inactive_room_check_interval = 300  # 5 minutes
        # Remove automatic task creation since there's no event loop yet
        self.cleanup_task = None

    async def start_cleanup_task(self):
        """Start the cleanup task when an event loop is available"""
        if self.cleanup_task is None:
            self.cleanup_task = asyncio.create_task(self._cleanup_inactive_rooms())

    def verify_room(self, db: Session, join_code: int, password: str) -> Optional[RoomModel]:
        """Verify room exists and password matches"""
        room = db.query(RoomModel).filter(
            RoomModel.join_code == join_code,
            RoomModel.password == password
        ).first()
        return room

    async def _cleanup_inactive_rooms(self):
        """Periodically clean up inactive rooms"""
        while True:
            await asyncio.sleep(self.inactive_room_check_interval)
            current_time = datetime.utcnow()
            inactive_rooms = []
            
            for join_code, room in self.rooms.items():
                if (current_time - room['last_activity']) > timedelta(minutes=30):
                    inactive_rooms.append(join_code)
            
            for join_code in inactive_rooms:
                await self.close_room(join_code)

    async def close_room(self, join_code: int):
        """Close all connections in a room and clean up"""
        if join_code in self.rooms:
            for client_data in self.rooms[join_code]['clients'].values():
                try:
                    await client_data['websocket'].close(code=1000, reason="Room closed due to inactivity")
                except Exception as e:
                    logger.error(f"Error closing websocket: {e}")
            del self.rooms[join_code]
            logger.info(f"Closed inactive room {join_code}")

    async def broadcast_message(self, join_code: int, message: dict, exclude_client: str = None):
        """Broadcast message to all clients in room except sender"""
        if join_code in self.rooms:
            for client_id, client_data in self.rooms[join_code]['clients'].items():
                if client_id != exclude_client:
                    try:
                        await client_data['websocket'].send_json(message)
                    except Exception as e:
                        logger.error(f"Error broadcasting to client {client_id}: {e}")

    def get_room_participants(self, join_code: int) -> list:
        """Get list of participants with their media states"""
        if join_code not in self.rooms:
            return []
        
        participants = []
        for client_id, client_data in self.rooms[join_code]['clients'].items():
            participants.append({
                'client_id': client_id,
                'user_id': client_data['user_id'],
                'username': client_data['username'],
                'isVideoEnabled': client_data['media_state']['isVideoEnabled'],
                'isAudioEnabled': client_data['media_state']['isAudioEnabled']
            })
        return participants

# Initialize room manager
room_manager = RoomManager()

@router.websocket("/ws/{join_code}/{password}")
async def websocket_endpoint(
    websocket: WebSocket, 
    join_code: int, 
    password: str,
    db: Session = Depends(get_db)
):
    # Start cleanup task when first websocket connects
    await room_manager.start_cleanup_task()
    
    client_id = None
    ping_task = None
    
    async def send_ping():
        while True:
            try:
                await websocket.send_json({"type": "ping"})
                await asyncio.sleep(30)
            except Exception as e:
                logger.error(f"Error sending ping: {e}")
                break

    try:
        logger.info(f"Attempting WebSocket connection for room {join_code}")
        
        # Verify room exists and password matches
        room = room_manager.verify_room(db, join_code, password)
        if not room:
            logger.warning(f"Invalid room or password for join_code {join_code}")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        await websocket.accept()
        logger.info(f"WebSocket connection accepted for room {join_code}")
            
        # Initialize room if needed
        if join_code not in room_manager.rooms:
            room_manager.rooms[join_code] = {
                'clients': {},
                'last_activity': datetime.utcnow()
            }
            
        client_id = str(id(websocket))
        
        try:
            # Get user info from initial connection
            initial_data = await websocket.receive_json()
            user_id = initial_data.get('user_id')
            username = initial_data.get('username')
            
            if not user_id or not username:
                raise ValueError("Missing required user information")
        except Exception as e:
            logger.error(f"Error receiving initial data: {e}")
            await websocket.close(code=status.WS_1003_UNSUPPORTED_DATA)
            return
        
        # Store client data with media state
        room_manager.rooms[join_code]['clients'][client_id] = {
            'websocket': websocket,
            'user_id': user_id,
            'username': username,
            'media_state': {
                'isVideoEnabled': False,
                'isAudioEnabled': False
            },
            'last_ping': datetime.utcnow()
        }
        
        # Send WebRTC configuration
        await websocket.send_json({
            "type": "webrtc_config",
            "config": WEBRTC_CONFIG
        })
        
        # Send current participants list
        await websocket.send_json({
            "type": "participants_list",
            "participants": room_manager.get_room_participants(join_code)
        })
        
        # Notify others about new connection
        await room_manager.broadcast_message(
            join_code,
            {
                "type": "user_joined",
                "client_id": client_id,
                "user_id": user_id,
                "username": username,
                "timestamp": datetime.utcnow().isoformat()
            },
            exclude_client=client_id
        )
        
        # Start ping/pong
        ping_task = asyncio.create_task(send_ping())
        
        # Main message handling loop
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                room_manager.rooms[join_code]['last_activity'] = datetime.utcnow()
                
                message_type = message.get("type")
                if not message_type:
                    logger.warning(f"Received message without type from user {username}")
                    continue

                if message_type == "pong":
                    room_manager.rooms[join_code]['clients'][client_id]['last_ping'] = datetime.utcnow()
                
                elif message_type == "offer":
                    if "to_client" not in message:
                        logger.warning(f"Received offer without to_client from user {username}")
                        continue
                    await room_manager.broadcast_message(join_code, message, exclude_client=client_id)
                
                elif message_type == "answer":
                    if "to_client" not in message:
                        logger.warning(f"Received answer without to_client from user {username}")
                        continue
                    target_client = room_manager.rooms[join_code]['clients'].get(message["to_client"])
                    if target_client:
                        await target_client['websocket'].send_json(message)
                    else:
                        logger.warning(f"Target client {message['to_client']} not found for answer")
                
                elif message_type == "ice_candidate":
                    if "to_client" not in message:
                        logger.warning(f"Received ICE candidate without to_client from user {username}")
                        continue
                    target_client = room_manager.rooms[join_code]['clients'].get(message["to_client"])
                    if target_client:
                        await target_client['websocket'].send_json(message)
                    else:
                        logger.warning(f"Target client {message['to_client']} not found for ICE candidate")
                
                elif message_type == "chat":
                    if "content" not in message:
                        logger.warning(f"Received chat message without content from user {username}")
                        continue
                    await room_manager.broadcast_message(
                        join_code,
                        {
                            "type": "chat",
                            "sender": username,
                            "content": message["content"],
                            "timestamp": datetime.utcnow().isoformat()
                        },
                        exclude_client=client_id
                    )
                
                elif message_type == "audioVideoState":
                    if "isVideoEnabled" not in message or "isAudioEnabled" not in message:
                        logger.warning(f"Received incomplete media state update from user {username}")
                        continue
                        
                    room_manager.rooms[join_code]['clients'][client_id]['media_state'].update({
                        'isVideoEnabled': message['isVideoEnabled'],
                        'isAudioEnabled': message['isAudioEnabled']
                    })

                    participants = room_manager.get_room_participants(join_code)
                    await room_manager.broadcast_message(
                        join_code,
                        {
                            "type": "participants_list",
                            "participants": participants
                        }
                    )   
    
                    await room_manager.broadcast_message(
                        join_code,
                        {
                            "type": "media_state_update",
                            "client_id": client_id,
                            "isVideoEnabled": message['isVideoEnabled'],
                            "isAudioEnabled": message['isAudioEnabled']
                        },
                        exclude_client=client_id
                    )
                else:
                    logger.warning(f"Received unknown message type: {message_type} from user {username}")
                
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON received from user {username}")
                continue
            except Exception as e:
                logger.error(f"Error in message loop for user {username}: {e}")
                break
                
    except Exception as e:
        logger.error(f"Failed to establish WebSocket connection: {e}")
        
    finally:
        try:
            if ping_task:
                ping_task.cancel()
                
            if client_id and join_code in room_manager.rooms:
                client_data = room_manager.rooms[join_code]['clients'].get(client_id)
                if client_data:
                    # Notify about disconnection
                    await room_manager.broadcast_message(
                        join_code,
                        {
                            "type": "user_left",
                            "client_id": client_id,
                            "user_id": client_data['user_id'],
                            "username": client_data['username'],
                            "timestamp": datetime.utcnow().isoformat()
                        },
                        exclude_client=client_id
                    )
                    
                    # Cleanup
                    del room_manager.rooms[join_code]['clients'][client_id]
                    if not room_manager.rooms[join_code]['clients']:
                        del room_manager.rooms[join_code]
                        
            logger.info(f"WebSocket connection closed for room {join_code}")
        except Exception as e:
            logger.error(f"Error in cleanup: {e}")