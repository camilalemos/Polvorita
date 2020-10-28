from pony.orm import db_session, get, select, delete
from fastapi import FastAPI, HTTPException, status, Form
from pydantic import EmailStr
from typing import Optional

from . import db
from .authentication import *
from .models.user import User


# creating FastAPI instance 
app = FastAPI()


# Endpoint to create user
@app.post("/user/", status_code=201)
async def register_user(username: str = Form(..., min_length=5, max_length=20, regex="^[A-Za-z0-9]"),
                        email: EmailStr = Form(...),
                        password: str = Form(..., min_length=8, max_length=20, regex="^[A-Za-z0-9]"),
                        full_name: Optional[str] = Form("")):
    with db_session:
        valid_user = not get(p for p in db.User if p.username == username or p.email == email)
        if valid_user:
            hashed_password = get_password_hash(password)
            user = User(username=username, email=email,hashed_password=hashed_password, full_name=full_name)
            db.User(**user.dict())
        else:
            raise HTTPException(status_code=403, detail=" E-mail or username already exists")

        user_id = get(p for p in db.User if p.username == username and p.email == email).id
        return user_id
