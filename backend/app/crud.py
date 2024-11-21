from typing import List
from fastapi import HTTPException , status
from sqlalchemy.orm import Session
from pydantic import EmailStr

from app.schema import User
from .models import users
from .oauth2 import hashpassword , verify





def login( db : Session , username : str , password : str ):
    data = (db.query(users.u_id,users.email,users.password).filter(users.email == username).first())
    if data is None :
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail=f"Invalid Credentials")
    if (verify(password,data.password)):
        return (data.u_id)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail=f"Invalid Credentials")
    
def signup( db : Session , new_user : User):
    new_user.password = hashpassword(new_user.password)
    data = users(**(dict(new_user)))
    db.add(data)
    db.commit()
    db.refresh(data)
    return "Successfully Registered New User"