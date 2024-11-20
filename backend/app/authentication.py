from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .schema import Token
from .database import get_db
from .oauth2 import create_token
from .crud import get_user


router = APIRouter()

@router.post("/login")
def getuser( credentials : Annotated[OAuth2PasswordRequestForm , Depends()], db : Session = Depends(get_db)) -> Token:
    print(credentials.username , credentials.password)
    data = get_user( db = db , username= credentials.username , password= credentials.password)
    if data:
        tok = create_token(data={"u_id" : data})
        return Token(access_token = tok , token_type = "bearer")
    return data