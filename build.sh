#!/usr/bin/env bash

echo "🚀 Iniciando despliegue del Backend FacturaPro..."

# Ir al directorio del backend
cd backend

# Instalar dependencias Python
echo "📦 Instalando dependencias Python..."
pip install --upgrade pip
pip install -r requirements.txt

# Crear base de datos si no existe
echo "🗄️ Configurando base de datos..."
python -c "
from app.database import engine
from app import models
print('Creando tablas...')
models.Base.metadata.create_all(bind=engine)
print('✅ Base de datos configurada')
"

echo "✅ Backend listo para ejecutar!"