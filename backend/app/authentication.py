from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .schema import Token , User
from .database import get_db
from .oauth2 import create_token 
from .crud import login,signup


router = APIRouter()

@router.post("/login")
def get_user( credentials : Annotated[OAuth2PasswordRequestForm , Depends()], db : Session = Depends(get_db)) -> Token:
    data = login( db = db , username= credentials.username , password= credentials.password)
    if data:
        tok = create_token(data={"u_id" : data})
        return Token(access_token = tok , token_type = "bearer")
    return data


@router.post("/signup")
def new_user( user : User , db : Session = Depends(get_db)):
    msg = signup(db = db , new_user = user )
    return msg