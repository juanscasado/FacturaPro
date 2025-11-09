# backend/migrate_to_commercial.py
"""
Script de migración para actualizar FacturaPro a versión comercial
Ejecutar: python migrate_to_commercial.py
"""

import sqlite3
import json
from datetime import datetime
import os

def migrate_database():
    """Migrar base de datos existente a versión comercial"""
    
    # Ruta de la base de datos
    db_path = os.path.join(os.path.dirname(__file__), "invoices.db")
    
    # Crear backup
    backup_path = f"{db_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    os.system(f'copy "{db_path}" "{backup_path}"')
    print(f"✅ Backup creado: {backup_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔄 Iniciando migración a versión comercial...")
        
        # 1. Crear tabla company_settings
        print("📝 Creando tabla company_settings...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS company_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL DEFAULT 1,
                required_client_fields JSON DEFAULT '["name", "rnc", "email"]',
                client_custom_fields JSON DEFAULT '[]',
                invoice_template VARCHAR(50) DEFAULT 'default',
                currency VARCHAR(10) DEFAULT 'DOP',
                tax_rate DECIMAL(5,2) DEFAULT 18.00,
                plan VARCHAR(20) DEFAULT 'starter',
                limits JSON DEFAULT '{"invoices": 50, "users": 1, "products": 20}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insertar configuración por defecto
        cursor.execute("""
            INSERT OR IGNORE INTO company_settings (company_id) VALUES (1)
        """)
        
        # 2. Actualizar tabla invoices
        print("📝 Actualizando tabla invoices...")
        
        # Verificar si las columnas ya existen
        cursor.execute("PRAGMA table_info(invoices)")
        existing_columns = [row[1] for row in cursor.fetchall()]
        
        if 'company_id' not in existing_columns:
            cursor.execute("ALTER TABLE invoices ADD COLUMN company_id INTEGER DEFAULT 1")
            
        if 'subtotal' not in existing_columns:
            cursor.execute("ALTER TABLE invoices ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0")
            
        if 'tax_amount' not in existing_columns:
            cursor.execute("ALTER TABLE invoices ADD COLUMN tax_amount DECIMAL(10,2) DEFAULT 0")
            
        if 'status' not in existing_columns:
            cursor.execute("ALTER TABLE invoices ADD COLUMN status VARCHAR(20) DEFAULT 'draft'")
            
        if 'ncf' not in existing_columns:
            cursor.execute("ALTER TABLE invoices ADD COLUMN ncf VARCHAR(50)")
            
        if 'payment_date' not in existing_columns:
            cursor.execute("ALTER TABLE invoices ADD COLUMN payment_date TIMESTAMP")
            
        if 'notes' not in existing_columns:
            cursor.execute("ALTER TABLE invoices ADD COLUMN notes TEXT")
            
        if 'custom_fields' not in existing_columns:
            cursor.execute("ALTER TABLE invoices ADD COLUMN custom_fields JSON DEFAULT '{}'")
        
        # 3. Crear tabla invoice_items
        print("📝 Creando tabla invoice_items...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS invoice_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL,
                description TEXT NOT NULL,
                quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
                unit_price DECIMAL(10,2) NOT NULL,
                tax_rate DECIMAL(5,2) DEFAULT 0,
                total DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (invoice_id) REFERENCES invoices (id)
            )
        """)
        
        # 4. Crear tabla products_services
        print("📝 Creando tabla products_services...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products_services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL DEFAULT 1,
                type VARCHAR(20) NOT NULL DEFAULT 'product',
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(100),
                sku VARCHAR(100),
                tax_rate DECIMAL(5,2) DEFAULT 18.00,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 5. Crear tabla analytics
        print("📝 Creando tabla analytics...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                metric_name VARCHAR(100) NOT NULL,
                metric_value DECIMAL(15,2),
                period VARCHAR(20),
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 6. Crear tabla usage_logs
        print("📝 Creando tabla usage_logs...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usage_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                action VARCHAR(100) NOT NULL,
                metadata JSON,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 7. Migrar datos existentes de facturas
        print("🔄 Migrando datos existentes de facturas...")
        
        # Obtener facturas existentes
        cursor.execute("SELECT id, amount FROM invoices WHERE subtotal IS NULL OR subtotal = 0")
        existing_invoices = cursor.fetchall()
        
        for invoice_id, amount in existing_invoices:
            if amount:
                # Calcular subtotal y tax (asumiendo 18% ITBIS)
                total = float(amount)
                subtotal = total / 1.18  # Remover ITBIS
                tax_amount = total - subtotal
                
                cursor.execute("""
                    UPDATE invoices 
                    SET subtotal = ?, tax_amount = ?, status = 'sent'
                    WHERE id = ?
                """, (subtotal, tax_amount, invoice_id))
                
                # Crear item por defecto para facturas existentes
                cursor.execute("""
                    INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, tax_rate, total)
                    VALUES (?, 'Servicio/Producto', 1, ?, 18.0, ?)
                """, (invoice_id, subtotal, total))
        
        # 8. Crear algunos productos de ejemplo
        print("📝 Insertando productos de ejemplo...")
        sample_products = [
            ("product", "Consultoría por Hora", "Servicios de consultoría profesional", 2500.00, "Servicios", "CONS-001"),
            ("product", "Desarrollo Web", "Desarrollo de sitio web completo", 45000.00, "Servicios", "DEV-001"),
            ("product", "Mantenimiento Mensual", "Mantenimiento y soporte mensual", 8500.00, "Servicios", "MNT-001"),
            ("product", "Licencia Software", "Licencia de uso de software", 15000.00, "Software", "LIC-001")
        ]
        
        for product_type, name, description, price, category, sku in sample_products:
            cursor.execute("""
                INSERT OR IGNORE INTO products_services 
                (type, name, description, price, category, sku)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (product_type, name, description, price, category, sku))
        
        # 9. Crear índices para mejor rendimiento
        print("📝 Creando índices...")
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id)",
            "CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status)",
            "CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at)",
            "CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id)",
            "CREATE INDEX IF NOT EXISTS idx_products_company_id ON products_services(company_id)",
            "CREATE INDEX IF NOT EXISTS idx_analytics_company_id ON analytics(company_id)",
            "CREATE INDEX IF NOT EXISTS idx_usage_logs_company_id ON usage_logs(company_id)"
        ]
        
        for index_sql in indexes:
            cursor.execute(index_sql)
        
        conn.commit()
        print("✅ Migración completada exitosamente!")
        
        # Mostrar resumen
        cursor.execute("SELECT COUNT(*) FROM invoices")
        invoice_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM invoice_items")
        items_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM products_services")
        products_count = cursor.fetchone()[0]
        
        print(f"""
📊 RESUMEN DE MIGRACIÓN:
   • Facturas: {invoice_count}
   • Items de factura: {items_count}
   • Productos/Servicios: {products_count}
   • Configuración de empresa: ✅ Creada
   • Índices de rendimiento: ✅ Creados
        """)
        
    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()
    
    return True

