

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