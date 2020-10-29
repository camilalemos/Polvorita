from pony.orm import db_session, get, select, delete, exists
from fastapi import FastAPI, HTTPException, status, Form
from pydantic import EmailStr
from typing import Optional

from . import db
from .authentication import *
from .models.user import User


# FastAPI instance 
app = FastAPI()


# Endpoint to create user
@app.post("/user/", status_code=201)
async def register_user(username: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                        email: EmailStr = Form(...),
                        password: str = Form(..., min_length=8, max_length=20, regex="^[A-Za-z0-9]*$"),
                        full_name: Optional[str] = Form("", min_length=8, max_length=30, regex="^[A-Z a-z]*$")):

    with db_session:
        valid_username = not exists(p for p in db.User if p.username == username)
        valid_email = not exists(p for p in db.User if p.email == email)

        if valid_username and valid_email:
            hashed_password = get_password_hash(password)
            user = User(username=username, email=email, hashed_password=hashed_password, full_name=full_name)
            db.User(**user.dict())
        elif not valid_username:
            raise HTTPException(status_code=403, detail="Username already exist")
        elif not valid_email:
            raise HTTPException(status_code=403, detail="E-mail already exist")

        user_id = get(p for p in db.User if p.username == username and p.email == email).id
        return user_id