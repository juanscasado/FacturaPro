# 🚀 Comandos de Desarrollo - FacturaPro RD

## ⚡ Inicio Rápido

### Ejecutar Aplicación Completa
```powershell
# Desde directorio raíz del proyecto

# 1. Iniciar Backend
cd backend
Start-Job -Name "FacturaPro-API" -ScriptBlock { 
  & "C:\Users\WinFree\Desktop\repo\FacturaPro\backend\venv\Scripts\python.exe" 
  -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 
  --app-dir "C:\Users\WinFree\Desktop\repo\FacturaPro\backend" 
}

# 2. Iniciar Frontend  
cd ..\frontend
Start-Job -Name "FacturaPro-UI" -ScriptBlock { 
  Set-Location "C:\Users\WinFree\Desktop\repo\FacturaPro\frontend"
  npm start 
}

# 3. Verificar estado
Get-Job | Format-Table Id, Name, State

# 4. Abrir en navegador
Start-Process "http://localhost:3000"
```

## 📊 Monitoreo

### Verificar Estado de Servidores
```powershell
# Estado completo
try { 
  $backend = Invoke-WebRequest -Uri "http://127.0.0.1:8000" -TimeoutSec 3
  $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3
  Write-Host "✅ Backend: $($backend.StatusCode) | Frontend: $($frontend.StatusCode)" -ForegroundColor Green
} catch { 
  Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Solo backend
Invoke-RestMethod -Uri "http://127.0.0.1:8000/" -Method GET

# Solo frontend
Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 | Select-Object StatusCode
```

### Ver Logs en Tiempo Real
```powershell
# Logs del backend
Receive-Job -Name "FacturaPro-API" -Keep | Select-Object -Last 10

# Logs del frontend
Receive-Job -Name "FacturaPro-UI" -Keep | Select-Object -Last 10

# Logs completos
Get-Job | ForEach-Object { 
  Write-Host "=== $($_.Name) ===" -ForegroundColor Yellow
  Receive-Job -Id $_.Id -Keep | Select-Object -Last 5
}
```

## 🔧 Gestión de Procesos

### Controlar Jobs
```powershell
# Listar todos los jobs
Get-Job | Format-Table Id, Name, State, Location

# Detener job específico
Stop-Job -Name "FacturaPro-API"
Stop-Job -Name "FacturaPro-UI"

# Remover jobs detenidos
Remove-Job -Name "FacturaPro-API"
Remove-Job -Name "FacturaPro-UI"

# Limpiar todos los jobs
Get-Job | Remove-Job -Force
```

## 🧪 Testing y Depuración

### API Testing (Backend)
```powershell
# Health check
Invoke-RestMethod -Uri "http://127.0.0.1:8000/" -Method GET

# Documentación disponible
Start-Process "http://127.0.0.1:8000/docs"

# Registrar usuario de prueba
$userData = @{
  username = "testuser"
  email = "test@facturapro.com"  
  password = "testpass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/register" -Method POST -ContentType "application/json" -Body $userData

# Login y obtener token
$loginData = @{
  email = "test@facturapro.com"
  password = "testpass123"  
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/login" -Method POST -ContentType "application/json" -Body $loginData
$token = $response.access_token
Write-Host "Token obtenido: $token" -ForegroundColor Green

# Usar token para acceder a endpoints protegidos
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://127.0.0.1:8000/clients/" -Headers $headers -Method GET
```

### Frontend Testing  
```powershell
# Verificar que React está sirviendo
$html = Invoke-WebRequest -Uri "http://localhost:3000"
$html.StatusCode

# Verificar rutas específicas (SPAs necesitan JavaScript)
try {
  Invoke-WebRequest -Uri "http://localhost:3000/#/login" -TimeoutSec 5
  Write-Host "✅ Ruta /login accesible" -ForegroundColor Green
} catch {
  Write-Host "❌ Error en ruta /login" -ForegroundColor Red  
}
```

### Alanube API Testing
```powershell
# Token JWT de Alanube (sandbox)
$alanubeToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g"

$alanubeHeaders = @{ 
  'Authorization' = "Bearer $alanubeToken"
  'Content-Type' = 'application/json' 
}

# Test conexión Alanube
try {
  $companyInfo = Invoke-RestMethod -Uri 'https://sandbox.alanube.co/dom/v1/company' -Headers $alanubeHeaders -Method GET
  Write-Host "✅ Alanube conectado correctamente" -ForegroundColor Green
  Write-Host "Company ID: $($companyInfo.id)" -ForegroundColor Cyan
  Write-Host "RNC: $($companyInfo.identification)" -ForegroundColor Cyan
  Write-Host "Nombre: $($companyInfo.name)" -ForegroundColor Cyan
} catch {
  Write-Host "❌ Error conectando a Alanube: $($_.Exception.Message)" -ForegroundColor Red
}
```

## 🗄️ Base de Datos

### SQLite Operations
```powershell
# Conectar a la base de datos (requiere SQLite CLI instalado)
# sqlite3 backend/test.db

# O desde Python:
cd backend
.\venv\Scripts\python.exe -c "
import sqlite3
conn = sqlite3.connect('test.db')
cursor = conn.cursor()

print('=== TABLAS ===')
cursor.execute(\"SELECT name FROM sqlite_master WHERE type='table';\")
for table in cursor.fetchall():
    print(f'- {table[0]}')

print('\n=== USUARIOS ===')  
cursor.execute('SELECT id, username, email FROM users;')
for user in cursor.fetchall():
    print(f'ID: {user[0]}, User: {user[1]}, Email: {user[2]}')

print('\n=== CLIENTES ===')
cursor.execute('SELECT id, name, rnc FROM clients;') 
for client in cursor.fetchall():
    print(f'ID: {client[0]}, Nombre: {client[1]}, RNC: {client[2]}')
    
print('\n=== FACTURAS ===')
cursor.execute('SELECT id, description, amount, ncf FROM invoices;')
for invoice in cursor.fetchall():
    print(f'ID: {invoice[0]}, Desc: {invoice[1]}, Monto: {invoice[2]}, NCF: {invoice[3]}')

conn.close()
"
```

