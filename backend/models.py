from .database import SessionLocal, Base, engine
from sqlalchemy import Column, String

class User(Base):
    __tablename__ = "users"
    username = Column(String, primary_key=True, unique=True, index=True)
    hashed_password = Column(String)