# 📡 Monitor de Alanube en Tiempo Real - Guía de Uso

## 🚀 **¡Monitor Activado!**

Ya tienes disponible el **Monitor de Alanube en Tiempo Real** en tu aplicación:

### 📍 **Cómo Acceder:**
1. Ve a: **http://localhost:3000/monitor**
2. O usa el menú de navegación: **📡 Monitor**

---

## 🔍 **¿Qué Puedes Ver?**

### **📊 Dashboard de Monitoreo:**
- **Total de peticiones** realizadas a Alanube
- **Peticiones exitosas** (status 200-299)
- **Errores detectados** (status 400+)  
- **Peticiones pendientes** en tiempo real

### **📋 Log Detallado:**
Cada petición muestra:
- ⏰ **Timestamp** exacto
- 🔗 **URL completa** de la petición
- 📤 **Request Body** (datos enviados)
- 📨 **Response Data** (respuesta de Alanube)
- 🔑 **Headers** de autenticación
- ⚡ **Duración** en milisegundos
- 🚦 **Status HTTP** con colores

---

## 🧪 **Pruebas Rápidas Incluidas:**

### **1. 🔗 Probar Conexión**
- Valida tu token JWT con Alanube
- Confirma que la autenticación funciona

### **2. 🏢 Obtener Empresa**  
- Recupera información de tu empresa
- Muestra datos como RNC, nombre, etc.

### **3. 📄 Factura de Prueba**
- Crea una factura de prueba automáticamente
- Genera NCF real en ambiente sandbox

---

## 🔧 **Cómo Usar el Monitor:**

### **Paso 1: Abre el Monitor**
```
http://localhost:3000/monitor
```

### **Paso 2: Haz una Petición**
- Ve a **Facturas** y presiona "Probar Alanube", o
- Usa los botones de prueba rápida en el monitor, o
- Ve al **Dashboard** y conecta con Alanube

### **Paso 3: Observa en Tiempo Real**
Verás aparecer instantáneamente:
```
REQUEST  POST  pending     [timestamp]
↓ 
RESPONSE POST  200 OK     [timestamp + duración]
```

### **Paso 4: Inspecciona los Datos**
- Haz clic en "Ver datos JSON" para ver el body completo
- Haz clic en "Ver headers" para ver la autenticación
- Filtra por "Exitosos" o "Errores"

---

## 📱 **Consola del Navegador (Opcional)**

También puedes monitorear desde la consola:

### **1. Abre DevTools (F12)**
### **2. Ve a la pestaña Console**
### **3. Pega este código:**

```javascript
// Monitor de Alanube en consola
window.addEventListener('alanube-log', (event) => {
  const log = event.detail;
  const emoji = log.type === 'request' ? '📤' : 
               log.type === 'response' ? '📨' : '❌';
  
  console.group(`${emoji} Alanube ${log.type.toUpperCase()}`);
  console.log('🕐 Timestamp:', log.timestamp);
  console.log('🔗 URL:', log.url);
  console.log('📊 Status:', log.status);
  
  if (log.data) {
    console.log('📋 Data:', log.data);
  }
  
  if (log.duration) {
    console.log('⚡ Duration:', log.duration + 'ms');
  }
  
  console.groupEnd();
});

console.log('🔥 Monitor de Alanube activado en consola!');
```

---

## 🎯 **Ejemplo de Flujo Completo:**

### **Cuando presionas "Probar Alanube" verás:**

1. **📤 REQUEST** - Tu petición saliendo
```json
{
  "method": "POST",
  "url": "https://sandbox.alanube.co/dom/v1/invoice-fiscals/01K86AB...",
  "data": {
    "client_id": 1,
    "description": "Factura-ejemplo",
    "amount": 23333.32
  }
}
```

2. **📨 RESPONSE** - La respuesta de Alanube  
```json
{
  "status": 200,
  "data": {
    "ncf": "B01000948401",
    "status": "created",
    "invoiceId": "ALN123456"
  },
  "duration": 1250
}
```

---

## ✨ **Características Avanzadas:**

### **🎚️ Filtros:**
- **Todos**: Muestra todas las peticiones
- **Exitosos**: Solo status 200-299
- **Errores**: Solo status 400+ y errores de red

### **🧹 Limpieza:**
- Botón "Limpiar Logs" para reset
- Automáticamente mantiene últimos 50 registros

### **📊 Estadísticas:**
- Contador en tiempo real
- Indicadores visuales por tipo
- Duración promedio de peticiones

---

## 🚨 **Troubleshooting:**

### **Si no ves logs:**
1. Asegúrate de estar en `/monitor`
2. Haz una petición desde Facturas o Dashboard  
3. Revisa la consola del navegador por errores

### **Si ves errores:**
1. Verifica que los servidores estén activos
2. Comprueba tu conexión a internet
3. El token JWT puede haber expirado

---

## 🎊 **¡A Monitorear!**

Ahora puedes ver **en tiempo real** cómo tu aplicación se comunica con Alanube en República Dominicana. ¡Cada clic se convierte en una petición HTTP que puedes inspeccionar completamente!

**URL del Monitor:** http://localhost:3000/monitor 📡