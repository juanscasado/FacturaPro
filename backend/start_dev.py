#!/usr/bin/env python3
"""
Script para iniciar el servidor de desarrollo de FacturaPro
Maneja automáticamente el entorno virtual y las dependencias
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    # Asegurar que estamos en el directorio correcto
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("🚀 Iniciando servidor de desarrollo FacturaPro...")
    print(f"📁 Directorio: {backend_dir}")
    
    # Verificar que existe el directorio app
    if not (backend_dir / "app").exists():
        print("❌ Error: No se encuentra el directorio 'app'")
        print("💡 Asegúrate de ejecutar este script desde el directorio 'backend'")
        sys.exit(1)
    
    # Verificar que existe main.py
    if not (backend_dir / "app" / "main.py").exists():
        print("❌ Error: No se encuentra 'app/main.py'")
        sys.exit(1)
    
    # Verificar que existe config.py
    if not (backend_dir / "app" / "config.py").exists():
        print("❌ Error: No se encuentra 'app/config.py'")
        print("💡 El archivo config.py es necesario para la configuración")
        sys.exit(1)
    
    print("✅ Estructura de archivos verificada")
    
    # Configurar Python path para que pueda encontrar el módulo app
    env = os.environ.copy()
    env['PYTHONPATH'] = str(backend_dir)
    
    # Variables de entorno para desarrollo
    env['DEVELOPMENT'] = 'true'
    env['DEBUG'] = 'true'
    
    # Comando para ejecutar uvicorn
    cmd = [
        sys.executable, 
        "-m", 
        "uvicorn", 
        "app.main:app", 
        "--reload", 
        "--port", 
        "8000",
        "--host", 
        "127.0.0.1"
    ]
    
    print(f"🔧 Ejecutando: {' '.join(cmd)}")
    print("📡 El servidor estará disponible en: http://localhost:8000")
    print("📚 Documentación en: http://localhost:8000/docs")
    print("❤️ Health check en: http://localhost:8000/health")
    print("\n🔥 Presiona Ctrl+C para detener el servidor\n")
    
    try:
        # Ejecutar el servidor
        result = subprocess.run(cmd, env=env, check=True)
        return result.returncode
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido por el usuario")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error al ejecutar el servidor:")
        print(f"   Código de salida: {e.returncode}")
        print(f"   Comando: {' '.join(cmd)}")
        print("\n🔍 Posibles soluciones:")
        print("   1. Verificar que el entorno virtual está activado")
        print("   2. Instalar dependencias: pip install -r requirements.txt")
        print("   3. Verificar que Python puede importar FastAPI: python -c 'import fastapi'")
        return e.returncode
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)