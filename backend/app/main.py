from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import rooms , ai
from . import authentication , medicines , feed , finddoctors , ws_wrtc 
app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)



app.include_router(authentication.router , prefix= "/authenticate")
app.include_router(feed.router , prefix= "/feed")
app.include_router(medicines.router , prefix= "/medicines")
app.include_router(finddoctors.router , prefix= "/finddoctors")
app.include_router(ws_wrtc.router , prefix= "/websockets")
app.include_router(rooms.router , prefix= "/rooms")
app.include_router(ai.router , prefix= "/ai")
