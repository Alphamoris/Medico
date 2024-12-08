from fastapi import APIRouter, Depends
from .database import get_db
from sqlalchemy.orm import Session
from .models import Feedback
from .schema import Feedbackcls

router = APIRouter()

@router.post("/")
def feedback(feedback : Feedbackcls , db : Session = Depends(get_db)):
    data = Feedback(**(dict(feedback)))
    db.add(data)
    db.commit()
    return {"message": "Feedback submitted successfully"}

