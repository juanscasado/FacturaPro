from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Configuración de base de datos para producción y desarrollo
DATABASE_URL = os.getenv("DATABASE_URL")

# Si estamos en Railway/Heroku, la URL viene como postgres:// pero SQLAlchemy necesita postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if DATABASE_URL:
    # Producción - PostgreSQL
    print("🐘 Usando PostgreSQL en producción")
    engine = create_engine(DATABASE_URL)
else:
    # Desarrollo - SQLite
    print("🗃️ Usando SQLite en desarrollo")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./invoices.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
