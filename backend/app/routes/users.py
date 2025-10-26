from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserOut, UserPasswordUpdate
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from passlib.hash import sha256_crypt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "mi_clave_secreta")
router = APIRouter(prefix="/users", tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        user = db.query(User).get(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no autorizado")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me/password")
def change_password(body: UserPasswordUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not sha256_crypt.verify(body.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="La nueva contraseña debe tener al menos 6 caracteres")
    current_user.password = sha256_crypt.hash(body.new_password)
    db.add(current_user)
    db.commit()
    return {"detail": "Contraseña actualizada"}
