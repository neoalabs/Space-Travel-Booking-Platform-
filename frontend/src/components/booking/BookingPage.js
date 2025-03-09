// src/pages/BookingPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Stepper, Step, StepLabel, 
  Card, Grid, Button, Paper, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import TripSelectionStep from '../components/booking/TripSelectionStep';
import SeatClassStep from '../components/booking/SeatClassStep';
import AccommodationStep from '../components/booking/AccommodationStep';
import CheckoutStep from '../components/booking/CheckoutStep';
import BookingConfirmation from '../components/booking/BookingConfirmation';

// API client for booking
import { fetchAvailableDestinations, fetchSeatClasses, fetchAccommodations, createBooking } from '../api/bookingApi';

const steps = ['Select Destination', 'Choose Seat Class', 'Select Accommodation', 'Review & Checkout'];

const BookingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    departureDate: addDays(new Date(), 30), // Default to 30 days from now
    returnDate: addDays(new Date(), 60),    // Default to 60 days from now
    destination: null,
    seatClass: null,
    accommodation: null,
    passengers: 1,
    totalPrice: 0,
  });
  
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [availableSeatClasses, setAvailableSeatClasses] = useState([]);
  const [availableAccommodations, setAvailableAccommodations] = useState([]);
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const destinations = await fetchAvailableDestinations();
        setAvailableDestinations(destinations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Fetch seat classes when destination is selected
  useEffect(() => {
    const fetchSeatClassesData = async () => {
      if (bookingData.destination) {
        try {
          setLoading(true);
          const seatClasses = await fetchSeatClasses(bookingData.destination.id);
          setAvailableSeatClasses(seatClasses);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching seat classes:', error);
          setLoading(false);
        }
      }
    };
    
    fetchSeatClassesData();
  }, [bookingData.destination]);
  
  // Fetch accommodations when destination is selected
  useEffect(() => {
    const fetchAccommodationsData = async () => {
      if (bookingData.destination) {
        try {
          setLoading(true);
          const accommodations = await fetchAccommodations(bookingData.destination.id);
          setAvailableAccommodations(accommodations);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching accommodations:', error);
          setLoading(false);
        }
      }
    };
    
    fetchAccommodationsData();
  }, [bookingData.destination]);
  
  // Calculate total price
  useEffect(() => {
    if (bookingData.destination && bookingData.seatClass) {
      let totalPrice = bookingData.seatClass.price * bookingData.passengers;
      
      if (bookingData.accommodation) {
        // Calculate number of days
        const days = Math.ceil(
          (bookingData.returnDate - bookingData.departureDate) / (1000 * 60 * 60 * 24)
        );
        totalPrice += bookingData.accommodation.pricePerNight * days;
      }
      
      setBookingData(prev => ({ ...prev, totalPrice }));
    }
  }, [
    bookingData.destination, 
    bookingData.seatClass, 
    bookingData.accommodation, 
    bookingData.departureDate, 
    bookingData.returnDate,
    bookingData.passengers
  ]);
  
  // Handle booking data change
  const handleBookingDataChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle next step
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  
  // Handle booking submission
  const handleSubmitBooking = async () => {
    try {
      setLoading(true);
      await createBooking(bookingData);
      setActiveStep(steps.length); // Move to confirmation step
      setLoading(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Book Your Space Journey
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Select your destination, choose your seat class, and prepare for an out-of-this-world adventure.
      </Typography>
      
      <Box sx={{ width: '100%', mt: 6 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : activeStep === steps.length ? (
          <BookingConfirmation bookingData={bookingData} />
        ) : (
          <Card variant="outlined" sx={{ p: 3 }}>
            {activeStep === 0 && (
              <TripSelectionStep 
                bookingData={bookingData}
                availableDestinations={availableDestinations}
                onBookingDataChange={handleBookingDataChange}
              />
            )}
            
            {activeStep === 1 && (
              <SeatClassStep 
                bookingData={bookingData}
                availableSeatClasses={availableSeatClasses}
                onBookingDataChange={handleBookingDataChange}
              />
            )}
            
            {activeStep === 2 && (
              <AccommodationStep 
                bookingData={bookingData}
                availableAccommodations={availableAccommodations}
                onBookingDataChange={handleBookingDataChange}
              />
            )}
            
            {activeStep === 3 && (
              <CheckoutStep 
                bookingData={bookingData}
                onBookingDataChange={handleBookingDataChange}
              />
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmitBooking : handleNext}
                disabled={
                  (activeStep === 0 && !bookingData.destination) ||
                  (activeStep === 1 && !bookingData.seatClass) ||
                  (activeStep === 2 && !bookingData.accommodation)
                }
              >
                {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default BookingPage;