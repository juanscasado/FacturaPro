#!/usr/bin/env python3
"""
Probar crear facturas usando POST directo en los endpoints que dieron error específico
"""

import requests
import json

ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'
COMPANY_ID = '01K86AB4V87K31ZJQ57NRHRJWX'

def test_post_directly():
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Datos simplificados para prueba
    simple_data = {
        "company_id": COMPANY_ID,
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
    
    # Datos alternativos más simples
    alternative_data = {
        "companyId": COMPANY_ID,
        "amount": 100.0,
        "description": "Factura de prueba",
        "clientRnc": "101234567",
        "clientName": "Cliente de Prueba"
    }
    
    # Endpoints que dieron errores específicos (sugiere que existen)
    endpoints_to_test = [
        'invoices',
        'fiscal-invoices',
        'invoice-fiscals'
    ]
    
    print("🧾 Probando POST directo a endpoints de facturas...\n")
    
    for endpoint in endpoints_to_test:
        url = f'{ALANUBE_API_BASE}{endpoint}'
        
        print(f"📤 POST a {endpoint}:")
        print(f"   URL: {url}")
        
        # Probar con datos completos
        try:
            response = requests.post(url, headers=headers, json=simple_data, timeout=30)
            print(f"   Con datos completos: {response.status_code}")
            response_text = response.text
            
            if response.status_code in [200, 201]:
                print(f"   ✅ ¡ÉXITO! Respuesta: {response_text}")
                return endpoint
            elif response.status_code == 400:
                print(f"   📝 Error 400 (datos): {response_text[:150]}...")
                
                # Si hay error 400, podría ser formato de datos - probar alternativo
                alt_response = requests.post(url, headers=headers, json=alternative_data, timeout=30)
                print(f"   Con datos alternativos: {alt_response.status_code}")
                if alt_response.status_code in [200, 201]:
                    print(f"   ✅ ¡ÉXITO alternativo! Respuesta: {alt_response.text}")
                    return endpoint
                else:
                    print(f"   📝 Alt error: {alt_response.text[:100]}...")
            else:
                print(f"   ❌ Error {response.status_code}: {response_text[:100]}...")
                
        except Exception as e:
            print(f"   💥 Excepción: {str(e)[:100]}...")
        
        print()
    
    return None

def check_documentation():
    """Intentar encontrar documentación o esquemas"""
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    print("📚 Buscando documentación de la API...\n")
    
    doc_endpoints = [
        'schema',
        'swagger.json',
        'openapi.json',
        'api-docs',
        f'{COMPANY_ID}/schema'
    ]
    
    for endpoint in doc_endpoints:
        try:
            url = f'{ALANUBE_API_BASE}{endpoint}'
            response = requests.get(url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                print(f"✅ Documentación encontrada en: {endpoint}")
                content = response.text
                print(f"   Contenido: {content[:300]}...")
                
                # Buscar endpoints de facturas en la documentación
                if 'invoice' in content.lower():
                    print("   🔍 Menciona 'invoice'!")
                    
        except Exception as e:
            pass
    
    print()

def main():
    print("🎯 Probando crear facturas con POST directo...\n")
    
    # Buscar documentación
    check_documentation()
    
    # Probar POST directo
    success_endpoint = test_post_directly()
    
    if success_endpoint:
        print(f"🎉 ¡Endpoint funcional encontrado!: {success_endpoint}")
    else:
        print("❌ Ningún endpoint funcionó con POST directo")
        print("\n💡 Próximos pasos:")
        print("   1. Revisar documentación oficial de Alanube")
        print("   2. Contactar soporte técnico") 
        print("   3. Verificar si necesitas configuración adicional")
        print("   4. Comprobar si el sandbox requiere pasos previos")

if __name__ == "__main__":
    main()