# backend/app/routes/commercial.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import json

from ..database import get_db
from ..models import User, Invoice
from ..models_extensions import (
    CompanySettings, InvoiceItem, ProductService, Analytics, UsageLog
)
from .auth import get_current_user  # Cambiado la importación

router = APIRouter(prefix="/api/commercial", tags=["commercial"])

# ================================
# COMPANY SETTINGS ENDPOINTS
# ================================

@router.get("/company/settings")
async def get_company_settings(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener configuración de la empresa"""
    settings = db.query(CompanySettings).filter_by(
        company_id=current_user["company_id"]
    ).first()
    
    if not settings:
        # Crear configuración por defecto
        settings = CompanySettings(
            company_id=current_user["company_id"],
            required_client_fields=["name", "rnc", "email"],
            client_custom_fields=[],
            invoice_template="default",
            currency="DOP",
            tax_rate=18.0
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return {
        "company_id": settings.company_id,
        "required_client_fields": settings.required_client_fields,
        "client_custom_fields": settings.client_custom_fields,
        "invoice_template": settings.invoice_template,
        "currency": settings.currency,
        "tax_rate": settings.tax_rate,
        "plan": settings.plan,
        "limits": settings.limits
    }

@router.put("/company/settings")
async def update_company_settings(
    settings_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar configuración de la empresa"""
    settings = db.query(CompanySettings).filter_by(
        company_id=current_user["company_id"]
    ).first()
    
    if not settings:
        settings = CompanySettings(company_id=current_user["company_id"])
        db.add(settings)
    
    # Actualizar campos permitidos
    allowed_fields = [
        'required_client_fields', 'client_custom_fields', 'invoice_template',
        'currency', 'tax_rate'
    ]
    
    for field in allowed_fields:
        if field in settings_data:
            setattr(settings, field, settings_data[field])
    
    settings.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(settings)
    
    return {"message": "Configuración actualizada exitosamente"}

# ================================
# PRODUCTS/SERVICES ENDPOINTS
# ================================

@router.get("/products", response_model=List[dict])
async def get_products(
    category: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener productos/servicios de la empresa"""
    query = db.query(ProductService).filter_by(
        company_id=current_user["company_id"],
        is_active=True
    )
    
    if category:
        query = query.filter_by(category=category)
    
    products = query.all()
    
    return [
        {
            "id": p.id,
            "type": p.type,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "category": p.category,
            "sku": p.sku,
            "tax_rate": float(p.tax_rate) if p.tax_rate else None
        }
        for p in products
    ]

@router.post("/products")
async def create_product(
    product_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear nuevo producto/servicio"""
    # Verificar límites del plan
    if not await check_product_limit(current_user["company_id"], db):
        raise HTTPException(
            status_code=403,
            detail="Límite de productos alcanzado para su plan"
        )
    
    product = ProductService(
        company_id=current_user["company_id"],
        **product_data
    )
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return {"id": product.id, "message": "Producto creado exitosamente"}

@router.put("/products/{product_id}")
async def update_product(
    product_id: int,
    product_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar producto/servicio"""
    product = db.query(ProductService).filter_by(
        id=product_id,
        company_id=current_user["company_id"]
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    for field, value in product_data.items():
        if hasattr(product, field):
            setattr(product, field, value)
    
    product.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Producto actualizado exitosamente"}

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar producto/servicio (soft delete)"""
    product = db.query(ProductService).filter_by(
        id=product_id,
        company_id=current_user["company_id"]
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    product.is_active = False
    product.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Producto eliminado exitosamente"}

# ================================
# ENHANCED INVOICES ENDPOINTS
# ================================

@router.get("/invoices", response_model=List[dict])
async def get_invoices_with_items(
    status: Optional[str] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener facturas con sus items"""
    query = db.query(Invoice).filter_by(
        company_id=current_user["company_id"]
    )
    
    if status:
        query = query.filter_by(status=status)
    
    invoices = query.offset(offset).limit(limit).all()
    
    result = []
    for invoice in invoices:
        items = db.query(InvoiceItem).filter_by(invoice_id=invoice.id).all()
        
        result.append({
            "id": invoice.id,
            "number": invoice.number,
            "client_name": invoice.client_name,
            "client_rnc": invoice.client_rnc,
            "subtotal": float(invoice.subtotal),
            "tax_amount": float(invoice.tax_amount),
            "total": float(invoice.total),
            "status": invoice.status,
            "created_at": invoice.created_at.isoformat(),
            "ncf": invoice.ncf,
            "items": [
                {
                    "id": item.id,
                    "description": item.description,
                    "quantity": float(item.quantity),
                    "unit_price": float(item.unit_price),
                    "tax_rate": float(item.tax_rate),
                    "total": float(item.total)
                }
                for item in items
            ]
        })
    
    return result

@router.post("/invoices/with-items")
async def create_invoice_with_items(
    invoice_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear factura con múltiples items"""
    # Verificar límites del plan
    if not await check_invoice_limit(current_user["company_id"], db):
        raise HTTPException(
            status_code=403,
            detail="Límite de facturas alcanzado para su plan"
        )
    
    # Calcular totales
    items_data = invoice_data.pop("items", [])
    subtotal = sum(item["quantity"] * item["unit_price"] for item in items_data)
    tax_amount = sum(
        item["quantity"] * item["unit_price"] * item.get("tax_rate", 0) / 100
        for item in items_data
    )
    total = subtotal + tax_amount
    
    # Crear factura
    invoice = Invoice(
        company_id=current_user["company_id"],
        number=await generate_invoice_number(current_user["company_id"], db),
        subtotal=subtotal,
        tax_amount=tax_amount,
        total=total,
        **invoice_data
    )
    
    db.add(invoice)
    db.flush()  # Para obtener el ID
    
    # Crear items
    for item_data in items_data:
        item = InvoiceItem(
            invoice_id=invoice.id,
            total=item_data["quantity"] * item_data["unit_price"],
            **item_data
        )
        db.add(item)
    
    db.commit()
    db.refresh(invoice)
    
    # Log de uso
    await log_usage(current_user["company_id"], "invoice_created", db)
    
    return {"id": invoice.id, "number": invoice.number}

# ================================
# ANALYTICS ENDPOINTS  
# ================================

@router.get("/dashboard")
async def get_dashboard_data(
    period: str = Query("month"),  # month, quarter, year
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener datos del dashboard"""
    company_id = current_user["company_id"]
    
    # Calcular período
    end_date = datetime.now()
    if period == "month":
        start_date = end_date - timedelta(days=30)
    elif period == "quarter":
        start_date = end_date - timedelta(days=90)
    else:  # year
        start_date = end_date - timedelta(days=365)
    
    # Métricas de facturas
    invoices_query = db.query(Invoice).filter(
        Invoice.company_id == company_id,
        Invoice.created_at >= start_date
    )
    
    total_invoices = invoices_query.count()
    total_amount = sum(inv.total for inv in invoices_query.all())
    paid_invoices = invoices_query.filter_by(status="paid").count()
    
    # Clientes únicos
    unique_clients = len(set(inv.client_rnc for inv in invoices_query.all()))
    
    # Productos más vendidos
    top_products = db.execute("""
        SELECT ii.description, SUM(ii.quantity) as total_quantity
        FROM invoice_items ii
        JOIN invoices i ON ii.invoice_id = i.id
        WHERE i.company_id = :company_id 
        AND i.created_at >= :start_date
        GROUP BY ii.description
        ORDER BY total_quantity DESC
        LIMIT 5
    """, {"company_id": company_id, "start_date": start_date}).fetchall()
    
    # Límites del plan
    settings = db.query(CompanySettings).filter_by(company_id=company_id).first()
    plan_limits = settings.limits if settings else {}
    
    # Uso mensual actual
    current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_invoices = db.query(Invoice).filter(
        Invoice.company_id == company_id,
        Invoice.created_at >= current_month_start
    ).count()
    
    return {
        "period": period,
        "summary": {
            "total_invoices": total_invoices,
            "total_amount": total_amount,
            "paid_invoices": paid_invoices,
            "payment_rate": (paid_invoices / total_invoices * 100) if total_invoices > 0 else 0,
            "unique_clients": unique_clients
        },
        "top_products": [
            {"name": row[0], "quantity": row[1]} for row in top_products
        ],
        "plan_usage": {
            "current_plan": settings.plan if settings else "starter",
            "monthly_invoices": monthly_invoices,
            "invoice_limit": plan_limits.get("invoices", 50),
            "usage_percentage": (monthly_invoices / plan_limits.get("invoices", 50) * 100) if plan_limits.get("invoices", 50) > 0 else 0
        }
    }

@router.get("/reports/sales")
async def get_sales_report(
    start_date: str,
    end_date: str,
    group_by: str = Query("day"),  # day, week, month
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reporte de ventas agrupado por período"""
    company_id = current_user["company_id"]
    
    # Parse dates
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)
    
    # Group by mapping
    group_format = {
        "day": "%Y-%m-%d",
        "week": "%Y-W%W", 
        "month": "%Y-%m"
    }
    
    results = db.execute(f"""
        SELECT 
            strftime('{group_format[group_by]}', created_at) as period,
            COUNT(*) as invoice_count,
            SUM(total) as total_amount,
            SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) as paid_amount
        FROM invoices
        WHERE company_id = :company_id 
        AND created_at BETWEEN :start_date AND :end_date
        GROUP BY strftime('{group_format[group_by]}', created_at)
        ORDER BY period
    """, {
        "company_id": company_id,
        "start_date": start,
        "end_date": end
    }).fetchall()
    
    return {
        "period": group_by,
        "data": [
            {
                "period": row[0],
                "invoice_count": row[1],
                "total_amount": row[2],
                "paid_amount": row[3],
                "collection_rate": (row[3] / row[2] * 100) if row[2] > 0 else 0
            }
            for row in results
        ]
    }

# ================================
# HELPER FUNCTIONS
# ================================

async def check_invoice_limit(company_id: int, db: Session) -> bool:
    """Verificar si la empresa puede crear más facturas"""
    settings = db.query(CompanySettings).filter_by(company_id=company_id).first()
    if not settings:
        return True
    
    invoice_limit = settings.limits.get("invoices", -1)
    if invoice_limit == -1:  # Ilimitado
        return True
    
    # Contar facturas del mes actual
    current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_count = db.query(Invoice).filter(
        Invoice.company_id == company_id,
        Invoice.created_at >= current_month_start
    ).count()
    
    return monthly_count < invoice_limit

async def check_product_limit(company_id: int, db: Session) -> bool:
    """Verificar si la empresa puede crear más productos"""
    settings = db.query(CompanySettings).filter_by(company_id=company_id).first()
    if not settings:
        return True
    
    product_limit = settings.limits.get("products", -1)
    if product_limit == -1:  # Ilimitado
        return True
    
    current_count = db.query(ProductService).filter(
        ProductService.company_id == company_id,
        ProductService.is_active == True
    ).count()
    
    return current_count < product_limit

async def generate_invoice_number(company_id: int, db: Session) -> str:
    """Generar número de factura automáticamente"""
    # Buscar el último número de factura de la empresa
    last_invoice = db.query(Invoice).filter_by(company_id=company_id).order_by(Invoice.id.desc()).first()
    
    if last_invoice and last_invoice.number:
        # Extraer número de la última factura (formato: FACT-000001)
        try:
            last_num = int(last_invoice.number.split("-")[1])
            next_num = last_num + 1
        except:
            next_num = 1
    else:
        next_num = 1
    
    return f"FACT-{next_num:06d}"

async def log_usage(company_id: int, action: str, db: Session):
    """Registrar uso para analytics"""
    usage = UsageLog(
        company_id=company_id,
        action=action,
        timestamp=datetime.utcnow()
    )
    db.add(usage)
    db.commit()