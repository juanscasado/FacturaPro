#!/bin/bash
# Script de deployment automatizado para FacturaPro

echo "🚀 Iniciando deployment de FacturaPro..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "DEPLOYMENT_GUIDE.md" ]; then
    print_error "Por favor ejecuta este script desde la raíz del proyecto FacturaPro"
    exit 1
fi

print_status "Directorio correcto verificado"

# 2. Verificar dependencias
command -v git >/dev/null 2>&1 || { print_error "Git no está instalado"; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm no está instalado"; exit 1; }
command -v python >/dev/null 2>&1 || { print_error "Python no está instalado"; exit 1; }

print_status "Dependencias verificadas"

# 3. Build del frontend
print_status "Building frontend..."
cd frontend
npm install
npm run build
if [ $? -ne 0 ]; then
    print_error "Error en build del frontend"
    exit 1
fi
cd ..

print_status "Frontend build completado"

# 4. Verificar backend
print_status "Verificando backend..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    print_error "Error instalando dependencias del backend"
    exit 1
fi
cd ..

print_status "Backend verificado"

# 5. Crear commit de deployment
print_status "Creando commit para deployment..."
git add .
git commit -m "🚀 Production deployment ready

✅ Frontend build optimizado
✅ Backend configurado para PostgreSQL
✅ Variables de entorno preparadas
✅ Archivos de configuración actualizados

Ready for Railway + Vercel deployment"

print_status "Commit creado"

# 6. Push a GitHub
print_status "Subiendo a GitHub..."
git push origin main
if [ $? -ne 0 ]; then
    print_error "Error subiendo a GitHub"
    exit 1
fi

print_status "Código subido a GitHub"

# 7. Instrucciones finales
echo ""
print_status "🎉 ¡Deployment preparado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a https://railway.app y conecta tu GitHub"
echo "2. Deploy el backend desde backend/"
echo "3. Agrega PostgreSQL como servicio"
echo "4. Configura las variables de entorno en Railway"
echo "5. Ve a https://vercel.com y deploy el frontend desde frontend/"
echo ""
echo "🔗 URLs sugeridas:"
echo "   Backend: https://facturapro-backend.railway.app"
echo "   Frontend: https://facturapro.vercel.app"
echo ""
print_status "¡Listo para impresionar a Alanube! 🇩🇴✨"