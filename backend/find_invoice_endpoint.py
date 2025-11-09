#!/usr/bin/env python3
"""
Probar diferentes endpoints de facturas en Alanube
"""

import requests
import json

ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'
COMPANY_ID = '01K86AB4V87K31ZJQ57NRHRJWX'

def test_invoice_endpoints():
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
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
    
    # Diferentes posibles endpoints
    possible_endpoints = [
        f'invoice-fiscals/{COMPANY_ID}',
        f'invoices/{COMPANY_ID}',
        f'fiscal-invoices/{COMPANY_ID}',
        f'{COMPANY_ID}/invoice-fiscals',
        f'{COMPANY_ID}/invoices',
        f'{COMPANY_ID}/fiscal-invoices',
        f'companies/{COMPANY_ID}/invoices',
        f'companies/{COMPANY_ID}/invoice-fiscals'
    ]
    
    print("🧾 Probando diferentes endpoints para crear facturas...\n")
    
    for endpoint in possible_endpoints:
        url = f'{ALANUBE_API_BASE}{endpoint}'
        print(f"🔍 Probando: {endpoint}")
        
        try:
            # Primero probar GET para ver si el endpoint existe
            get_response = requests.get(url, headers=headers, timeout=15)
            print(f"   GET: {get_response.status_code}")
            
            # Si GET funciona o da 405 (Method Not Allowed), probar POST
            if get_response.status_code in [200, 405, 400]:
                post_response = requests.post(url, headers=headers, json=test_data, timeout=15)
                print(f"   POST: {post_response.status_code} - {post_response.text[:100]}")
                
                if post_response.status_code in [200, 201]:
                    print(f"   ✅ ¡ENDPOINT CORRECTO ENCONTRADO!: {endpoint}")
                    return endpoint
            else:
                print(f"   GET error: {get_response.text[:50]}")
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)[:50]}")
        
        print()
    
    return None

def explore_api_structure():
    """Explorar la estructura de la API"""
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    print("🗂️ Explorando estructura de la API...\n")
    
    # Probar diferentes rutas base
    base_routes = [
        '',
        'docs',
        'api',
        f'{COMPANY_ID}',
        f'companies/{COMPANY_ID}'
    ]
    
    for route in base_routes:
        url = f'{ALANUBE_API_BASE}{route}'
        print(f"🔍 {url}")
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                content = response.text[:200]
                print(f"   Content: {content}...")
                
                # Si parece documentación HTML o JSON con estructura
                if 'swagger' in content.lower() or 'api' in content.lower() or content.startswith('[') or content.startswith('{'):
                    print(f"   ✅ Posible documentación encontrada!")
                    
        except Exception as e:
            print(f"   Error: {str(e)[:50]}")
        
        print()

def main():
    print("🚀 Buscando el endpoint correcto para facturas de Alanube...\n")
    
    # 1. Explorar estructura general
    explore_api_structure()
    
    # 2. Probar endpoints específicos para facturas
    correct_endpoint = test_invoice_endpoints()
    
    if correct_endpoint:
        print(f"🎉 ¡Endpoint correcto encontrado!: {correct_endpoint}")
    else:
        print("❌ No se encontró el endpoint correcto")
        print("💡 Posibles soluciones:")
        print("   • Revisar documentación de Alanube")
        print("   • Contactar soporte técnico")
        print("   • Verificar permisos del token")

if __name__ == "__main__":
    main()