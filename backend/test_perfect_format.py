#!/usr/bin/env python3
"""
Crear factura con el formato EXACTO que requiere Alanube según los errores 400
"""

import requests
import json
import uuid
from datetime import datetime

ALANUBE_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g'
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'
COMPANY_ID = '01K86AB4V87K31ZJQ57NRHRJWX'

def create_perfect_invoice_data(endpoint_type='invoices'):
    """Crear datos de factura con el formato EXACTO según los errores"""
    
    # ENCF diferente según el endpoint - generar secuencia única
    encf_prefix = "E32" if endpoint_type == 'invoices' else "E31"
    import random
    unique_sequence = str(random.randint(1000000, 9999999)).zfill(10)
    encf_number = f"{encf_prefix}{unique_sequence}"  # 13 caracteres total
    
    # idDoc debe ser un objeto, no string
    id_doc = {
        "id": str(uuid.uuid4()),
        "type": "01",  # Factura de venta
        "sequence": "00000001",
        "encf": encf_number,  # Número correcto según endpoint
        "paymentType": 1,  # Entero: 1=Efectivo, 2=Cheque, 3=Transferencia
        "incomeType": 1,  # Entero: 1-6 según tipo de ingresos
        "sequenceDueDate": datetime.now().strftime("%Y-%m-%d")  # Para fiscal-invoices
    }
    
    # Sender con todos los campos requeridos
    sender = {
        "rnc": "132109122",  # RNC requerido
        "companyName": "juancasado",  # companyName requerido
        "tradeName": "juancasado",
        "identification": "132109122",
        "address": "address",
        "province": "010000",  # Código válido de provincia (6 dígitos)
        "municipality": "010100",  # Código válido de municipio de Santo Domingo
        "stampDate": datetime.now().strftime("%Y-%m-%d")  # stampDate requerido
    }
    
    # Buyer con todos los campos requeridos
    buyer = {
        "rnc": "101234567",  # RNC requerido
        "companyName": "Cliente de Prueba",  # companyName requerido
        "name": "Cliente de Prueba",
        "identification": "101234567",
        "address": "Dirección del cliente",
        "province": "010000",  # Código válido de provincia (6 dígitos)
        "municipality": "010100"  # Código válido de municipio de Santo Domingo
    }
    
    # itemDetails (en lugar de items) - con TODOS los campos requeridos
    item_details = [
        {
            "lineNumber": 1,  # Número de línea
            "billingIndicator": 1,  # Entero: 0,1,2,3,4 - Indicador de facturación
            "itemName": "Producto de prueba",  # Nombre del item
            "description": "Producto de prueba",
            "goodServiceIndicator": 1,  # Entero: 1=Bien, 2=Servicio
            "quantityItem": 1,  # Cantidad del item
            "unitPriceItem": 100.0,  # Precio unitario del item
            "itemAmount": 100.0,  # Monto del item
            "quantity": 1,
            "unitPrice": 100.0,
            "totalAmount": 100.0,
            "itemCode": "001",
            "unitOfMeasure": "UND"
        }
    ]
    
    # totals requerido
    totals = {
        "subtotal": 100.0,
        "tax": 0.0,
        "discount": 0.0,
        "totalAmount": 100.0
    }
    
    # Estructura completa
    invoice_data = {
        "idDoc": id_doc,
        "sender": sender,
        "buyer": buyer,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "currency": "DOP",
        "itemDetails": item_details,
        "totals": totals,
        "documentType": "01",
        "paymentMethod": "01"
    }
    
    return invoice_data

def test_perfect_format():
    headers = {
        'Authorization': f'Bearer {ALANUBE_JWT_TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    endpoints = ['invoices', 'fiscal-invoices']
    
    for endpoint in endpoints:
        # Crear datos específicos para cada endpoint
        invoice_data = create_perfect_invoice_data(endpoint)
        
        print(f"📋 Datos para {endpoint} con formato PERFECTO:")
        print(json.dumps(invoice_data, indent=2, ensure_ascii=False))
        print()
        
        url = f'{ALANUBE_API_BASE}{endpoint}'
        print(f"📤 Probando {endpoint} con formato perfecto...")
        
        try:
            response = requests.post(url, headers=headers, json=invoice_data, timeout=30)
            print(f"   Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                print(f"   ✅ ¡ÉXITO! Factura creada en {endpoint}:")
                result = response.json()
                print(json.dumps(result, indent=2, ensure_ascii=False))
                
                # Extraer información importante
                if 'ncf' in result:
                    print(f"   🧾 NCF generado: {result['ncf']}")
                if 'id' in result:
                    print(f"   🆔 ID de factura: {result['id']}")
                    
                return endpoint, result
            else:
                error_text = response.text
                print(f"   ❌ Error: {error_text}")
                
                # Mostrar errores específicos
                if "requires property" in error_text:
                    print("   📝 Aún faltan campos:")
                    # Extraer campos faltantes del error
                    import re
                    missing_fields = re.findall(r'requires property "([^"]*)"', error_text)
                    for field in missing_fields:
                        print(f"      • {field}")
                        
        except Exception as e:
            print(f"   💥 Excepción: {e}")
        
        print()
    
    return None, None

def main():
    print("🎯 Probando crear factura con formato PERFECTO...\n")
    
    endpoint, result = test_perfect_format()
    
    if endpoint:
        print(f"🎉 ¡FACTURA CREADA EXITOSAMENTE en {endpoint}!")
        print("\n📝 Ahora podemos actualizar el backend de FacturaPro con:")
        print(f"   • Endpoint correcto: {endpoint}")
        print(f"   • Formato de datos correcto")
        print("   • Company ID correcto: 01K86AB4V87K31ZJQ57NRHRJWX")
    else:
        print("❌ Aún hay problemas con el formato")
        print("💡 Revisar los errores específicos arriba para ajustar")

if __name__ == "__main__":
    main()