#!/usr/bin/env python3
"""
Script para probar la autenticación básica de Alanube
"""

import requests
import json
from jose import jwt

# Token de Alanube
ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'

def decode_token():
    """Decodificar el token JWT para ver su contenido"""
    try:
        # Decodificar sin verificar la firma (solo para ver el contenido)
        decoded = jwt.get_unverified_claims(ALANUBE_JWT_TOKEN)
        print("📋 Contenido del JWT Token:")
        print(json.dumps(decoded, indent=2))
        return decoded
    except Exception as e:
        print(f"❌ Error decodificando token: {e}")
        return None

def test_basic_endpoints():
    """Probar endpoints básicos sin Company ID"""
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    base_urls = [
        'https://sandbox.alanube.co/dom/v1/',
        'https://sandbox.alanube.co/dom/',
        'https://api.alanube.co/dom/v1/',  # Posible URL alternativa
        'https://sandbox-api.alanube.co/dom/v1/'  # Otra posible URL
    ]
    
    for base_url in base_urls:
        print(f"\n🔍 Probando base URL: {base_url}")
        
        # Probar endpoint de validación simple
        try:
            response = requests.get(f'{base_url}validate', headers=headers, timeout=10)
            print(f"   Validate: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"   Validate: Error - {e}")
            
        # Probar listar compañías
        try:
            response = requests.get(f'{base_url}companies', headers=headers, timeout=10)
            print(f"   Companies: {response.status_code} - {response.text[:100]}")
            if response.status_code == 200:
                print("   ✅ ¡Encontrada URL válida!")
                return base_url
        except Exception as e:
            print(f"   Companies: Error - {e}")
    
    return None

def main():
    print("🔧 Diagnosticando problema de Alanube...\n")
    
    # 1. Decodificar token
    token_data = decode_token()
    
    # 2. Probar diferentes URLs base
    valid_url = test_basic_endpoints()
    
    if valid_url:
        print(f"\n✅ URL válida encontrada: {valid_url}")
    else:
        print("\n❌ No se encontró ninguna URL válida")
        print("💡 Posibles problemas:")
        print("   • Token expirado")
        print("   • URL base incorrecta")
        print("   • Problemas de permisos")

if __name__ == "__main__":
    main()