def verify_migration():
    """Verificar que la migración se ejecutó correctamente"""
    db_path = os.path.join(os.path.dirname(__file__), "invoices.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("\n🔍 VERIFICANDO MIGRACIÓN...")
    
    # Verificar tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    
    required_tables = [
        'company_settings', 'invoices', 'invoice_items', 
        'products_services', 'analytics', 'usage_logs'
    ]
    
    for table in required_tables:
        if table in tables:
            print(f"   ✅ Tabla {table}: OK")
        else:
            print(f"   ❌ Tabla {table}: FALTA")
    
    # Verificar datos
    cursor.execute("SELECT COUNT(*) FROM company_settings")
    settings_count = cursor.fetchone()[0]
    print(f"   📝 Configuraciones de empresa: {settings_count}")
    
    cursor.execute("SELECT COUNT(*) FROM products_services")
    products_count = cursor.fetchone()[0]
    print(f"   📦 Productos/Servicios: {products_count}")
    
    conn.close()

if __name__ == "__main__":
    print("🚀 MIGRACIÓN FACTURAPRO A VERSIÓN COMERCIAL")
    print("=" * 50)
    
    if migrate_database():
        verify_migration()
        print(f"\n✅ ¡Migración completada! La base de datos está lista para la versión comercial.")
        print(f"💡 Recuerda actualizar main.py para incluir las nuevas rutas comerciales.")
    else:
        print(f"\n❌ La migración falló. Revisa los errores arriba.")