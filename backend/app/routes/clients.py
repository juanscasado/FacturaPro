from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import os

SECRET_KEY = os.getenv("SECRET_KEY", "mi_clave_secreta")

router = APIRouter(prefix="/clients", tags=["clients"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # URL del login

# Dependable para obtener usuario actual desde JWT
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        user = db.query(models.User).get(user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no autorizado")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

# Crear cliente
@router.post("/", response_model=schemas.ClientOut)
def create_client(client: schemas.ClientCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    new_client = models.Client(**client.dict(), user_id=current_user.id)
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client

# Listar clientes
@router.get("/", response_model=list[schemas.ClientOut])
def list_clients(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    clients = db.query(models.Client).filter(models.Client.user_id == current_user.id).all()
    return clients

# Obtener un cliente por ID
@router.get("/{client_id}", response_model=schemas.ClientOut)
def get_client(client_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    client = db.query(models.Client).filter(models.Client.id == client_id, models.Client.user_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client

# Actualizar cliente
@router.put("/{client_id}", response_model=schemas.ClientOut)
def update_client(client_id: int, client_data: schemas.ClientCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    client = db.query(models.Client).filter(models.Client.id == client_id, models.Client.user_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for key, value in client_data.dict().items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client

# Eliminar cliente
@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    client = db.query(models.Client).filter(models.Client.id == client_id, models.Client.user_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(client)
    db.commit()
    return {"detail": "Cliente eliminado correctamente"}
