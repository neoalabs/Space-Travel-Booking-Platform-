# schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Base schemas (shared attributes)
class DestinationBase(BaseModel):
    name: str
    description: str
    type: str
    travel_time: str
    base_price: int
    image_url: str
    next_launch: str

class SeatClassBase(BaseModel):
    name: str
    description: str
    price: int
    features: List[str]

class AccommodationBase(BaseModel):
    name: str
    description: str
    price_per_night: int
    features: List[str]
    rating: float

class BookingBase(BaseModel):
    destination_id: int
    seat_class_id: int
    accommodation_id: int
    departure_date: datetime
    return_date: datetime
    passengers: int

class UserBase(BaseModel):
    username: str
    email: str
    full_name: str

# Create schemas (for creating new entities)
class DestinationCreate(DestinationBase):
    pass

class SeatClassCreate(SeatClassBase):
    destination_id: int

class AccommodationCreate(AccommodationBase):
    destination_id: int

class BookingCreate(BookingBase):
    user_id: int

class UserCreate(UserBase):
    password: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

# Response schemas (for API responses)
class Destination(DestinationBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True  # Changed from orm_mode = True

class SeatClass(SeatClassBase):
    id: int
    destination_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True  # Changed from orm_mode = True

class Accommodation(AccommodationBase):
    id: int
    destination_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True  # Changed from orm_mode = True

class Booking(BookingBase):
    id: int
    user_id: int
    total_price: int
    status: str
    booking_date: datetime
    
    class Config:
        from_attributes = True  # Changed from orm_mode = True

class User(UserBase):
    id: int
    bio: Optional[str]
    traveler_level: int
    total_miles: int
    completed_trips: int
    destinations: int
    avatar_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True  # Changed from orm_mode = True

# Extended schemas for more detailed responses
class BookingWithDetails(BaseModel):
    id: int
    user_id: int
    destination: Destination
    seat_class: SeatClass
    accommodation: Accommodation
    departure_date: datetime
    return_date: datetime
    passengers: int
    total_price: int
    status: str
    booking_date: datetime
    
    class Config:
        from_attributes = True  # Changed from orm_mode = True