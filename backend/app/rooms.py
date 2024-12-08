from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, time
from app.models import RoomModel, ParticipantModel
from sqlalchemy.orm import Session
from app.database import get_db
from .schema import RoomCreate, ParticipantCreate, SendRoomDetails

router = APIRouter()



@router.get("/get_room_details", response_model=list[SendRoomDetails])
async def get_room_details(id: int, db: Session = Depends(get_db)):
    rooms = db.query(RoomModel).filter(RoomModel.id == id).all()
    return [{
        "join_code": room.join_code,
        "password": room.password,
        "room_name": room.room_name,
        "date": room.last_activity.date().isoformat(),  # Extract date
        "time": room.last_activity.strftime('%I:%M %p')  # Convert to 12-hour format with AM/PM
    } for room in rooms]


@router.post("/create_room", response_model=dict)
async def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    db_room = RoomModel(
        id = room.id , 
        room_name = room.room_name,
        join_code=room.join_code,
        password=room.password,
        last_activity=datetime.utcnow()
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return {"join_code": db_room.join_code}

@router.post("/join_room", response_model=dict) 
async def join_room(participant: ParticipantCreate, db: Session = Depends(get_db)):
    # Verify room exists
    room = db.query(RoomModel).filter(RoomModel.join_code == participant.join_code).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
        
    db_participant = ParticipantModel(
        join_code=participant.join_code
    )
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return {"join_code": db_participant.join_code}


@router.get("/get_room_details", response_model=list[SendRoomDetails])
async def get_room_details(id: int, db: Session = Depends(get_db)):
    rooms = db.query(RoomModel).filter(RoomModel.id == id).all()
    return [{"join_code": room.join_code, "password": room.password, 
             "room_name": room.room_name , "date": room.last_activity.date().isoformat(),
             "time": f"{room.last_activity.strftime('%I:%M')} {room.last_activity.strftime('%p')}"} for room in rooms]   

@router.get("/delete_room", response_model=dict)
async def delete_room(join_code: int, db: Session = Depends(get_db)):
    room = db.query(RoomModel).filter(RoomModel.join_code == join_code).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Delete participants associated with the room before deleting the room
    db.query(ParticipantModel).filter(ParticipantModel.join_code == join_code).delete()
    
    db.delete(room)
    db.commit()
    return {"message": "Room deleted successfully"}

@router.get("/get_room_details_by_join_code")
async def get_room_details_by_join_code(join_code: int, db: Session = Depends(get_db)):
    room = db.query(RoomModel).filter(RoomModel.join_code == join_code).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"join_code": room.join_code, "password": room.password}