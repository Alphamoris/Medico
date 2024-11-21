from pydantic import BaseModel, EmailStr
from datetime import date,time
from pydantic_settings import BaseSettings, SettingsConfigDict



class User(BaseModel):
    u_id : int
    firstname : str
    lastname : str
    email : EmailStr
    password : str


class Token(BaseModel):
    access_token : str 
    token_type : str
    class Config:
        orm_mode = True

class TokenData:
    u_id : int
    class Config:
        orm_mode = True


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    expiration_time: str

    model_config = SettingsConfigDict(env_file=".env")