#!/usr/bin/env python3
"""
Script para recrear la base de datos con los nuevos campos
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models

# Eliminar y recrear todas las tablas
print("🔄 Recreando base de datos con nuevos campos...")

try:
    # Eliminar todas las tablas
    models.Base.metadata.drop_all(bind=engine)
    print("✅ Tablas anteriores eliminadas")
    
    # Crear todas las tablas con el nuevo esquema
    models.Base.metadata.create_all(bind=engine)
    print("✅ Tablas recreadas con nuevos campos")
    
    print("\n🎉 Base de datos actualizada correctamente")
    print("📝 Nota: Necesitarás volver a registrar usuarios y agregar clientes")
    
except Exception as e:
    print(f"❌ Error actualizando base de datos: {e}")