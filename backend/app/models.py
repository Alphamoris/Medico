from sqlalchemy import Column , ForeignKey , Integer, BIGINT , String ,Time , Date , func , Float
from sqlalchemy.orm import relationship
from .database import Base


class users(Base):

    __tablename__ = "users"

    u_id = Column( Integer , autoincrement=True , primary_key=True )
    firstname = Column( String , nullable=False , index=True )
    lastname = Column( String , nullable=False , index=True )
    email = Column( String , nullable=False , unique=True , index=True )
    password = Column( String , unique=True , nullable=False , index=True)
    

