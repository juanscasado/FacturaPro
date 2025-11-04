from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import os
import requests
import json
from pydantic import BaseModel
from typing import Optional

SECRET_KEY = os.getenv("SECRET_KEY", "mi_clave_secreta")

# Configuración de Alanube
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'
ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'
ALANUBE_COMPANY_ID = 'c6b67743-886d-415b-abe0-72e7db165051'  # ID real extraído del token

router = APIRouter(prefix="/alanube", tags=["alanube"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Esquemas para las peticiones
class InvoiceRequest(BaseModel):
    client_id: int
    description: str
    amount: float

class AlanubeResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

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

# Validar conexión con Alanube
@router.get("/validate", response_model=AlanubeResponse)
def validate_alanube_connection(current_user: models.User = Depends(get_current_user)):
    try:
        headers = {
            'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        response = requests.get(f'{ALANUBE_API_BASE}company', headers=headers, timeout=30)
        
        if response.status_code == 200:
            company_data = response.json()
            return AlanubeResponse(
                success=True,
                message="Conexión con Alanube exitosa",
                data=company_data
            )
        else:
            return AlanubeResponse(
                success=False,
                message=f"Error de Alanube: {response.status_code} - {response.text}"
            )
            
    except Exception as e:
        return AlanubeResponse(
            success=False,
            message=f"Error conectando con Alanube: {str(e)}"
        )

# Obtener información de la empresa
@router.get("/company", response_model=AlanubeResponse)
def get_alanube_company(current_user: models.User = Depends(get_current_user)):
    try:
        headers = {
            'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        response = requests.get(f'{ALANUBE_API_BASE}company', headers=headers, timeout=30)
        
        if response.status_code == 200:
            return AlanubeResponse(
                success=True,
                message="Información de empresa obtenida",
                data=response.json()
            )
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error de Alanube: {response.text}"
            )
            
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error conectando con Alanube: {str(e)}"
        )

# Crear factura en Alanube
@router.post("/invoice", response_model=AlanubeResponse)
def create_alanube_invoice(
    invoice_request: InvoiceRequest, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        # Obtener información del cliente
        client = db.query(models.Client).filter(
            models.Client.id == invoice_request.client_id,
            models.Client.user_id == current_user.id
        ).first()
        
        if not client:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        
        # Preparar datos para Alanube
        alanube_data = {
            "rnc": client.rnc,
            "buyer_name": client.name,
            "buyer_rnc": client.rnc,
            "currency": "DOP",
            "total_amount": invoice_request.amount,
            "items": [
                {
                    "description": invoice_request.description,
                    "quantity": 1,
                    "unit_price": invoice_request.amount,
                    "total_amount": invoice_request.amount
                }
            ]
        }
        
        headers = {
            'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        # Enviar a Alanube
        response = requests.post(
            f'{ALANUBE_API_BASE}invoice-fiscals/{ALANUBE_COMPANY_ID}',
            headers=headers,
            json=alanube_data,
            timeout=60
        )
        
        if response.status_code in [200, 201]:
            alanube_response = response.json()
            
            # Guardar la factura en nuestra base de datos también
            new_invoice = models.Invoice(
                client_id=client.id,
                user_id=current_user.id,
                description=invoice_request.description,
                amount=invoice_request.amount,
                status="sent_to_alanube",
                alanube_id=alanube_response.get('id')
            )
            db.add(new_invoice)
            db.commit()
            
            return AlanubeResponse(
                success=True,
                message="Factura creada en Alanube exitosamente",
                data=alanube_response
            )
        else:
            error_detail = f"Error {response.status_code}: {response.text}"
            raise HTTPException(status_code=response.status_code, detail=error_detail)
            
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error conectando con Alanube: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error procesando factura: {str(e)}"
        )