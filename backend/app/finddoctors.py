from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from sqlalchemy.orm.state import InstanceState

from app.schema import Doctor
from .database import get_db  # Assuming you have a get_db function to get the database session
from .models import DoctorModel  # Importing the DoctorModel

router = APIRouter()

@router.get("/", response_model=list[Doctor])
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(DoctorModel).all()
    doctor_list = []
    for doctor in doctors:
        doctor_dict = {c.key: getattr(doctor, c.key) 
                      for c in doctor.__table__.columns}
        doctor_list.append(doctor_dict)
    return JSONResponse(content=doctor_list)