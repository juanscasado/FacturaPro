from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import os
import requests
import json
import uuid
from pydantic import BaseModel
from typing import Optional

SECRET_KEY = os.getenv("SECRET_KEY", "mi_clave_secreta")

# Configuración de Alanube
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'
ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'
ALANUBE_COMPANY_ID = '01K86AB4V87K31ZJQ57NRHRJWX'  # Company ID correcto obtenido de la API

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
        print(f"🔍 DEBUG - Recibida petición para factura: {invoice_request}")
        print(f"🔍 DEBUG - Usuario actual: {current_user}")
        
        # Obtener información del cliente
        client = db.query(models.Client).filter(
            models.Client.id == invoice_request.client_id,
            models.Client.user_id == current_user.id
        ).first()
        
        if not client:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        
        # Validar que el cliente tiene RNC
        if not client.rnc or client.rnc.strip() == '':
            raise HTTPException(
                status_code=400, 
                detail=f"El cliente '{client.name}' no tiene RNC configurado. Para facturación fiscal es obligatorio."
            )
        
        # Preparar datos para Alanube
        alanube_data = {
            "rnc": client.rnc.strip(),
            "buyer_name": client.name,
            "buyer_rnc": client.rnc.strip(),
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
        
        # Crear datos en el formato CORRECTO que funciona con Alanube
        import random
        from datetime import datetime
        
        # Generar ENCF único para invoices
        unique_sequence = str(random.randint(1000000, 9999999)).zfill(10)
        encf_number = f"E32{unique_sequence}"
        
        # Formato correcto según los tests exitosos
        alanube_data = {
            "idDoc": {
                "id": str(uuid.uuid4()),
                "type": "01",  # Factura de venta
                "sequence": "00000001",
                "encf": encf_number,
                "paymentType": 1,  # 1=Efectivo
                "incomeType": 1,   # Tipo de ingresos
                "sequenceDueDate": datetime.now().strftime("%Y-%m-%d")
            },
            "sender": {
                "rnc": "132109122",
                "companyName": "juancasado",
                "tradeName": "juancasado", 
                "identification": "132109122",
                "address": "address",
                "province": "010000",  # Código de provincia
                "municipality": "010100",  # Código de municipio válido
                "stampDate": datetime.now().strftime("%Y-%m-%d")
            },
            "buyer": {
                "rnc": client.rnc.strip(),
                "companyName": client.name,
                "name": client.name,
                "identification": client.rnc.strip(),
                "address": "Dirección del cliente",
                "province": "010000",
                "municipality": "010100"
            },
            "date": datetime.now().strftime("%Y-%m-%d"),
            "currency": "DOP",
            "itemDetails": [
                {
                    "lineNumber": 1,
                    "billingIndicator": 1,  # Entero
                    "itemName": invoice_request.description,
                    "description": invoice_request.description,
                    "goodServiceIndicator": 2,  # 2=Servicio, 1=Bien
                    "quantityItem": 1,
                    "unitPriceItem": float(invoice_request.amount),
                    "itemAmount": float(invoice_request.amount),
                    "quantity": 1,
                    "unitPrice": float(invoice_request.amount),
                    "totalAmount": float(invoice_request.amount),
                    "itemCode": "001",
                    "unitOfMeasure": "UND"
                }
            ],
            "totals": {
                "subtotal": float(invoice_request.amount),
                "tax": 0.0,
                "discount": 0.0,
                "totalAmount": float(invoice_request.amount)
            },
            "documentType": "01",
            "paymentMethod": "01"
        }
        
        # URL correcta según los tests
        alanube_url = f'{ALANUBE_API_BASE}invoices'
        
        print(f"🔍 DEBUG - URL Alanube: {alanube_url}")
        print(f"🔍 DEBUG - ENCF generado: {encf_number}")
        
        # Enviar a Alanube
        response = requests.post(
            alanube_url,
            headers=headers,
            json=alanube_data,
            timeout=60
        )
        
        print(f"🔍 DEBUG - Response Status: {response.status_code}")
        print(f"🔍 DEBUG - Response Text: {response.text}")
        
        if response.status_code in [200, 201]:
            alanube_response = response.json()
            
            # Extraer información importante de la respuesta
            ncf = alanube_response.get('documentNumber', '')
            invoice_id = alanube_response.get('id', '')
            status = alanube_response.get('status', '')
            
            print(f"✅ Factura creada exitosamente:")
            print(f"   NCF: {ncf}")
            print(f"   ID: {invoice_id}")
            print(f"   Status: {status}")
            
            # Guardar la factura en nuestra base de datos también
            new_invoice = models.Invoice(
                client_id=client.id,
                user_id=current_user.id,
                description=invoice_request.description,
                amount=invoice_request.amount,
                status="sent_to_alanube",
                alanube_id=invoice_id
            )
            db.add(new_invoice)
            db.commit()
            
            return AlanubeResponse(
                success=True,
                message=f"Factura creada exitosamente. NCF: {ncf}",
                data={
                    "id": invoice_id,
                    "ncf": ncf,
                    "status": status,
                    "amount": invoice_request.amount,
                    "client": client.name,
                    "full_response": alanube_response
                }
            )
        else:
            error_detail = f"Error {response.status_code}: {response.text}"
            print(f"❌ Error en Alanube: {error_detail}")
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