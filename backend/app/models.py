from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    clients = relationship("Client", back_populates="user")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    rnc = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="clients")

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    description = Column(String)
    amount = Column(Numeric(scale=2))
    status = Column(String, default="draft")
    alanube_id = Column(String, nullable=True)  # ID de factura en Alanube
    
    # Relación con items (se crea después de importar models_extensions)
    items = relationship("InvoiceItem", back_populates="invoice")
