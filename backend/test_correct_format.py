#!/usr/bin/env python3
"""
Probar crear facturas con el formato correcto según los errores 400
"""

import requests
import json
import uuid
from datetime import datetime

ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'
COMPANY_ID = '01K86AB4V87K31ZJQ57NRHRJWX'

def create_proper_invoice_data():
    """Crear datos de factura con el formato correcto según los campos requeridos"""
    
    # Información de la compañía (sender) - obtenida anteriormente
    sender_data = {
        "id": COMPANY_ID,
        "name": "juancasado",
        "tradeName": "juancasado", 
        "identification": "132109122",
        "address": "address",
        "province": "province",
        "municipality": "municipality"
    }
    
    # Información del cliente (buyer)
    buyer_data = {
        "name": "Cliente de Prueba",
        "identification": "101234567",  # RNC del cliente
        "address": "Dirección del cliente",
        "province": "Santo Domingo",
        "municipality": "Santo Domingo"
    }
    
    # ID único para el documento
    doc_id = str(uuid.uuid4())
    
    # Fecha actual
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    # Estructura completa de la factura
    invoice_data = {
        "idDoc": doc_id,
        "sender": sender_data,
        "buyer": buyer_data,
        "date": current_date,
        "currency": "DOP",
        "totalAmount": 100.0,
        "items": [
            {
                "description": "Producto de prueba",
                "quantity": 1,
                "unitPrice": 100.0,
                "totalAmount": 100.0
            }
        ],
        # Campos adicionales que podrían ser requeridos
        "documentType": "01",  # Factura
        "paymentMethod": "01",  # Efectivo
        "companyId": COMPANY_ID
    }
    
    return invoice_data

def test_with_proper_format():
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    invoice_data = create_proper_invoice_data()
    
    print("📋 Datos de factura con formato correcto:")
    print(json.dumps(invoice_data, indent=2))
    print()
    
    endpoints = ['invoices', 'fiscal-invoices']
    
    for endpoint in endpoints:
        url = f'{ALANUBE_API_BASE}{endpoint}'
        print(f"📤 Probando {endpoint}...")
        
        try:
            response = requests.post(url, headers=headers, json=invoice_data, timeout=30)
            print(f"   Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                print(f"   ✅ ¡ÉXITO! Factura creada:")
                result = response.json()
                print(json.dumps(result, indent=2))
                return endpoint, result
            else:
                error_text = response.text
                print(f"   ❌ Error: {error_text}")
                
                # Si aún hay campos faltantes, mostrar cuáles
                if "requires property" in error_text:
                    print("   📝 Campos faltantes detectados en el error")
                    
        except Exception as e:
            print(f"   💥 Excepción: {e}")
        
        print()
    
    return None, None

def try_minimal_format():
    """Probar con formato más minimal basado en otros APIs similares"""
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Formato más simple, comúnmente usado
    minimal_data = {
        "idDoc": str(uuid.uuid4()),
        "sender": {
            "identification": "132109122",
            "name": "juancasado"
        },
        "buyer": {
            "identification": "101234567", 
            "name": "Cliente de Prueba"
        },
        "items": [{
            "description": "Servicio de prueba",
            "quantity": 1,
            "unitPrice": 100.0
        }],
        "currency": "DOP"
    }
    
    print("🎯 Probando formato minimal:")
    print(json.dumps(minimal_data, indent=2))
    print()
    
    for endpoint in ['invoices', 'fiscal-invoices']:
        url = f'{ALANUBE_API_BASE}{endpoint}'
        print(f"📤 {endpoint} (minimal)...")
        
        try:
            response = requests.post(url, headers=headers, json=minimal_data, timeout=30)
            print(f"   Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                print(f"   ✅ ¡ÉXITO MINIMAL!")
                return endpoint
            else:
                print(f"   ❌ {response.text[:150]}...")
                
        except Exception as e:
            print(f"   💥 {e}")
        
        print()

def main():
    print("🚀 Probando crear factura con formato correcto...\n")
    
    # 1. Probar formato completo
    endpoint, result = test_with_proper_format()
    
    if endpoint:
        print(f"🎉 ¡Factura creada exitosamente en {endpoint}!")
        return
    
    # 2. Si no funciona, probar formato minimal
    print("⚡ Probando formato minimal...")
    minimal_endpoint = try_minimal_format()
    
    if minimal_endpoint:
        print(f"🎉 ¡Formato minimal funciona en {minimal_endpoint}!")
    else:
        print("❌ No se pudo crear factura con ningún formato")
        print("\n💡 Siguiente paso: contactar soporte de Alanube")

if __name__ == "__main__":
    main()