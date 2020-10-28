from pony.orm import db_session, get, select, delete
from fastapi import FastAPI, HTTPException, status, Form
from jose import JWTError, jwt
from pydantic import EmailStr
from typing import Optional

from . import db
from .authentication import *
from .models.user import User


# creating FastAPI instance 
app = FastAPI()


# Endpoint to login a user
@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db.User, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

