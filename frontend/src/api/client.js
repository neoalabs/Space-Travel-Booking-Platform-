// src/api/client.js
import axios from 'axios';

// Base API configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// src/api/bookingApi.js
import apiClient from './client';

// Fetch available destinations
export const fetchAvailableDestinations = async () => {
  try {
    const response = await apiClient.get('/destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    // For prototype, return dummy data in case backend is not running
    return [
      {
        id: 1,
        name: "Lunar Gateway Station",
        description: "Experience the moon's orbit in this state-of-the-art space station with breathtaking views of Earth and lunar landscapes.",
        type: "Space Station",
        travelTime: "3 days",
        basePrice: 1200000,
        imageUrl: "/images/lunar-gateway.jpg",
        nextLaunch: "March 15, 2025"
      },
      {
        id: 2,
        name: "Mars Base Alpha",
        description: "Be among the first civilians to visit the red planet. Tour the first human settlement on Mars and experience 0.38g gravity.",
        type: "Planetary Base",
        travelTime: "8 months",
        basePrice: 4500000,
        imageUrl: "/images/mars-base.jpg",
        nextLaunch: "July 22, 2025"
      },
      {
        id: 4,
        name: "Orbital Hotel Artemis",
        description: "Luxury accommodations in Earth's orbit. Experience zero gravity living with five-star amenities.",
        type: "Space Hotel",
        travelTime: "1 day",
        basePrice: 850000,
        imageUrl: "/images/orbital-hotel.jpg",
        nextLaunch: "April 5, 2025"
      },
    ];
  }
};

// Fetch seat classes for a destination
export const fetchSeatClasses = async (destinationId) => {
  try {
    const response = await apiClient.get(`/destinations/${destinationId}/seat-classes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching seat classes:', error);
    // For prototype, return dummy data
    return [
      {
        id: 1,
        name: "Economy",
        description: "Standard accommodations with essential life support and minimal personal space.",
        price: destinationId === 1 ? 1200000 : (destinationId === 2 ? 4500000 : 850000),
        features: ["Basic life support", "Shared quarters", "Standard meals", "Limited storage"],
      },
      {
        id: 2,
        name: "Luxury Cabin",
        description: "Premium accommodations with enhanced comfort and private quarters.",
        price: destinationId === 1 ? 2100000 : (destinationId === 2 ? 7875000 : 1487500),
        features: ["Enhanced life support", "Private cabin", "Gourmet meals", "Increased storage", "Entertainment system"],
      },
      {
        id: 3,
        name: "VIP Zero-G Suite",
        description: "The ultimate space travel experience with dedicated staff and exclusive access to all facilities.",
        price: destinationId === 1 ? 4200000 : (destinationId === 2 ? 15750000 : 2975000),
        features: ["Premium life support", "Luxury suite", "Personal chef", "Exclusive excursions", "Full medical support", "Priority scheduling"],
      },
    ];
  }
};

// Fetch accommodations for a destination
export const fetchAccommodations = async (destinationId) => {
  try {
    const response = await apiClient.get(`/destinations/${destinationId}/accommodations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    // For prototype, return dummy data
    const basePrice = destinationId === 1 ? 1200000 : (destinationId === 2 ? 4500000 : 850000);
    const destinationName = destinationId === 1 ? "Lunar Gateway" : (destinationId === 2 ? "Mars Base Alpha" : "Orbital Hotel Artemis");
    
    return [
      {
        id: 1,
        name: `Standard Pod at ${destinationName}`,
        description: "Basic accommodation with essential amenities and shared facilities.",
        pricePerNight: Math.round(basePrice * 0.01),
        features: ["Shared bathroom", "Basic amenities", "Daily cleaning", "Communal dining"],
        rating: 3.5,
      },
      {
        id: 2,
        name: `Comfort Suite at ${destinationName}`,
        description: "Mid-tier accommodations with private facilities and enhanced comfort.",
        pricePerNight: Math.round(basePrice * 0.025),
        features: ["Private bathroom", "Enhanced amenities", "Room service", "Entertainment system", "Small viewport"],
        rating: 4.2,
      },
      {
        id: 3,
        name: `Luxury Habitat at ${destinationName}`,
        description: "Premium living space with all amenities and spectacular views.",
        pricePerNight: Math.round(basePrice * 0.05),
        features: ["Luxury bathroom", "Premium amenities", "24/7 butler service", "Gourmet dining", "Large viewport", "Private excursions"],
        rating: 4.8,
      },
    ];
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    // Convert frontend model to backend model
    const backendBooking = {
      user_id: 1, // Hardcoded for prototype, would be from auth in real app
      destination_id: bookingData.destination.id,
      seat_class_id: bookingData.seatClass.id,
      accommodation_id: bookingData.accommodation.id,
      departure_date: bookingData.departureDate,
      return_date: bookingData.returnDate,
      passengers: bookingData.passengers,
    };
    
    const response = await apiClient.post('/bookings', backendBooking);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    // For prototype, return success without making actual API call
    return {
      id: Math.floor(Math.random() * 1000) + 100,
      ...bookingData,
      status: 'Confirmed',
      booking_date: new Date().toISOString(),
    };
  }
};

// src/api/userApi.js
import apiClient from './client';

// Fetch user bookings
export const fetchUserBookings = async (userId = 1) => {
  try {
    const response = await apiClient.get(`/users/${userId}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    // For prototype, return dummy data
    return [
      {
        id: 101,
        user_id: 1,
        destination: {
          id: 1,
          name: "Lunar Gateway Station",
          description: "Experience the moon's orbit in this state-of-the-art space station with breathtaking views of Earth and lunar landscapes.",
          type: "Space Station",
          travelTime: "3 days",
          basePrice: 1200000,
          imageUrl: "/images/lunar-gateway.jpg",
          nextLaunch: "March 15, 2025"
        },
        seat_class: {
          id: 2,
          name: "Luxury Cabin",
          description: "Premium accommodations with enhanced comfort and private quarters.",
          price: 2100000,
          features: ["Enhanced life support", "Private cabin", "Gourmet meals", "Increased storage", "Entertainment system"],
        },
        accommodation: {
          id: 2,
          name: "Comfort Suite at Lunar Gateway",
          description: "Mid-tier accommodations with private facilities and enhanced comfort.",
          pricePerNight: 30000,
          features: ["Private bathroom", "Enhanced amenities", "Room service", "Entertainment system", "Small viewport"],
          rating: 4.2,
        },
        departure_date: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        return_date: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        passengers: 2,
        total_price: 2500000,
        status: "Confirmed",
        booking_date: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 102,
        user_id: 1,
        destination: {
          id: 4,
          name: "Orbital Hotel Artemis",
          description: "Luxury accommodations in Earth's orbit. Experience zero gravity living with five-star amenities.",
          type: "Space Hotel",
          travelTime: "1 day",
          basePrice: 850000,
          imageUrl: "/images/orbital-hotel.jpg",
          nextLaunch: "April 5, 2025"
        },
        seat_class: {
          id: 10,
          name: "VIP Zero-G Suite",
          description: "The ultimate space travel experience with dedicated staff and exclusive access to all facilities.",
          price: 2975000,
          features: ["Premium life support", "Luxury suite", "Personal chef", "Exclusive excursions", "Full medical support", "Priority scheduling"],
        },
        accommodation: {
          id: 11,
          name: "Luxury Habitat at Orbital Hotel Artemis",
          description: "Premium living space with all amenities and spectacular views.",
          pricePerNight: 42500,
          features: ["Luxury bathroom", "Premium amenities", "24/7 butler service", "Gourmet dining", "Large viewport", "Private excursions"],
          rating: 4.8,
        },
        departure_date: new Date(new Date().getTime() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        return_date: new Date(new Date().getTime() + 127 * 24 * 60 * 60 * 1000).toISOString(),
        passengers: 1,
        total_price: 3200000,
        status: "Pending",
        booking_date: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
};

// Fetch user profile
export const fetchUserProfile = async (userId = 1) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // For prototype, return dummy data
    return {
      id: 1,
      username: "astro_explorer",
      email: "alex@example.com",
      full_name: "Alex Astronaut",
      bio: "Space enthusiast and adventure seeker",
      travelerLevel: 3,
      totalMiles: 15000000,
      completedTrips: 2,
      destinations: 2,
      avatarUrl: "/avatars/user1.jpg"
    };
  }
};

// Fetch AI space travel tips
export const fetchSpaceTravelTips = async () => {
  try {
    const response = await apiClient.get('/space-travel-tips');
    return response.data;
  } catch (error) {
    console.error('Error fetching space travel tips:', error);
    // For prototype, return dummy data
    return [
      "Stay hydrated! In space, your body doesn't signal thirst as effectively.",
      "Practice your space photography skills - the Earth looks stunning from orbit!",
      "Pack light, comfortable clothing. Remember that in zero-G, comfort is key.",
      "Prepare for space adaptation syndrome by practicing balance exercises before your trip.",
      "Bring a small memento to experience weightlessness with - it makes for a great memory."
    ];
  }
};