from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..config import ALANUBE_API_URL, ALANUBE_TOKEN, SECRET_KEY
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
import os
import requests
import json
import uuid
from pydantic import BaseModel
from typing import Optional

# Configuración de Alanube desde config
ALANUBE_API_BASE = ALANUBE_API_URL + '/dom/v1/' if ALANUBE_API_URL else 'https://sandbox.alanube.co/dom/v1/'
ALANUBE_JWT_TOKEN = ALANUBE_TOKEN
ALANUBE_COMPANY_ID = 'c6b67743-886d-415b-abe0-72e7db165051'  # Company ID del token sandbox

print(f"🧾 Alanube configurado:")
print(f"   API Base: {ALANUBE_API_BASE}")
print(f"   Token: {'✅ Configurado' if ALANUBE_JWT_TOKEN else '❌ No disponible'}")
print(f"   Company ID: {ALANUBE_COMPANY_ID}")

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
        print(f"🔍 DEBUG - Token recibido: {token[:50] if token else 'None'}...")
        print(f"🔍 DEBUG - SECRET_KEY: {SECRET_KEY[:20] if SECRET_KEY else 'None'}...")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print(f"🔍 DEBUG - Payload decodificado: {payload}")
        
        user_id = payload.get("user_id")
        if user_id is None:
            print("❌ DEBUG - user_id no encontrado en payload")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido - sin user_id")
            
        user = db.query(models.User).get(user_id)
        if user is None:
            print(f"❌ DEBUG - Usuario {user_id} no encontrado en base de datos")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")
            
        print(f"✅ DEBUG - Usuario autenticado: {user.email}")
        return user
    except JWTError as e:
        print(f"❌ DEBUG - Error JWT: {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token inválido: {str(e)}")
    except Exception as e:
        print(f"❌ DEBUG - Error general: {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Error de autenticación: {str(e)}")

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

# TEST: Validar conexión con Alanube SIN AUTENTICACIÓN (solo para debug)
@router.get("/test-connection")
def test_alanube_connection_no_auth():
    try:
        print(f"🧪 TEST - API Base: {ALANUBE_API_BASE}")
        print(f"🧪 TEST - Token: {ALANUBE_JWT_TOKEN[:50] if ALANUBE_JWT_TOKEN else 'None'}...")
        
        headers = {
            'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        response = requests.get(f'{ALANUBE_API_BASE}company', headers=headers, timeout=30)
        
        print(f"🧪 TEST - Response Status: {response.status_code}")
        print(f"🧪 TEST - Response Text: {response.text[:200]}...")
        
        if response.status_code == 200:
            company_data = response.json()
            return {
                "success": True,
                "message": "✅ Alanube funciona correctamente",
                "data": company_data,
                "debug": {
                    "api_base": ALANUBE_API_BASE,
                    "token_length": len(ALANUBE_JWT_TOKEN) if ALANUBE_JWT_TOKEN else 0,
                    "status": response.status_code
                }
            }
        else:
            return {
                "success": False,
                "message": f"❌ Error de Alanube: {response.status_code}",
                "error": response.text,
                "debug": {
                    "api_base": ALANUBE_API_BASE,
                    "token_length": len(ALANUBE_JWT_TOKEN) if ALANUBE_JWT_TOKEN else 0,
                    "status": response.status_code
                }
            }
            
    except Exception as e:
        return {
            "success": False,
            "message": f"❌ Error conectando con Alanube: {str(e)}",
            "debug": {
                "api_base": ALANUBE_API_BASE,
                "token_length": len(ALANUBE_JWT_TOKEN) if ALANUBE_JWT_TOKEN else 0,
                "error": str(e)
            }
        }

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
        alanube_url = f'{ALANUBE_API_BASE}invoice-fiscals/{ALANUBE_COMPANY_ID}'
        
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