## 🔄 Desarrollo y Hot Reload

### Reiniciar Servicios
```powershell
# Reiniciar solo backend
Stop-Job -Name "FacturaPro-API" -PassThru | Remove-Job
cd backend  
Start-Job -Name "FacturaPro-API" -ScriptBlock { 
  & "C:\Users\WinFree\Desktop\repo\FacturaPro\backend\venv\Scripts\python.exe" 
  -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 
  --app-dir "C:\Users\WinFree\Desktop\repo\FacturaPro\backend" 
}

# Reiniciar solo frontend  
Stop-Job -Name "FacturaPro-UI" -PassThru | Remove-Job
cd frontend
Start-Job -Name "FacturaPro-UI" -ScriptBlock { 
  Set-Location "C:\Users\WinFree\Desktop\repo\FacturaPro\frontend"
  npm start 
}

# Reiniciar ambos
Get-Job | Stop-Job -PassThru | Remove-Job
.\dev-start.ps1  # (si existe script)
```

## 📦 Gestión de Dependencias

### Backend (Python)
```powershell
cd backend

# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Instalar nueva dependencia
pip install nueva-dependencia

# Actualizar requirements.txt
pip freeze > requirements.txt

# Instalar desde requirements
pip install -r requirements.txt
```

### Frontend (Node.js)
```powershell  
cd frontend

# Instalar nueva dependencia
npm install nueva-dependencia

# Instalar dependencia de desarrollo
npm install --save-dev nueva-dep-dev

# Actualizar dependencias
npm update

# Verificar dependencias  
npm list --depth=0
```

## 🌍 URLs y Endpoints

### Aplicación Local
- **Frontend**: http://localhost:3000
  - Login: http://localhost:3000/#/login
  - Register: http://localhost:3000/#/register  
  - Dashboard: http://localhost:3000/#/dashboard
  - Clientes: http://localhost:3000/#/clients
  - Facturas: http://localhost:3000/#/invoices
  - Perfil: http://localhost:3000/#/profile

- **Backend**: http://127.0.0.1:8000
  - Docs: http://127.0.0.1:8000/docs
  - Health: http://127.0.0.1:8000/
  - Auth: http://127.0.0.1:8000/auth/*
  - Clients: http://127.0.0.1:8000/clients/
  - Invoices: http://127.0.0.1:8000/invoices/

### Alanube Sandbox  
- **API Base**: https://sandbox.alanube.co/dom/v1/
- **Portal**: https://sandbox-reseller.alanube.co/login
- **Docs**: https://developer.alanube.co/v1.0-DOM/

## 🎯 Flujo de Desarrollo Típico

```powershell
# 1. Iniciar aplicación
Get-Job | Remove-Job -Force  # Limpiar jobs anteriores
cd C:\Users\WinFree\Desktop\repo\FacturaPro

# Backend
cd backend
Start-Job -Name "API" -ScriptBlock { 
  & ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --app-dir "$(Get-Location)" 
}

# Frontend  
cd ..\frontend
Start-Job -Name "UI" -ScriptBlock { npm start }

# 2. Verificar todo funciona
Start-Sleep 10
try { 
  $api = Invoke-WebRequest "http://127.0.0.1:8000" -TimeoutSec 3
  $ui = Invoke-WebRequest "http://localhost:3000" -TimeoutSec 3
  Write-Host "✅ API: $($api.StatusCode) | UI: $($ui.StatusCode)" -ForegroundColor Green
  
  # 3. Abrir navegador
  Start-Process "http://localhost:3000/#/login"
  
} catch {
  Write-Host "❌ $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Monitorear durante desarrollo
while ($true) {
  Start-Sleep 30
  Get-Job | Where-Object State -ne "Running" | ForEach-Object {
    Write-Host "⚠️  Job $($_.Name) no está corriendo" -ForegroundColor Yellow
  }
}
```

## 🚨 Troubleshooting

### Problemas Comunes

#### Puerto ocupado
```powershell
# Verificar qué usa el puerto 8000
netstat -ano | findstr :8000

# Matar proceso por PID  
taskkill /PID <PID> /F
```

#### Frontend no compila
```powershell
cd frontend

# Limpiar node_modules
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force

# Reinstalar
npm install
```

#### Error de CORS
```powershell
# Verificar configuración en backend/app/main.py
# origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
```

#### Token JWT expirado
```powershell
# El token de Alanube tiene exp: 1171734022 (muy lejano)
# Si expira, necesita renovarse desde portal Alanube
```

---

**💡 Tip**: Guarda estos comandos como aliases en tu perfil de PowerShell para acceso rápido

```powershell
# Agregar al perfil de PowerShell
Set-Alias factura-start "C:\ruta\al\script\inicio.ps1"  
Set-Alias factura-status "C:\ruta\al\script\status.ps1"
Set-Alias factura-stop "C:\ruta\al\script\stop.ps1"
```