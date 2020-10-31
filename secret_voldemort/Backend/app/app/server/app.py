from pony.orm import db_session, get, select, delete, exists
from fastapi import FastAPI, HTTPException, status, Form
from pydantic import EmailStr
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

from . import db
from .authentication import *
from .models.user import User


# FastAPI instance 
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint to create user
@app.post("/user/", status_code=200)
async def register_user(username: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                        email: EmailStr = Form(...),
                        password: str = Form(..., min_length=8, max_length=20, regex="^[A-Za-z0-9]*$"),
                        full_name: Optional[str] = Form("", min_length=8, max_length=30, regex="^[A-Z a-z]*$")):
    with db_session:
        hashed_password = get_password_hash(password)
        user = User(username=username, email=email, hashed_password=hashed_password, full_name=full_name)

        try:
            user_id = db.User(**user.dict()).to_dict()['id']
        except Exception:
            raise HTTPException(status_code=403, detail="Username or E-mail already exist")

        return user_id