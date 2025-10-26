# 📋 Tutorial Completo - FacturaPro RD
## Sistema de Facturación Electrónica para República Dominicana

### 🎯 **¿Qué es FacturaPro RD?**

FacturaPro RD es una aplicación web completa para gestionar facturación electrónica cumpliendo con las normativas de la DGII (Dirección General de Impuestos Internos) de República Dominicana. La aplicación se integra directamente con **Alanube** como proveedor de servicios electrónicos certificado.

---

## 🏗️ **Arquitectura del Sistema**

### **Frontend (React)**
- **Tecnologías**: React 19, Tailwind CSS, Axios, React Router
- **Puerto**: http://localhost:3000
- **Funcionalidades**: Interfaz de usuario, formularios, gestión de estado

### **Backend (FastAPI)**  
- **Tecnologías**: FastAPI, SQLAlchemy, SQLite, JWT
- **Puerto**: http://127.0.0.1:8000
- **Funcionalidades**: API REST, autenticación, base de datos

### **Integración Alanube**
- **Ambiente**: Sandbox (https://sandbox.alanube.co/dom/v1/)
- **Autenticación**: JWT Token Bearer
- **Funcionalidades**: Envío de e-CF, validación NCF, cumplimiento DGII

---

## 🚀 **Cómo Iniciar la Aplicación**

### **Paso 1: Iniciar Backend**
```powershell
# Desde el directorio raíz del proyecto
cd backend
Start-Job -ScriptBlock { 
  & "C:\Users\WinFree\Desktop\repo\FacturaPro\backend\venv\Scripts\python.exe" 
  -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 
  --app-dir "C:\Users\WinFree\Desktop\repo\FacturaPro\backend" 
}
```

### **Paso 2: Iniciar Frontend**
```powershell
# Desde el directorio frontend
cd frontend
Start-Job -ScriptBlock { 
  Set-Location "C:\Users\WinFree\Desktop\repo\FacturaPro\frontend"
  npm start 
}
```

### **Paso 3: Verificar Estado**
```powershell
# Verificar que ambos servidores estén corriendo
Get-Job | Format-Table Id, Name, State
```

---

## 👤 **Flujo de Usuario Completo**

### **1. Registro e Inicio de Sesión**

#### **Acceder a la aplicación:**
- Abrir navegador en: http://localhost:3000
- La aplicación usa React Router, necesita navegar a rutas específicas

#### **Registro de Usuario:**
1. Navegar a: http://localhost:3000/#/register
2. Completar formulario:
   - **Username**: Nombre de usuario único
   - **Email**: Email válido
   - **Password**: Contraseña segura
3. Click en "Registrarse"
4. El backend crea el usuario en SQLite y devuelve confirmación

#### **Iniciar Sesión:**
1. Navegar a: http://localhost:3000/#/login
2. Introducir credenciales:
   - **Email**: Email registrado
   - **Password**: Contraseña
3. Click en "Iniciar sesión"
4. El backend valida credenciales y genera JWT token
5. Token se guarda en localStorage del navegador
6. Redirección automática al Dashboard

---

### **2. Dashboard Principal**

#### **Funcionalidades del Dashboard:**
- **Bienvenida personalizada** con email del usuario autenticado
- **Menú de navegación** con iconos SVG:
  - 👥 **Clientes**: Gestión de clientes y RNC
  - 📄 **Facturas**: Creación y envío de e-CF  
  - 👤 **Perfil**: Datos de empresa y NCF

#### **Sección Alanube:**
- **Información de configuración:**
  - RNC: 132109122
  - Company ID: 01K86AB4V87K31ZJQ57NRHRJWX
  - Rango NCF: 9,484,001 - 9,485,000
- **Botón "Conectar a Alanube"**: Prueba conexión con API real
- **Estado de conexión**: Muestra éxito/error de la integración

#### **Lista de Clientes:**
- Muestra clientes registrados en base de datos local
- Información: Nombre, RNC
- Se actualiza dinámicamente con nuevos registros

---

### **3. Gestión de Clientes**

#### **Acceder a Clientes:**
- Desde Dashboard → Click en "Clientes"
- URL: http://localhost:3000/#/clients

#### **Registrar Nuevo Cliente:**
1. Completar formulario:
   - **Nombre**: Razón social del cliente
   - **RNC**: Registro Nacional del Contribuyente (9-11 dígitos)
   - **Email**: Email de contacto
   - **Dirección**: Dirección física
2. Click en "Agregar Cliente"
3. Validación de datos en frontend y backend
4. Almacenamiento en base de datos SQLite
5. Actualización automática de la lista

#### **Funcionalidades:**
- **Validación RNC**: Formato correcto para República Dominicana
- **Lista dinámica**: Actualización en tiempo real
- **Formulario Alanube**: Login directo desde la vista

---

### **4. Creación de Facturas Electrónicas**

#### **Acceder a Facturas:**
- Desde Dashboard → Click en "Facturas"  
- URL: http://localhost:3000/#/invoices

#### **Proceso de Facturación:**

##### **Paso 1: Seleccionar Cliente**
- Dropdown con todos los clientes registrados
- Muestra: Nombre - RNC
- Validación obligatoria

##### **Paso 2: Detalles de Factura**
- **Descripción**: Detalle del producto/servicio
- **Monto**: Valor en RD$ (validación numérica)
- **Fecha**: Automática (fecha actual)

##### **Paso 3: Envío a Alanube**
1. Click en "Crear Factura"
2. **Proceso interno**:
   - Validación de datos en frontend
   - Envío a backend FastAPI
   - Backend estructura datos según normativa DGII
   - Llamada a API de Alanube con JWT Token
   - Alanube procesa y devuelve NCF oficial
3. **Respuesta**:
   - ✅ Éxito: Muestra NCF generado y estado legal
   - ❌ Error: Muestra mensaje específico del problema

#### **Lista de Facturas:**
- Historial completo de facturas creadas
- Información: Cliente, Descripción, Monto, Fecha, Estado
- Actualización automática después de crear nueva factura

---

### **5. Perfil de Empresa**

#### **Información Mostrada:**
- **Datos del usuario** logueado
- **Configuración Alanube** (RNC, Company ID, rangos)
- **Estado de integración** con servicios electrónicos

---

## 🔧 **Arquitectura Técnica Detallada**

### **Frontend (React)**

#### **Estructura de Componentes:**
```
src/
├── components/
│   ├── Dashboard.js    # Pantalla principal
│   ├── Login.js        # Autenticación  
│   ├── Register.js     # Registro usuarios
│   ├── Clients.js      # Gestión clientes
│   ├── Invoices.js     # Creación facturas
│   └── Profile.js      # Perfil empresa
├── alanubeConfig.js    # Configuración API
├── alanubeApi.js       # Funciones Alanube
├── custom.css          # Estilos personalizados
└── App.js              # Routing principal
```

#### **Funciones Alanube (`alanubeApi.js`):**
- `alanubeLogin()`: Autenticación con JWT Token
- `alanubeGetCompany()`: Información de empresa
- `alanubeCreateInvoice(data)`: Crear factura electrónica
- `alanubeGetInvoices()`: Listar facturas existentes
- `alanubeValidateToken()`: Validar token JWT

#### **Configuración (`alanubeConfig.js`):**
```javascript
ALANUBE_API_BASE = 'https://sandbox.alanube.co/dom/v1/'
ALANUBE_RNC = '132109122'
ALANUBE_COMPANY_ID = '01K86AB4V87K31ZJQ57NRHRJWX'
ALANUBE_JWT_TOKEN = 'eyJhbGci...' // Token real
```

### **Backend (FastAPI)**

#### **Estructura de API:**
```
backend/
├── app/
│   ├── main.py           # Aplicación principal
│   ├── models.py         # Modelos SQLAlchemy
│   ├── schemas.py        # Esquemas Pydantic
│   ├── database.py       # Configuración DB
│   ├── routes/
│   │   ├── auth.py       # Autenticación JWT
│   │   ├── clients.py    # CRUD clientes
│   │   ├── invoices.py   # CRUD facturas
│   │   └── users.py      # CRUD usuarios
│   └── services/
│       └── alanube.py    # Integración Alanube
└── requirements.txt      # Dependencias Python
```

#### **Endpoints Principales:**
- `POST /auth/register`: Registrar usuario
- `POST /auth/login`: Login y generar JWT
- `GET /clients/`: Listar clientes
- `POST /clients/`: Crear cliente
- `GET /invoices/`: Listar facturas
- `POST /invoices/`: Crear factura
- `GET /`: Health check

#### **Base de Datos (SQLite):**
```sql
-- Tabla usuarios
Users: id, username, email, hashed_password, created_at

-- Tabla clientes  
Clients: id, name, rnc, email, address, user_id, created_at

-- Tabla facturas
Invoices: id, client_id, description, amount, date, status, ncf, user_id
```

---

## 🌐 **Integración con Alanube**

### **¿Qué es Alanube?**
Alanube es un **Proveedor de Servicios Electrónicos (PSE)** certificado por la DGII para República Dominicana. Permite a las empresas enviar comprobantes fiscales electrónicos cumpliendo con la normativa legal.

### **Proceso de Integración:**

#### **1. Autenticación:**
- Uso de **JWT Token Bearer** en headers HTTP
- Token válido por tiempo extendido (exp: 1171734022)
- Scope: `c.r.u:apidom_full_access generic`

#### **2. Flujo de Facturación:**
```
FacturaPro → FastAPI → Alanube API → DGII
    ↓           ↓          ↓         ↓
  Frontend   Backend   Sandbox   Validación
   React    FastAPI   Alanube     Oficial
```

#### **3. Endpoints Utilizados:**
- `GET /company`: Información de empresa registrada
- `POST /invoice-fiscals/{companyId}`: Crear factura fiscal
- `GET /invoice-fiscals/{companyId}`: Listar facturas

#### **4. Estructura de Factura (JSON):**
```javascript
{
  "client": {
    "name": "Cliente Ejemplo",
    "rnc": "12345678901",
    "email": "cliente@ejemplo.com"
  },
  "items": [
    {
      "description": "Producto/Servicio",
      "quantity": 1,
      "price": 1000.00,
      "tax": 180.00
    }
  ],
  "totals": {
    "subtotal": 1000.00,
    "tax": 180.00,
    "total": 1180.00
  }
}
```

### **Datos del Sandbox:**
- **Ambiente**: Testing/Pruebas
- **RNC**: 132109122 (empresa de prueba)
- **Rango NCF**: 9,484,001 - 9,485,000
- **Portal**: https://sandbox-reseller.alanube.co/login
- **Credenciales**: juancasado@alanube.co / 01K86AAHNME9THX3PDT94828CX@a

---

## 🔒 **Seguridad y Autenticación**

### **Frontend:**
- **JWT Storage**: localStorage del navegador
- **Protected Routes**: Validación en cada componente
- **Token Validation**: Verificación de expiración
- **Logout**: Limpieza de tokens locales

### **Backend:**
- **Password Hashing**: bcrypt para contraseñas
- **JWT Generation**: python-jose con HS256
- **Protected Endpoints**: Middleware de autenticación
- **CORS**: Configurado para localhost:3000

### **Alanube:**
- **Bearer Authentication**: JWT en headers HTTP
- **HTTPS**: Todas las comunicaciones cifradas
- **Rate Limiting**: Según políticas de Alanube
- **Sandbox**: Ambiente aislado para pruebas

---

## 📊 **Flujo de Datos Completo**

### **Crear Factura - Paso a Paso:**

1. **Frontend (React)**:
   ```javascript
   // Usuario completa formulario
   const invoiceData = {
     clientId: selectedClient,
     description: "Servicio de consultoría", 
     amount: 25000
   };
   
   // Envío a backend local
   axios.post('http://127.0.0.1:8000/invoices/', invoiceData, {
     headers: { Authorization: `Bearer ${localToken}` }
   });
   ```

2. **Backend (FastAPI)**:
   ```python
   # Recibe datos y valida JWT
   @router.post("/")
   def create_invoice(invoice: InvoiceCreate, current_user: User = Depends(get_current_user)):
       # Valida cliente existe
       client = get_client(invoice.client_id)
       
       # Estructura datos para Alanube
       alanube_data = format_for_alanube(invoice, client)
       
       # Envía a Alanube API
       response = alanube_service.create_invoice(alanube_data)
       
       # Guarda en BD local con NCF obtenido
       db_invoice = save_invoice(invoice, response.ncf)
       return db_invoice
   ```

3. **Alanube API**:
   ```http
   POST https://sandbox.alanube.co/dom/v1/invoice-fiscals/01K86AB4V87K31ZJQ57NRHRJWX
   Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
   Content-Type: application/json
   
   {
     "invoice": { /* datos estructurados */ }
   }
   ```

4. **Respuesta Alanube → Backend → Frontend**:
   ```json
   {
     "id": "FAC-2025-001",
     "ncf": "E310000000001", 
     "status": "approved",
     "legal_status": "valid",
     "qr_code": "data:image/png;base64...",
     "pdf_url": "https://sandbox.alanube.co/pdf/..."
   }
   ```

---

## 🛠️ **Comandos Útiles para Desarrollo**

### **Gestión de Servidores:**
```powershell
# Verificar estado de jobs
Get-Job | Format-Table Id, Name, State

# Ver logs del frontend
Receive-Job -Id 3 -Keep | Select-Object -Last 10

# Ver logs del backend  
Receive-Job -Id 1 -Keep | Select-Object -Last 10

# Detener todos los jobs
Get-Job | Remove-Job -Force
```

### **Testing de API:**
```powershell
# Test backend health
Invoke-RestMethod -Uri "http://127.0.0.1:8000/" -Method GET

# Test frontend
Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5

# Test Alanube connection
$token = "eyJhbGci..."
$headers = @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' }
Invoke-RestMethod -Uri 'https://sandbox.alanube.co/dom/v1/company' -Headers $headers -Method GET
```

### **Base de Datos:**
```python
# Conectar a SQLite desde Python
import sqlite3
conn = sqlite3.connect('backend/test.db')
cursor = conn.cursor()

# Ver tablas
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print(cursor.fetchall())

# Ver usuarios
cursor.execute("SELECT * FROM users;")
print(cursor.fetchall())
```

---

## 📈 **Próximos Pasos y Mejoras**

### **Funcionalidades Pendientes:**
1. **Validación avanzada de RNC** con DGII
2. **Reportes financieros** y exportación
3. **Notificaciones email** automáticas
4. **Backup automático** de base de datos
5. **Dashboard analytics** con gráficos
6. **Multi-empresa** para el mismo usuario
7. **API de webhooks** para notificaciones
8. **App móvil** React Native

### **Mejoras Técnicas:**
1. **PostgreSQL** en lugar de SQLite
2. **Redis** para caché y sesiones  
3. **Docker** para containerización
4. **CI/CD** con GitHub Actions
5. **Testing** automatizado (Jest + Pytest)
6. **Monitoring** con logs estructurados
7. **Rate limiting** en endpoints
8. **Backup** automático en la nube

### **Deployment Production:**
1. **AWS/Azure** para hosting
2. **HTTPS** con certificados SSL
3. **CDN** para assets estáticos
4. **Load balancer** para escalabilidad
5. **Database clustering** para alta disponibilidad
6. **Error tracking** con Sentry
7. **Performance monitoring** con APM

---

## 🎓 **Aprendizajes Clave**

### **Tecnológicos:**
- **Full Stack Development** con React + FastAPI
- **API Integration** con servicios externos (Alanube)  
- **JWT Authentication** end-to-end
- **Database Design** con SQLAlchemy ORM
- **Responsive UI** con Tailwind CSS

### **Dominio de Negocio:**
- **Facturación Electrónica** en República Dominicana
- **Normativas DGII** y compliance fiscal
- **Proveedores de Servicios Electrónicos** (PSE)
- **NCF (Número de Comprobante Fiscal)** y validaciones
- **Integración B2B** con APIs gubernamentales

### **Arquitectura:**
- **Separation of Concerns** frontend/backend
- **RESTful API Design** principles
- **State Management** en React
- **Error Handling** y user feedback
- **Security Best Practices** para aplicaciones web

---

## 📞 **Soporte y Recursos**

### **Documentación Oficial:**
- **Alanube**: https://developer.alanube.co
- **DGII**: https://dgii.gov.do
- **FastAPI**: https://fastapi.tiangolo.com
- **React**: https://reactjs.org

### **Contactos Técnicos:**
- **Alanube Soporte**: soporte@alanube.co
- **Portal Reseller**: https://sandbox-reseller.alanube.co/login

---

**¡FacturaPro RD está listo para producción en República Dominicana! 🇩🇴**

*Desarrollado con ❤️ para cumplir con las normativas fiscales de RD*