from pony.orm import db_session, get, select, delete
from fastapi import FastAPI, HTTPException, status, Form
from jose import JWTError, jwt
from pydantic import EmailStr
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

from . import db
from .authentication import *
from .user import User


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

@app.post("/user/", status_code=201)
async def register_user(username: str = Form(..., min_length=5, max_length=20, regex="^[A-Z_a-z0-9]*$"),
                        email: EmailStr = Form(...),
                        password: str = Form(..., min_length=8, max_length=20, regex="^[A-Za-z0-9]*$"),
                        full_name: Optional[str] = Form("", min_length=8, max_length=30, regex="^[A-Z a-z]*$")):
    with db_session:
        hashed_password = get_password_hash(password)
        user = User(username=username, email=email, password=hashed_password, full_name=full_name)

        try:
            user_id = db.User(**user.dict()).to_dict()['id']
        except Exception:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Username or E-mail already exist")

        return user_id

# Endpoint to user login 
@app.post("/token/", status_code=201, response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db.User, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

