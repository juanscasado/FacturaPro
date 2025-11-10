from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .. import models, schemas, database
from passlib.hash import sha256_crypt
from jose import jwt, JWTError
import os

SECRET_KEY = os.getenv("SECRET_KEY", "mi_clave_secreta")
security = HTTPBearer()

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
    new_user = models.User(
        email=user.email, 
        password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        company_name=user.company_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Crear token para login automático
    token = jwt.encode({"user_id": new_user.id, "email": new_user.email}, SECRET_KEY, algorithm="HS256")
    
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": {
            "id": new_user.id, 
            "email": new_user.email,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "company_name": new_user.company_name
        }
    }

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not sha256_crypt.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    # genera token incluyendo email
    token = jwt.encode({"user_id": db_user.id, "email": db_user.email}, SECRET_KEY, algorithm="HS256")
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": {
            "id": db_user.id, 
            "email": db_user.email,
            "first_name": getattr(db_user, 'first_name', None),
            "last_name": getattr(db_user, 'last_name', None),
            "company_name": getattr(db_user, 'company_name', None)
        }
    }

@router.get("/verify")
def verify_token(db: Session = Depends(database.get_db), credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verificar si el token es válido y obtener información del usuario"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        db_user = db.query(models.User).filter(models.User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        
        return {
            "user": {
                "id": db_user.id,
                "email": db_user.email,
                "first_name": getattr(db_user, 'first_name', None),
                "last_name": getattr(db_user, 'last_name', None),
                "company_name": getattr(db_user, 'company_name', None)
            }
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# ================================
# FUNCIÓN PARA OBTENER USUARIO ACTUAL
# ================================

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(database.get_db)):
    """Obtener usuario actual desde el token JWT"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        email = payload.get("email")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        # Buscar usuario en la base de datos
        db_user = db.query(models.User).filter(models.User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        
        # Retornar información del usuario para usar en endpoints
        return {
            "user_id": user_id,
            "email": email,
            "company_id": 1  # Por ahora defaulteamos a company_id=1
        }
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
