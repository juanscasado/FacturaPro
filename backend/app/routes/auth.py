from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database
from passlib.hash import sha256_crypt
from jose import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "mi_clave_secreta")

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    # Validación de longitud
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres")

    hashed_password = sha256_crypt.hash(user.password)
    new_user = models.User(email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not sha256_crypt.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    # genera token incluyendo email
    token = jwt.encode({"user_id": db_user.id, "email": db_user.email}, SECRET_KEY, algorithm="HS256")
    return {"access_token": token}
