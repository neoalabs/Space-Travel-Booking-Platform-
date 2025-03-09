# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite for development, use PostgreSQL for production
SQLALCHEMY_DATABASE_URL = "sqlite:///./space_travel.db"
# For PostgreSQL:
# SQLALCHEMY_DATABASE_URL = "postgresql://username:password@localhost/space_travel"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()