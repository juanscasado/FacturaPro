#!/usr/bin/env python3
"""
Script para probar directamente la API de Alanube y diagnósticar el problema
"""

import requests
import json

# Configuración de Alanube (misma que en el backend)
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'
ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'
ALANUBE_COMPANY_ID = 'c6b67743-886d-415b-abe0-72e7db165051'

def test_alanube_endpoints():
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    print("🧪 Probando endpoints de Alanube...")
    print(f"📍 Base URL: {ALANUBE_API_BASE}")
    print(f"🏢 Company ID: {ALANUBE_COMPANY_ID}")
    print()
    
    # 1. Probar endpoint de validación
    print("1️⃣ Probando endpoint de validación...")
    validate_url = f'{ALANUBE_API_BASE}validate'
    try:
        response = requests.get(validate_url, headers=headers, timeout=30)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    print()
    
    # 2. Probar endpoint de company
    print("2️⃣ Probando endpoint de company...")
    company_url = f'{ALANUBE_API_BASE}companies/{ALANUBE_COMPANY_ID}'
    try:
        response = requests.get(company_url, headers=headers, timeout=30)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    print()
    
    # 3. Probar endpoint de invoice (el que falla)
    print("3️⃣ Probando endpoint de facturas...")
    invoice_url = f'{ALANUBE_API_BASE}invoice-fiscals/{ALANUBE_COMPANY_ID}'
    
    # Datos de prueba
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
    
    print(f"   URL: {invoice_url}")
    print(f"   Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(invoice_url, headers=headers, json=test_data, timeout=30)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    print()
    
    # 4. Listar endpoints disponibles
    print("4️⃣ Probando endpoint base para ver endpoints disponibles...")
    try:
        response = requests.get(ALANUBE_API_BASE, headers=headers, timeout=30)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:500]}...")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_alanube_endpoints()