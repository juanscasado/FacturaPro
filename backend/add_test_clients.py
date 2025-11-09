#!/usr/bin/env python3
"""
Script para agregar clientes de prueba con RNCs válidos para sandbox de Alanube
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models

# Crear las tablas si no existen
models.Base.metadata.create_all(bind=engine)

def add_test_clients():
    db = SessionLocal()
    try:
        # Buscar el primer usuario (asumiendo que ya existe uno)
        user = db.query(models.User).first()
        if not user:
            print("❌ No se encontró ningún usuario. Primero registra un usuario en la aplicación.")
            return
        
        # Clientes de prueba con RNCs válidos para sandbox
        test_clients = [
            {
                "name": "Empresa de Prueba A",
                "rnc": "101234567"  # RNC de prueba válido para sandbox
            },
            {
                "name": "Cliente Individual B", 
                "rnc": "101234568"  # Otro RNC de prueba
            },
            {
                "name": "Corporación Test C",
                "rnc": "101234569"  # Tercer RNC de prueba
            }
        ]
        
        added_count = 0
        for client_data in test_clients:
            # Verificar si ya existe un cliente con ese RNC
            existing = db.query(models.Client).filter(
                models.Client.rnc == client_data["rnc"],
                models.Client.user_id == user.id
            ).first()
            
            if not existing:
                new_client = models.Client(
                    name=client_data["name"],
                    rnc=client_data["rnc"],
                    user_id=user.id
                )
                db.add(new_client)
                added_count += 1
                print(f"✅ Agregado: {client_data['name']} (RNC: {client_data['rnc']})")
            else:
                print(f"⚠️  Ya existe: {client_data['name']} (RNC: {client_data['rnc']})")
        
        db.commit()
        print(f"\n🎉 Se agregaron {added_count} clientes de prueba")
        
        # Mostrar todos los clientes del usuario
        all_clients = db.query(models.Client).filter(models.Client.user_id == user.id).all()
        print(f"\n📋 Clientes disponibles para {user.email}:")
        for client in all_clients:
            print(f"   • {client.name} - RNC: {client.rnc or 'Sin RNC'}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Agregando clientes de prueba con RNCs válidos...")
    add_test_clients()