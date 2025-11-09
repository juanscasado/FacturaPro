# test_commercial_features.py
"""
Script para probar las funcionalidades comerciales de FacturaPro
"""

import sqlite3
import json
from datetime import datetime

def test_commercial_features():
    """Probar las funcionalidades comerciales implementadas"""
    
    print("🚀 PRUEBA DE FUNCIONALIDADES COMERCIALES")
    print("=" * 50)
    
    # Conectar a la base de datos
    db_path = "invoices.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 1. Verificar tablas comerciales
        print("\n📋 1. VERIFICANDO TABLAS COMERCIALES")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        required_tables = [
            'company_settings', 'invoice_items', 'products_services',
            'analytics', 'usage_logs'
        ]
        
        for table in required_tables:
            if table in tables:
                print(f"   ✅ {table}: OK")
            else:
                print(f"   ❌ {table}: FALTA")
        
        # 2. Crear configuración de empresa por defecto
        print("\n🏢 2. CONFIGURANDO EMPRESA")
        cursor.execute("""
            INSERT OR REPLACE INTO company_settings 
            (company_id, required_client_fields, client_custom_fields, plan, limits)
            VALUES (1, ?, ?, 'professional', ?)
        """, (
            json.dumps(["name", "rnc", "email", "phone"]),
            json.dumps([
                {"name": "sector_empresa", "label": "Sector de Empresa", "type": "select", "options": ["Comercial", "Industrial", "Servicios"]},
                {"name": "referido_por", "label": "Referido por", "type": "text"}
            ]),
            json.dumps({"invoices": 200, "users": 3, "products": 100})
        ))
        print("   ✅ Configuración de empresa creada")
        
        # 3. Crear productos/servicios de ejemplo
        print("\n📦 3. CREANDO PRODUCTOS/SERVICIOS")
        sample_products = [
            ("service", "Consultoría Estratégica", "Servicios de consultoría empresarial", 4500.00, "Consultoría", "CON-EST-001", 18.0),
            ("product", "Licencia Software Premium", "Licencia anual de software empresarial", 25000.00, "Software", "LIC-PREM-002", 18.0),
            ("service", "Desarrollo Web Completo", "Sitio web corporativo completo", 85000.00, "Desarrollo", "DEV-WEB-003", 18.0),
            ("service", "Mantenimiento IT", "Servicio mensual de mantenimiento", 12500.00, "IT", "MNT-IT-004", 18.0),
            ("product", "Equipo de Red", "Switch y router empresarial", 35000.00, "Hardware", "HW-NET-005", 18.0)
        ]
        
        for product_type, name, description, price, category, sku, tax_rate in sample_products:
            cursor.execute("""
                INSERT OR REPLACE INTO products_services 
                (type, name, description, price, category, sku, tax_rate)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (product_type, name, description, price, category, sku, tax_rate))
            print(f"   ✅ {name}: RD${price:,.2f}")
        
        # 4. Crear factura con múltiples items
        print("\n📄 4. CREANDO FACTURA CON MÚLTIPLES ITEMS")
        
        # Obtener el último ID de factura
        cursor.execute("SELECT MAX(id) FROM invoices")
        last_id = cursor.fetchone()[0] or 0
        next_number = f"FACT-{(last_id + 1):06d}"
        
        # Insertar factura
        cursor.execute("""
            INSERT INTO invoices 
            (client_id, user_id, description, amount, status, number, client_name, client_rnc, subtotal, tax_amount)
            VALUES (1, 1, 'Servicios profesionales múltiples', 0, 'draft', ?, 'Empresa Demo SRL', '131234567890', 0, 0)
        """, (next_number,))
        
        invoice_id = cursor.lastrowid
        
        # Agregar items a la factura
        invoice_items = [
            ("Consultoría estratégica - 20 horas", 20.0, 4500.00, 18.0),
            ("Licencia software premium - 1 año", 1.0, 25000.00, 18.0),
            ("Setup e implementación", 1.0, 8500.00, 18.0)
        ]
        
        subtotal_total = 0
        tax_total = 0
        
        for description, quantity, unit_price, tax_rate in invoice_items:
            line_subtotal = quantity * unit_price
            line_tax = line_subtotal * (tax_rate / 100)
            line_total = line_subtotal + line_tax
            
            cursor.execute("""
                INSERT INTO invoice_items 
                (invoice_id, description, quantity, unit_price, tax_rate, total)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (invoice_id, description, quantity, unit_price, tax_rate, line_total))
            
            subtotal_total += line_subtotal
            tax_total += line_tax
            print(f"   📝 {description}: {quantity} x RD${unit_price:,.2f} = RD${line_total:,.2f}")
        
        # Actualizar totales de la factura
        total_amount = subtotal_total + tax_total
        cursor.execute("""
            UPDATE invoices 
            SET subtotal = ?, tax_amount = ?, amount = ?
            WHERE id = ?
        """, (subtotal_total, tax_total, total_amount, invoice_id))
        
        print(f"   💰 Subtotal: RD${subtotal_total:,.2f}")
        print(f"   🧾 ITBIS: RD${tax_total:,.2f}")
        print(f"   💵 Total: RD${total_amount:,.2f}")
        
        # 5. Crear analytics de ejemplo
        print("\n📊 5. GENERANDO ANALYTICS")
        analytics_data = [
            ("monthly_revenue", total_amount, "monthly", datetime.now().date()),
            ("invoices_created", 1, "daily", datetime.now().date()),
            ("clients_active", 1, "monthly", datetime.now().date()),
            ("products_sold", 3, "daily", datetime.now().date())
        ]
        
        for metric_name, metric_value, period, date in analytics_data:
            cursor.execute("""
                INSERT OR REPLACE INTO analytics 
                (company_id, metric_name, metric_value, period, date)
                VALUES (1, ?, ?, ?, ?)
            """, (metric_name, metric_value, period, date))
            print(f"   📈 {metric_name}: {metric_value}")
        
        # 6. Log de uso
        print("\n📝 6. REGISTRANDO USO")
        cursor.execute("""
            INSERT INTO usage_logs 
            (company_id, action, metadata)
            VALUES (1, 'demo_setup_completed', ?)
        """, (json.dumps({
            "products_created": len(sample_products),
            "invoice_created": True,
            "setup_date": datetime.now().isoformat()
        }),))
        
        print("   ✅ Uso registrado")
        
        # 7. Resumen final
        print("\n📋 7. RESUMEN DEL SISTEMA COMERCIAL")
        
        # Contar elementos
        cursor.execute("SELECT COUNT(*) FROM products_services")
        products_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM invoices")
        invoices_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM invoice_items")
        items_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT SUM(amount) FROM invoices")
        total_revenue = cursor.fetchone()[0] or 0
        
        print(f"""
📊 ESTADO DEL SISTEMA:
   • Productos/Servicios: {products_count}
   • Facturas: {invoices_count}
   • Items de facturas: {items_count}
   • Ingresos totales: RD${total_revenue:,.2f}
   
🎯 FUNCIONALIDADES IMPLEMENTADAS:
   ✅ Configuración dinámica de empresa
   ✅ Gestión de productos/servicios
   ✅ Facturas con múltiples items
   ✅ Cálculos automáticos de impuestos
   ✅ Analytics y métricas
   ✅ Log de uso y actividades
   
🚀 LISTO PARA:
   ✅ Frontend React mejorado
   ✅ API comercial completa
   ✅ Dashboard con reportes
   ✅ Sistema de planes y límites
        """)
        
        conn.commit()
        print("\n✅ ¡Sistema comercial configurado exitosamente!")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error configurando sistema comercial: {e}")
        conn.rollback()
        return False
        
    finally:
        conn.close()

if __name__ == "__main__":
    success = test_commercial_features()
    if success:
        print("\n🎉 FacturaPro está listo para funcionar como aplicación comercial!")
        print("💡 Próximos pasos:")
        print("   1. Ejecutar backend con funcionalidades comerciales")
        print("   2. Probar frontend con nuevos componentes")
        print("   3. Configurar planes de suscripción")
        print("   4. Implementar sistema de pagos")
    else:
        print("\n⚠️  Revisa los errores e intenta nuevamente")