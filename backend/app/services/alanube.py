import requests
import os

ALANUBE_URL = "https://api-sandbox.alanube.co/rd"
API_KEY = os.getenv("ALANUBE_KEY", "TU_API_KEY_DE_PRUEBA")

def send_invoice(invoice_data):
    # En el sandbox de Alanube
    headers = {"Authorization": f"Bearer {API_KEY}"}
    # Simulación simple para MVP
    response = {"ncf": "B010000001", "status": "issued"}
    return response
