from typing import List
from fastapi import HTTPException , status
from sqlalchemy.orm import Session
from pydantic import EmailStr
from .models import users
from .oauth2 import hashpassword , verify





def get_user( db : Session , username : str , password : str ):
    data = (db.query(users.u_id,users.username,users.password).filter(users.username == username).first())
    if data is None :
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail=f"Invalid Credentials")
    if (verify(password,data.password)):
        return (data.u_id)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail=f"Invalid Credentials")
    
