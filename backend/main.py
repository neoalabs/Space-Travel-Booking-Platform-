# main.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import inspect
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import random

# Database imports
from database import engine, SessionLocal
import models
import schemas

# Create database tables - Add check to avoid recreating tables
def create_tables():
    # Create tables only if they don't exist
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    if "users" not in existing_tables:
        models.Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    else:
        print("Tables already exist, skipping creation.")

# Create tables with safety check
create_tables()

app = FastAPI(title="Space Travel Booking API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Generate some dummy data for testing
def initialize_dummy_data(db: Session):
    # Check if data exists
    if db.query(models.Destination).count() == 0:
        # Create destinations
        destinations = [
            models.Destination(
                name="Lunar Gateway Station",
                description="Experience the moon's orbit in this state-of-the-art space station with breathtaking views of Earth and lunar landscapes.",
                type="Space Station",
                travel_time="3 days",
                base_price=1200000,
                image_url="/images/lunar-gateway.jpg",
                next_launch="March 15, 2025"
            ),
            models.Destination(
                name="Mars Base Alpha",
                description="Be among the first civilians to visit the red planet. Tour the first human settlement on Mars and experience 0.38g gravity.",
                type="Planetary Base",
                travel_time="8 months",
                base_price=4500000,
                image_url="/images/mars-base.jpg",
                next_launch="July 22, 2025"
            ),
            models.Destination(
                name="Europa Orbit Research Station",
                description="Journey to Jupiter's moon and participate in research on extraterrestrial life in Europa's subsurface ocean.",
                type="Research Station",
                travel_time="2.5 years",
                base_price=12000000,
                image_url="/images/europa-station.jpg",
                next_launch="December 10, 2025"
            ),
            models.Destination(
                name="Orbital Hotel Artemis",
                description="Luxury accommodations in Earth's orbit. Experience zero gravity living with five-star amenities.",
                type="Space Hotel",
                travel_time="1 day",
                base_price=850000,
                image_url="/images/orbital-hotel.jpg",
                next_launch="April 5, 2025"
            ),
            models.Destination(
                name="Venus Cloud Observatory",
                description="Float above Venus's atmosphere and study the greenhouse effect from our specialized research platform.",
                type="Atmospheric Observatory",
                travel_time="5 months",
                base_price=3200000,
                image_url="/images/venus-observatory.jpg",
                next_launch="September 18, 2025"
            ),
        ]
        db.add_all(destinations)
        db.commit()
        
        # Create seat classes for each destination
        seat_classes = []
        for dest in destinations:
            seat_classes.extend([
                models.SeatClass(
                    name="Economy",
                    description="Standard accommodations with essential life support and minimal personal space.",
                    price=dest.base_price,
                    features=["Basic life support", "Shared quarters", "Standard meals", "Limited storage"],
                    destination_id=dest.id
                ),
                models.SeatClass(
                    name="Luxury Cabin",
                    description="Premium accommodations with enhanced comfort and private quarters.",
                    price=int(dest.base_price * 1.75),
                    features=["Enhanced life support", "Private cabin", "Gourmet meals", "Increased storage", "Entertainment system"],
                    destination_id=dest.id
                ),
                models.SeatClass(
                    name="VIP Zero-G Suite",
                    description="The ultimate space travel experience with dedicated staff and exclusive access to all facilities.",
                    price=int(dest.base_price * 3.5),
                    features=["Premium life support", "Luxury suite", "Personal chef", "Exclusive excursions", "Full medical support", "Priority scheduling"],
                    destination_id=dest.id
                ),
            ])
        db.add_all(seat_classes)
        db.commit()
        
        # Create accommodations for each destination
        accommodations = []
        for dest in destinations:
            accommodations.extend([
                models.Accommodation(
                    name=f"Standard Pod at {dest.name}",
                    description="Basic accommodation with essential amenities and shared facilities.",
                    price_per_night=int(dest.base_price * 0.01),
                    features=["Shared bathroom", "Basic amenities", "Daily cleaning", "Communal dining"],
                    rating=3.5,
                    destination_id=dest.id
                ),
                models.Accommodation(
                    name=f"Comfort Suite at {dest.name}",
                    description="Mid-tier accommodations with private facilities and enhanced comfort.",
                    price_per_night=int(dest.base_price * 0.025),
                    features=["Private bathroom", "Enhanced amenities", "Room service", "Entertainment system", "Small viewport"],
                    rating=4.2,
                    destination_id=dest.id
                ),
                models.Accommodation(
                    name=f"Luxury Habitat at {dest.name}",
                    description="Premium living space with all amenities and spectacular views.",
                    price_per_night=int(dest.base_price * 0.05),
                    features=["Luxury bathroom", "Premium amenities", "24/7 butler service", "Gourmet dining", "Large viewport", "Private excursions"],
                    rating=4.8,
                    destination_id=dest.id
                ),
            ])
        db.add_all(accommodations)
        db.commit()
        
        # Create a few users
        users = [
            models.User(
                username="astro_explorer",
                email="alex@example.com",
                hashed_password="dummy_hash_1",
                full_name="Alex Astronaut",
                bio="Space enthusiast and adventure seeker",
                traveler_level=3,
                total_miles=15000000,
                completed_trips=2,
                destinations=2,
                avatar_url="/avatars/user1.jpg"
            ),
            models.User(
                username="cosmic_voyager",
                email="sam@example.com",
                hashed_password="dummy_hash_2",
                full_name="Sam Spacefarer",
                bio="Professional astronomer turned space tourist",
                traveler_level=4,
                total_miles=28000000,
                completed_trips=3,
                destinations=3,
                avatar_url="/avatars/user2.jpg"
            ),
        ]
        db.add_all(users)
        db.commit()
        
        # Create some bookings
        bookings = [
            models.Booking(
                user_id=1,
                destination_id=1,
                seat_class_id=2,
                accommodation_id=2,
                departure_date=datetime.now() + timedelta(days=45),
                return_date=datetime.now() + timedelta(days=60),
                passengers=2,
                total_price=2500000,
                status="Confirmed",
                booking_date=datetime.now() - timedelta(days=10)
            ),
            models.Booking(
                user_id=1,
                destination_id=4,
                seat_class_id=10,
                accommodation_id=11,
                departure_date=datetime.now() + timedelta(days=120),
                return_date=datetime.now() + timedelta(days=127),
                passengers=1,
                total_price=3200000,
                status="Pending",
                booking_date=datetime.now() - timedelta(days=3)
            ),
            models.Booking(
                user_id=2,
                destination_id=2,
                seat_class_id=5,
                accommodation_id=5,
                departure_date=datetime.now() + timedelta(days=90),
                return_date=datetime.now() + timedelta(days=330),
                passengers=2,
                total_price=9500000,
                status="Confirmed",
                booking_date=datetime.now() - timedelta(days=20)
            ),
        ]
        db.add_all(bookings)
        db.commit()

# Routes
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    initialize_dummy_data(db)
    db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to Dubai Space Travel Booking API"}

# Destinations
@app.get("/destinations", response_model=List[schemas.Destination])
async def get_destinations(db: Session = Depends(get_db)):
    destinations = db.query(models.Destination).all()
    return destinations

@app.get("/destinations/{destination_id}", response_model=schemas.Destination)
async def get_destination(destination_id: int, db: Session = Depends(get_db)):
    destination = db.query(models.Destination).filter(models.Destination.id == destination_id).first()
    if destination is None:
        raise HTTPException(status_code=404, detail="Destination not found")
    return destination

# Seat Classes
@app.get("/destinations/{destination_id}/seat-classes", response_model=List[schemas.SeatClass])
async def get_seat_classes(destination_id: int, db: Session = Depends(get_db)):
    seat_classes = db.query(models.SeatClass).filter(models.SeatClass.destination_id == destination_id).all()
    return seat_classes

# Accommodations
@app.get("/destinations/{destination_id}/accommodations", response_model=List[schemas.Accommodation])
async def get_accommodations(destination_id: int, db: Session = Depends(get_db)):
    accommodations = db.query(models.Accommodation).filter(models.Accommodation.destination_id == destination_id).all()
    return accommodations

# Bookings
@app.post("/bookings", response_model=schemas.Booking)
async def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    # In a real app, we would verify the user, check availability, process payment, etc.
    # For this prototype, we'll just create the booking
    
    # Get the destination, seat class, and accommodation to calculate the price
    destination = db.query(models.Destination).filter(models.Destination.id == booking.destination_id).first()
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    seat_class = db.query(models.SeatClass).filter(models.SeatClass.id == booking.seat_class_id).first()
    if not seat_class:
        raise HTTPException(status_code=404, detail="Seat class not found")
    
    accommodation = db.query(models.Accommodation).filter(models.Accommodation.id == booking.accommodation_id).first()
    if not accommodation:
        raise HTTPException(status_code=404, detail="Accommodation not found")
    
    # Calculate the price
    seat_price = seat_class.price * booking.passengers
    
    # Calculate the number of nights
    departure_date = booking.departure_date
    return_date = booking.return_date
    nights = (return_date - departure_date).days
    
    accommodation_price = accommodation.price_per_night * nights
    total_price = seat_price + accommodation_price
    
    # Create the booking
    db_booking = models.Booking(
        user_id=booking.user_id,
        destination_id=booking.destination_id,
        seat_class_id=booking.seat_class_id,
        accommodation_id=booking.accommodation_id,
        departure_date=booking.departure_date,
        return_date=booking.return_date,
        passengers=booking.passengers,
        total_price=total_price,
        status="Confirmed",
        booking_date=datetime.now()
    )
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.get("/users/{user_id}/bookings", response_model=List[schemas.BookingWithDetails])
async def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all bookings for the user
    bookings = db.query(models.Booking).filter(models.Booking.user_id == user_id).all()
    
    # Prepare the response with detailed information
    result = []
    for booking in bookings:
        destination = db.query(models.Destination).filter(models.Destination.id == booking.destination_id).first()
        seat_class = db.query(models.SeatClass).filter(models.SeatClass.id == booking.seat_class_id).first()
        accommodation = db.query(models.Accommodation).filter(models.Accommodation.id == booking.accommodation_id).first()
        
        booking_with_details = schemas.BookingWithDetails(
            id=booking.id,
            user_id=booking.user_id,
            destination=schemas.Destination.model_validate(destination),  # Changed from from_orm
            seat_class=schemas.SeatClass.model_validate(seat_class),      # Changed from from_orm
            accommodation=schemas.Accommodation.model_validate(accommodation),  # Changed from from_orm
            departure_date=booking.departure_date,
            return_date=booking.return_date,
            passengers=booking.passengers,
            total_price=booking.total_price,
            status=booking.status,
            booking_date=booking.booking_date
        )
        result.append(booking_with_details)
    
    return result

# User Profile
@app.get("/users/{user_id}", response_model=schemas.User)
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# AI Space Travel Tips
@app.get("/space-travel-tips", response_model=List[str])
async def get_space_travel_tips():
    tips = [
        "Stay hydrated! In space, your body doesn't signal thirst as effectively.",
        "Practice your space photography skills - the Earth looks stunning from orbit!",
        "Pack light, comfortable clothing. Remember that in zero-G, comfort is key.",
        "Prepare for space adaptation syndrome by practicing balance exercises before your trip.",
        "Bring a small memento to experience weightlessness with - it makes for a great memory.",
        "Don't forget to use sunscreen on space walks - solar radiation is much stronger without atmospheric protection.",
        "Join pre-flight orientation sessions to make the most of your space experience.",
        "Keep a space journal - you'll want to remember every detail of this once-in-a-lifetime experience."
    ]
    
    # Return 4-6 random tips
    num_tips = random.randint(4, 6)
    return random.sample(tips, num_tips)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)