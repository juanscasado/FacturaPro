from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime, Boolean, Text, JSON, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# ================================
# CONFIGURACIÓN DE EMPRESA
# ================================

class CompanySettings(Base):
    __tablename__ = "company_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, default=1)
    
    # Configuración de campos dinámicos
    required_client_fields = Column(JSON, default=["name", "rnc", "email"])
    client_custom_fields = Column(JSON, default=[])
    
    # Configuración de plantillas
    invoice_template = Column(String, default="default")
    currency = Column(String, default="DOP")
    tax_rate = Column(Numeric(5,2), default=18.00)
    
    # Plan y límites
    plan = Column(String, default="starter")
    limits = Column(JSON, default={"invoices": 50, "users": 1, "products": 20})
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# ================================
# ITEMS DE FACTURAS (NUEVA TABLA)
# ================================

class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    
    description = Column(Text, nullable=False)
    quantity = Column(Numeric(10,2), nullable=False, default=1)
    unit_price = Column(Numeric(10,2), nullable=False)
    tax_rate = Column(Numeric(5,2), default=0)
    total = Column(Numeric(10,2), nullable=False)
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    invoice = relationship("Invoice", back_populates="items")

# ================================
# PRODUCTOS Y SERVICIOS
# ================================

class ProductService(Base):
    __tablename__ = "products_services"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, default=1)
    
    type = Column(String, nullable=False)  # 'product' or 'service'
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Numeric(10,2), nullable=False)
    category = Column(String)
    sku = Column(String, unique=True)
    tax_rate = Column(Numeric(5,2), default=18.00)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

# ================================
# ANALÍTICAS
# ================================

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, nullable=False)
    
    metric_name = Column(String, nullable=False)
    metric_value = Column(Numeric(15,2))
    period = Column(String)  # 'daily', 'weekly', 'monthly'
    date = Column(Date, nullable=False)
    
    created_at = Column(DateTime, default=func.now())

# ================================
# LOG DE USO
# ================================

class UsageLog(Base):
    __tablename__ = "usage_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, nullable=False)
    
    action = Column(String, nullable=False)  # 'invoice_created', 'product_added', etc.
    extra_data = Column(JSON)  # Cambiado de 'metadata' a 'extra_data'
    timestamp = Column(DateTime, default=func.now())