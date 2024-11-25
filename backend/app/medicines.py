from fastapi import APIRouter , Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Medicine


router = APIRouter( tags=["medicines"])

@router.get("/")
async def get_medicines( db : Session = Depends(get_db)):
    medicines = db.query(Medicine).all()
    return medicines