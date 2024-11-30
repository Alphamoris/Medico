from datetime import datetime
from sqlalchemy import JSON, DateTime, Float, Column, Integer, String, Boolean, ForeignKey, ARRAY, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class users(Base):  # Changed class name to follow Python naming conventions

    __tablename__ = "users"

    u_id = Column(Integer, autoincrement=True, primary_key=True)
    firstname = Column(String, nullable=False, index=True)
    lastname = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    password = Column(String, unique=True, nullable=False, index=True)

#--------------------BuyMedicine--------------------
class Medicine(Base):
    __tablename__ = "medicines"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    category = Column(String)
    stock = Column(Integer)
    description = Column(String, nullable=True)
    dosage = Column(String, nullable=True)
    requires_prescription = Column(Boolean, default=False)
    rating = Column(Float, nullable=True)
    reviews = Column(Integer, nullable=True)
    discount = Column(Integer, nullable=True)
    expiry = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)

#---------------------END---------------------------------

#--------------------Feed--------------------

class Author(Base):
    __tablename__ = 'authors'

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    role = Column(String, nullable=False)
    verified = Column(Boolean, default=False)

    # Relationship to comments and posts
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(String, primary_key=True)
    author_id = Column(String, ForeignKey('authors.id'), nullable=False)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    post_id = Column(String, ForeignKey('posts.id'), nullable=False)  # Added post_id for relationship

    # Relationship to author
    author = relationship("Author", back_populates="comments")
    post = relationship("Post", back_populates="comments")  # Added relationship to post

class Post(Base):
    __tablename__ = 'posts'

    id = Column(String, primary_key=True)
    author_id = Column(String, ForeignKey('authors.id'), nullable=False)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    liked = Column(Boolean, default=False)
    shares = Column(Integer, default=0)
    tags = Column(String)  # Consider using a separate table for tags
    read_time = Column(String, nullable=True)
    trending = Column(Boolean, default=False)
    image = Column(String, nullable=True)
    completed_time = Column(DateTime, nullable=True)

    # Relationship to author
    author = relationship("Author", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")  # Added relationship to comments

#---------------------END---------------------------------


#--------------------FindDoctors---------------------------------

class DoctorModel(Base):
    __tablename__ = 'doctors'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    speciality = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    reviews = Column(Integer, nullable=False)
    experience = Column(String, nullable=False)
    image = Column(String, nullable=True)
    next_available = Column(String, nullable=False)
    location = Column(String, nullable=False)
    patients = Column(String, nullable=False)
    education = Column(String, nullable=False)
    languages = Column(ARRAY(String), nullable=False)  # Assuming languages are stored as an array of strings
    consultation_fee = Column(Float, nullable=False)
    availability = Column(ARRAY(String), nullable=False)  # Assuming availability is stored as an array of strings
    verified = Column(Boolean, default=False)
    awards = Column(Integer, nullable=False)
    bio = Column(Text, nullable=True)
    time_slots = Column(ARRAY(String), nullable=False)  # Assuming time slots are stored as an array of strings
    specializations = Column(ARRAY(String), nullable=False)  # Assuming specializations are stored as an array of strings
    insurance_accepted = Column(ARRAY(String), nullable=False)  # Assuming insurance accepted is stored as an array of strings
    hospital_affiliations = Column(ARRAY(String), nullable=False)  # Assuming hospital affiliations are stored as an array of strings

#---------------------END---------------------------------


#--------------------Websocket & Chat---------------------------------

class RoomModel(Base):
    __tablename__ = 'rooms'
    id = Column(Integer , unique= False , nullable= False)
    room_name = Column(String , nullable= False )
    join_code = Column(Integer, primary_key=True, comment="This is a 6 digit unique join code")
    password = Column(String)
    last_activity = Column(DateTime)
    class Config:
        orm_mode = True

class ParticipantModel(Base):
    __tablename__ = 'participants'
    id = Column(Integer, primary_key=True ,nullable=False)
    join_code   = Column(Integer, ForeignKey('rooms.join_code'))

class WebRTCOfferModel(Base):
    __tablename__ = 'webrtc_offers'
    id = Column(Integer, primary_key=True)
    join_code = Column(Integer, ForeignKey('rooms.join_code'))
    offer_id = Column(String)
    offer_details = Column(JSON)
    expires_at = Column(DateTime)

#--------------------Room---------------------------------

# class RoomModel(Base):
#     """SQLAlchemy model for storing room information"""
#     __tablename__ = 'rooms'

#     id = Column(Integer, primary_key=True, index=True)
#     room_id = Column(String, unique=True, index=True, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     last_activity = Column(DateTime, default=datetime.utcnow)
#     max_participants = Column(Integer, default=10)  # Added max participants limit
#     is_locked = Column(Boolean, default=False)  # Added room locking capability

# class ParticipantModel(Base):
#     """SQLAlchemy model for storing participant information"""
#     __tablename__ = 'participants'

#     id = Column(Integer, primary_key=True, index=True)
#     client_id = Column(String, nullable=False, index=True)
#     room_id = Column(String, nullable=False, index=True)
#     joined_at = Column(DateTime, default=datetime.now)
#     left_at = Column(DateTime, nullable=True)
#     connection_status = Column(String, default='connected')  # Track connection state
#     last_heartbeat = Column(DateTime, nullable=False, default=datetime.now)  # For detecting stale connections

# class MessageModel(Base):
#     """SQLAlchemy model for storing chat messages"""
#     __tablename__ = 'messages'

#     id = Column(Integer, primary_key=True, index=True)
#     room_id = Column(String, nullable=False, index=True)
#     client_id = Column(String, nullable=False)
#     content = Column(Text, nullable=False)
#     timestamp = Column(DateTime, default=datetime.utcnow)
#     message_type = Column(String, nullable=False)
#     delivered = Column(Boolean, default=False)  # Track message delivery
#     error = Column(String, nullable=True)  # Store any delivery errors

# class WebRTCOfferModel(Base):
#     """SQLAlchemy model for storing WebRTC offers"""
#     __tablename__ = 'webrtc_offers'

#     id = Column(Integer, primary_key=True, index=True)
#     room_id = Column(String, nullable=False, index=True)
#     offer_id = Column(String, unique=True, nullable=False)
#     offer_details = Column(JSON, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     expires_at = Column(DateTime)  # Added offer expiration
#     status = Column(String, default='pending')  # Track offer status


#---------------------END--------------------------------- 
