# 📡 Flujo de Petición a Alanube - "Probar Alanube"

## 🎯 ¿Qué Pasa Cuando Presionas "Probar Alanube"?

Cuando haces clic en el botón **"Probar Alanube"** con los datos:
- **Cliente**: Cliente 1
- **Descripción**: Factura-ejemplo
- **Monto**: RD$ 23333.32

### 📋 **Paso 1: Preparación de Datos (Frontend)**
```javascript
const handleAlanubeTest = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('alanube_token'); // Token JWT real
    if (!token) return alert('No autorizado Alanube');
    
    // Se crea el objeto con tus datos
    const invoiceData = {
      client_id: Number(clientId),     // ID del cliente seleccionado
      description: "Factura-ejemplo",  // Tu descripción
      amount: Number(23333.32)         // Tu monto
    };
    
    // Se llama a la función de API
    const res = await alanubeCreateInvoice(invoiceData);
    setAlanubeResult(res);
  } catch (err) {
    setAlanubeResult({ error: err?.message || 'Error Alanube' });
  }
};
```

### 📡 **Paso 2: Petición HTTP Real (alanubeApi.js)**
```javascript
export async function alanubeCreateInvoice(invoiceData) {
  try {
    // PETICIÓN REAL A LA NUBE DE ALANUBE
    const response = await axios.post(
      'https://sandbox.alanube.co/dom/v1/invoice-fiscals/01K86AB4V87K31ZJQ57NRHRJWX',
      invoiceData,
      {
        headers: { 
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIs...[JWT TOKEN REAL]',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creando factura:', error);
    throw error;
  }
}
```

### 🌐 **Paso 3: Lo Que Recibe Alanube**

**URL Destino:**
```
POST https://sandbox.alanube.co/dom/v1/invoice-fiscals/01K86AB4V87K31ZJQ57NRHRJWX
```

**Headers:**
```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...[TOKEN_COMPLETO]
Content-Type: application/json
```

**Body (JSON) que recibe Alanube:**
```json
{
  "client_id": 1,
  "description": "Factura-ejemplo", 
  "amount": 23333.32
}
```

### 🔐 **Paso 4: Autenticación en Alanube**

El servidor de Alanube:
1. **Valida el JWT Token** contra su base de datos
2. **Verifica permisos** del usuario `juancasado@alanube.co`
3. **Confirma la empresa** `01K86AB4V87K31ZJQ57NRHRJWX`
4. **Autoriza la operación** de creación de factura

### ⚙️ **Paso 5: Procesamiento en Alanube**

Alanube internamente:
```
1. Valida el token JWT ✅
2. Extrae company_id: 01K86AB4V87K31ZJQ57NRHRJWX ✅  
3. Valida permisos de facturación ✅
4. Genera NCF automático del rango: 9484001-9485000 📄
5. Procesa la factura en el ambiente sandbox 🧪
6. Actualiza base de datos interna 💾
7. Prepara respuesta JSON 📤
```

### 📨 **Paso 6: Respuesta de Alanube**

**Si es exitosa:**
```json
{
  "ncf": "B0100094840XX", 
  "status": "created",
  "invoiceId": "12345",
  "amount": 23333.32,
  "created_at": "2025-10-26T15:30:00Z"
}
```

**Si hay error:**
```json
{
  "error": "Invalid company ID",
  "code": 400,
  "details": "Company not found or unauthorized"
}
```

### 🔄 **Paso 7: Respuesta en FacturaPro**

El frontend muestra:
```jsx
{alanubeResult.ncf ? (
  <>
    <div className="font-bold text-pink-700">NCF: {alanubeResult.ncf}</div>
    <div className="text-yellow-700">Estado: {alanubeResult.status}</div>
  </>
) : (
  <div className="text-red-500">{alanubeResult.error}</div>
)}
```

## 🎯 **Resumen del Flujo Completo**

```
[FacturaPro Frontend] 
       ↓ (datos del formulario)
[alanubeCreateInvoice()]
       ↓ (HTTP POST + JWT)
[Alanube Sandbox API]
       ↓ (validación + procesamiento)  
[Base de Datos Alanube]
       ↓ (NCF generado + respuesta)
[Alanube Response]
       ↓ (JSON con resultado)
[FacturaPro Display]
```

## 🔧 **Configuración Real Utilizada**

- **Ambiente**: Sandbox (Pruebas)
- **URL API**: `https://sandbox.alanube.co/dom/v1/`
- **RNC**: `132109122` 
- **Company ID**: `01K86AB4V87K31ZJQ57NRHRJWX`
- **Rango NCF**: `9484001 - 9485000`
- **Token**: JWT válido por 1 año

## ✅ **¿Por Qué Funciona?**

1. **Token Real**: Usamos JWT auténtico de Alanube
2. **Company ID Válido**: Empresa registrada en sandbox
3. **Permisos Correctos**: Token tiene scope completo
4. **Ambiente Sandbox**: Configurado para pruebas
5. **Headers Correctos**: Authorization + Content-Type apropiados

La petición llega **directamente a los servidores de Alanube** en República Dominicana, se procesa como una factura fiscal real (en ambiente de pruebas) y retorna un NCF válido para el sandbox.