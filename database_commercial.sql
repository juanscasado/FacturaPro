-- Migración para campos dinámicos y configuración empresarial
-- Ejecutar en la base de datos después de la implementación

-- 1. Tabla de configuración de empresa
CREATE TABLE company_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_rnc VARCHAR(20) NOT NULL,
    company_address TEXT,
    company_phone VARCHAR(20),
    company_email VARCHAR(255),
    company_logo_url VARCHAR(500),
    
    -- Configuración de facturación
    default_currency VARCHAR(3) DEFAULT 'DOP',
    tax_percentage DECIMAL(5,2) DEFAULT 18.00,
    next_invoice_number INTEGER DEFAULT 1,
    invoice_prefix VARCHAR(10) DEFAULT 'FACT-',
    
    -- Configuración de Alanube
    alanube_company_id VARCHAR(50),
    alanube_environment VARCHAR(20) DEFAULT 'sandbox', -- sandbox/production
    
    -- Configuración de campos dinámicos
    required_client_fields JSON, -- ['phone', 'address', 'contact_person']
    invoice_custom_fields JSON,  -- campos personalizados en facturas
    
    -- Límites de plan
    plan_type VARCHAR(20) DEFAULT 'starter',
    monthly_invoice_limit INTEGER DEFAULT 50,
    user_limit INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 2. Extender tabla de clientes con campos dinámicos
ALTER TABLE clients ADD COLUMN phone VARCHAR(20);
ALTER TABLE clients ADD COLUMN address TEXT;
ALTER TABLE clients ADD COLUMN contact_person VARCHAR(255);
ALTER TABLE clients ADD COLUMN email VARCHAR(255);
ALTER TABLE clients ADD COLUMN client_type VARCHAR(50) DEFAULT 'individual'; -- individual/business
ALTER TABLE clients ADD COLUMN tax_id VARCHAR(20); -- Cédula o pasaporte
ALTER TABLE clients ADD COLUMN custom_fields JSON; -- campos personalizados por empresa

-- 3. Extender tabla de facturas
ALTER TABLE invoices ADD COLUMN invoice_number VARCHAR(50);
ALTER TABLE invoices ADD COLUMN subtotal DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN tax_amount DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN total_amount DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN currency VARCHAR(3) DEFAULT 'DOP';
ALTER TABLE invoices ADD COLUMN due_date DATE;
ALTER TABLE invoices ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE invoices ADD COLUMN payment_method VARCHAR(50);
ALTER TABLE invoices ADD COLUMN notes TEXT;
ALTER TABLE invoices ADD COLUMN custom_fields JSON;

-- 4. Tabla de items de factura (líneas de productos/servicios)
CREATE TABLE invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    line_number INTEGER NOT NULL,
    
    -- Información del producto/servicio
    item_code VARCHAR(50),
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Cantidades y precios
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    tax_percentage DECIMAL(5,2) DEFAULT 18.00,
    
    -- Calculados
    subtotal DECIMAL(10,2) NOT NULL, -- quantity * unit_price - descuento
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Clasificación para Alanube
    billing_indicator INTEGER DEFAULT 1,
    good_service_indicator INTEGER DEFAULT 2, -- 1=Bien, 2=Servicio
    unit_of_measure VARCHAR(10) DEFAULT 'UND',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices (id)
);

-- 5. Tabla de productos/servicios predefinidos
CREATE TABLE products_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    
    -- Información básica
    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    -- Precios
    unit_price DECIMAL(10,2) NOT NULL,
    tax_percentage DECIMAL(5,2) DEFAULT 18.00,
    
    -- Clasificación
    type VARCHAR(20) DEFAULT 'service', -- product/service
    unit_of_measure VARCHAR(10) DEFAULT 'UND',
    billing_indicator INTEGER DEFAULT 1,
    good_service_indicator INTEGER DEFAULT 2,
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 6. Tabla de plantillas de factura
CREATE TABLE invoice_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) DEFAULT 'standard', -- standard/service/retail
    
    -- Configuración de campos
    fields_config JSON, -- qué campos mostrar y si son requeridos
    
    -- Diseño
    header_config JSON, -- logo, colores, etc.
    footer_text TEXT,
    
    -- Términos y condiciones por defecto
    terms_conditions TEXT,
    payment_instructions TEXT,
    
    is_default BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 7. Tabla de reportes y analytics
CREATE TABLE usage_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    
    -- Período
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Métricas
    invoices_created INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    clients_active INTEGER DEFAULT 0,
    alanube_requests INTEGER DEFAULT 0,
    
    -- Límites del plan
    plan_invoice_limit INTEGER,
    plan_user_limit INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Indexes para performance
CREATE INDEX idx_company_settings_user ON company_settings(user_id);
CREATE INDEX idx_clients_user ON clients(user_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_products_user ON products_services(user_id);
CREATE INDEX idx_templates_user ON invoice_templates(user_id);
CREATE INDEX idx_analytics_user_period ON usage_analytics(user_id, period_start);