from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Invoice, User
from ..schemas import InvoiceCreate, InvoiceOut
from ..services.alanube import send_invoice
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import os

SECRET_KEY = os.getenv("SECRET_KEY", "mi_clave_secreta")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(prefix="/invoices", tags=["invoices"])

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

@router.post("/", response_model=InvoiceOut)
def create_invoice(payload: InvoiceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invoice = Invoice(client_id=payload.client_id, description=payload.description, amount=payload.amount)
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # Enviar a Alanube (MVP sandbox)
    result = send_invoice({
        "client_id": payload.client_id,
        "description": payload.description,
        "amount": payload.amount
    })
    invoice.status = result.get("status", "issued")
    db.commit()
    db.refresh(invoice)
    return invoice

@router.get("/", response_model=list[InvoiceOut])
def list_invoices(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Invoice).all()
