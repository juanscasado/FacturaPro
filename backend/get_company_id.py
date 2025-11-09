#!/usr/bin/env python3
"""
Script para obtener el Company ID correcto de Alanube
"""

import requests
import json

# Token de Alanube
ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'

def get_company_info():
    """Obtener información de la compañía del usuario"""
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    try:
        response = requests.get(f'{ALANUBE_API_BASE}companies', headers=headers, timeout=30)
        
        if response.status_code == 200:
            company_data = response.json()
            print("📋 Información de la compañía:")
            print(json.dumps(company_data, indent=2))
            
            # Extraer el ID correcto
            company_id = company_data.get('id')
            if company_id:
                print(f"\n✅ Company ID correcto: {company_id}")
                return company_id
            else:
                print("\n❌ No se pudo extraer el Company ID")
                return None
        else:
            print(f"❌ Error obteniendo compañía: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_with_correct_company_id(company_id):
    """Probar endpoints con el Company ID correcto"""
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Probar endpoint de company específico
    print(f"\n🔍 Probando con Company ID: {company_id}")
    try:
        company_url = f'{ALANUBE_API_BASE}companies/{company_id}'
        response = requests.get(company_url, headers=headers, timeout=30)
        print(f"Company específico: {response.status_code}")
        if response.status_code == 200:
            print("✅ Company ID válido!")
        else:
            print(f"❌ {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Probar crear factura con Company ID correcto
    print(f"\n🧾 Probando crear factura...")
    invoice_url = f'{ALANUBE_API_BASE}invoice-fiscals/{company_id}'
    
    test_data = {
        "rnc": "101234567",
        "buyer_name": "Cliente de Prueba",
        "buyer_rnc": "101234567", 
        "currency": "DOP",
        "total_amount": 100.0,
        "items": [
            {
                "description": "Producto de prueba",
                "quantity": 1,
                "unit_price": 100.0,
                "total_amount": 100.0
            }
        ]
    }
    
    try:
        response = requests.post(invoice_url, headers=headers, json=test_data, timeout=30)
        print(f"Crear factura: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ ¡Factura creada exitosamente!")
        
    except Exception as e:
        print(f"❌ Error creando factura: {e}")

def main():
    print("🔧 Obteniendo Company ID correcto de Alanube...\n")
    
    # Obtener Company ID correcto
    company_id = get_company_info()
    
    if company_id:
        # Probar con el Company ID correcto
        test_with_correct_company_id(company_id)
        
        print(f"\n📝 Actualiza el backend con este Company ID:")
        print(f"ALANUBE_COMPANY_ID = '{company_id}'")
    else:
        print("\n❌ No se pudo obtener el Company ID")

if __name__ == "__main__":
    main()