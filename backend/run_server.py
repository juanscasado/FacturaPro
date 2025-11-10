#!/usr/bin/env python3
import sys
import os
from pathlib import Path

# Agregar el directorio actual al path de Python
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Ahora importar y ejecutar la app
if __name__ == "__main__":
    import uvicorn
    
    # Configurar el entorno
    os.environ.setdefault("PYTHONPATH", str(current_dir))
    
    print("🚀 Iniciando FacturaPro Backend...")
    print(f"📁 Directorio: {current_dir}")
    print("📡 Servidor: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    
    # Ejecutar uvicorn
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=[str(current_dir)]
    )