from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from .user_service import UserService
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
import docker
from backend.docker_utils import get_container_statuses, get_container_logs
from backend.metrics import get_system_metrics
from .database import SessionLocal, Base, engine, get_db
import os
from .models import User

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY") or "your-secret-key"

Base.metadata.create_all(bind=engine)

class RegisterModel(BaseModel):
    username: str
    password: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
user_service = UserService(SECRET_KEY)

@app.get("/verify")
def verify(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if user_service.verify_token(token, db):
        return {"verified": True}
    else:
        return {"verified": False}

@app.post("/register")
def register(user: RegisterModel, db: Session = Depends(get_db)):
    hashed = pwd_context.hash(user.password)
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = User(username=user.username, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    return {"msg": "User registered"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == form_data.username).first()
    if not db_user or not pwd_context.verify(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": db_user.username}, SECRET_KEY, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

@app.get("/docker-check")
def docker_check():
    try:
        client = docker.from_env()
        client.ping()
        return {"docker": True}
    except Exception:
        return {"docker": False}

@app.get("/status")
def status():
    return get_container_statuses()

@app.get("/logs/{container_name}")
def logs(container_name: str, lines: int = 100):
    return get_container_logs(container_name, lines)

@app.get("/metrics")
def metrics():
    return get_system_metrics()

@app.post("/deploy")
def deploy():
    return 
