from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import date, datetime,time
from pydantic_settings import BaseSettings, SettingsConfigDict



class User(BaseModel):
    u_id : int | None = None
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


class AuthorSchema(BaseModel):
    id: str
    name: str
    avatar: str
    role: str
    verified: bool

class CommentSchema(BaseModel):
    id: str
    author: AuthorSchema
    content: str
    timestamp: str
    likes: int

class PostSchema(BaseModel):
    id: str
    author: AuthorSchema
    content: str
    timestamp: str
    likes: int
    liked: bool
    comments: List[CommentSchema]
    shares: int
    tags: List[str]
    read_time: str
    trending: bool
    image: str = None
    completed_time: str = None


class TimeSlot(BaseModel):
    time: str
    available: bool

class Doctor(BaseModel):
    id: int
    name: str
    speciality: str
    rating: float
    reviews: int
    experience: str
    image: str
    nextAvailable: str
    location: str
    patients: str
    education: str
    languages: List[dict]  # Adjust as needed for specific structure
    consultationFee: float
    availability: List[str]
    verified: bool
    awards: int
    bio: Optional[str] = None
    timeSlots: dict[str, List[TimeSlot]]
    specializations: List[str]
    insuranceAccepted: List[str]
    hospitalAffiliations: List[str]













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