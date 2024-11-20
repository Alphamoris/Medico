from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import authentication

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)



app.include_router(authentication.router , prefix= "/authenticate")


