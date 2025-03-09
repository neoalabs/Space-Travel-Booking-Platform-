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

# models.py
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, JSON, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import json

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    bio = Column(Text, nullable=True)
    traveler_level = Column(Integer, default=1)
    total_miles = Column(Integer, default=0)
    completed_trips = Column(Integer, default=0)
    destinations = Column(Integer, default=0)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    bookings = relationship("Booking", back_populates="user")

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    type = Column(String)  # Space Station, Planetary Base, etc.
    travel_time = Column(String)  # e.g., "3 days", "8 months"
    base_price = Column(Integer)  # Price in USD
    image_url = Column(String)
    next_launch = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    seat_classes = relationship("SeatClass", back_populates="destination")
    accommodations = relationship("Accommodation", back_populates="destination")
    bookings = relationship("Booking", back_populates="destination")

class SeatClass(Base):
    __tablename__ = "seat_classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)  # Economy, Luxury Cabin, VIP Zero-G Suite
    description = Column(Text)
    price = Column(Integer)  # Price in USD
    _features = Column(Text)  # Stored as JSON string
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    destination = relationship("Destination", back_populates="seat_classes")
    bookings = relationship("Booking", back_populates="seat_class")
    
    @property
    def features(self):
        return json.loads(self._features) if self._features else []
    
    @features.setter
    def features(self, value):
        self._features = json.dumps(value)

class Accommodation(Base):
    __tablename__ = "accommodations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    price_per_night = Column(Integer)  # Price in USD
    _features = Column(Text)  # Stored as JSON string
    rating = Column(Float, default=0.0)
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    destination = relationship("Destination", back_populates="accommodations")
    bookings = relationship("Booking", back_populates="accommodation")
    
    @property
    def features(self):
        return json.loads(self._features) if self._features else []
    
    @features.setter
    def features(self, value):
        self._features = json.dumps(value)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    seat_class_id = Column(Integer, ForeignKey("seat_classes.id"))
    accommodation_id = Column(Integer, ForeignKey("accommodations.id"))
    departure_date = Column(DateTime)
    return_date = Column(DateTime)
    passengers = Column(Integer, default=1)
    total_price = Column(Integer)  # Total price in USD
    status = Column(String)  # Confirmed, Pending, Cancelled
    booking_date = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="bookings")
    destination = relationship("Destination", back_populates="bookings")
    seat_class = relationship("SeatClass", back_populates="bookings")
    accommodation = relationship("Accommodation", back_populates="bookings")