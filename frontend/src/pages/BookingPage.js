// src/pages/BookingPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Stepper, Step, StepLabel, StepConnector,
  Card, Grid, Button, Paper, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import TripSelectionStep from '../components/booking/TripSelectionStep';
import SeatClassStep from '../components/booking/SeatClassStep';
import AccommodationStep from '../components/booking/AccommodationStep';
import CheckoutStep from '../components/booking/CheckoutStep';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { motion, AnimatePresence } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import HotelIcon from '@mui/icons-material/Hotel';
import FactCheckIcon from '@mui/icons-material/FactCheck';

// API client for booking
import { fetchAvailableDestinations, fetchSeatClasses, fetchAccommodations, createBooking } from '../api/bookingApi';

// Custom Stepper Components
const SpaceStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    height: 3,
    border: 0,
    backgroundColor: 'rgba(140, 158, 255, 0.1)',
    borderRadius: 1,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
  },
}));

const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  height: 40,
  width: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  background: ownerState.active || ownerState.completed 
    ? `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : 'rgba(140, 158, 255, 0.1)',
  zIndex: 1,
  boxShadow: ownerState.active
    ? `0 0 15px ${theme.palette.primary.main}`
    : 'none',
  color: ownerState.active || ownerState.completed ? 'white' : theme.palette.text.secondary,
  transition: 'all 0.3s ease',
}));

// Define the step icons
const stepIcons = {
  1: <RocketLaunchIcon />,
  2: <AirplaneTicketIcon />,
  3: <HotelIcon />,
  4: <FactCheckIcon />,
};

const SpaceStepIcon = (props) => {
  const { active, completed, icon } = props;

  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {stepIcons[String(icon)]}
    </StepIconRoot>
  );
};

// Step names
const steps = ['Select Destination', 'Choose Seat Class', 'Select Accommodation', 'Review & Checkout'];

const BookingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animationDirection, setAnimationDirection] = useState('forward');
  const [stars, setStars] = useState([]);
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
  
  // Generate stars for background
  useEffect(() => {
    const generatedStars = Array.from({ length: 70 }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, []);
  
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
  
  // Handle next step with animation
  const handleNext = () => {
    setAnimationDirection('forward');
    setTimeout(() => {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }, 300);
  };
  
  // Handle back step with animation
  const handleBack = () => {
    setAnimationDirection('backward');
    setTimeout(() => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }, 300);
  };
  
  // Handle booking submission
  const handleSubmitBooking = async () => {
    try {
      setLoading(true);
      await createBooking(bookingData);
      setAnimationDirection('forward');
      setTimeout(() => {
        setActiveStep(steps.length); // Move to confirmation step
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error creating booking:', error);
      setLoading(false);
    }
  };
  
  // Animation variants
  const pageVariants = {
    initial: direction => ({
      x: direction === 'forward' ? 100 : -100,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: direction => ({
      x: direction === 'forward' ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    })
  };
  
  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0B0D1B 0%, #161B33 100%)',
      pt: 8,
      pb: 12
    }}>
      {/* Stars background */}
      {stars.map(star => (
        <Box
          key={star.id}
          sx={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            backgroundColor: 'white',
            opacity: star.opacity,
            animation: `twinkle 4s infinite alternate ${star.animationDelay}`,
            '@keyframes twinkle': {
              '0%': { opacity: star.opacity },
              '100%': { opacity: star.opacity * 0.3 }
            },
            zIndex: 0
          }}
        />
      ))}
      
      <Container 
        maxWidth="lg" 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'white',
            background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Book Your Space Journey
        </Typography>
        
        <Typography 
          variant="h6" 
          align="center" 
          color="rgba(255, 255, 255, 0.7)" 
          paragraph
          sx={{ mb: 6 }}
        >
          Select your destination, choose your seat class, and prepare for an out-of-this-world adventure.
        </Typography>
        
        <Box sx={{ width: '100%', mt: 6 }}>
          {/* Custom animated stepper */}
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel 
            sx={{ mb: 5 }}
            connector={<SpaceStepConnector />}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={SpaceStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Progress indicator */}
          <Box sx={{ position: 'relative', mt: 4, mx: 'auto', width: '80%', mb: 6 }}>
            <Box sx={{ height: 5, bgcolor: 'rgba(140, 158, 255, 0.1)', borderRadius: 2 }} />
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: 5,
                background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                borderRadius: 2,
                boxShadow: '0 0 8px rgba(140, 158, 255, 0.7)',
              }}
            />
          </Box>
          
          {loading && activeStep < steps.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 8 }}>
              <CircularProgress 
                size={60} 
                sx={{ 
                  color: 'primary.main',
                  filter: 'drop-shadow(0 0 8px rgba(140, 158, 255, 0.7))'
                }} 
              />
              <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                Loading your space journey options...
              </Typography>
            </Box>
          ) : activeStep === steps.length ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <BookingConfirmation bookingData={bookingData} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <Card 
              variant="outlined" 
              sx={{ 
                p: 4,
                background: 'rgba(22, 27, 51, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(140, 158, 255, 0.2)',
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Glowing corner accent */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 100,
                  height: 100,
                  background: 'radial-gradient(circle at top right, rgba(140, 158, 255, 0.2) 0%, rgba(140, 158, 255, 0) 70%)',
                  filter: 'blur(20px)',
                  zIndex: 0
                }}
              />
              
              {/* Content with animations between steps */}
              <Box sx={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeStep}
                    custom={animationDirection}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
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
                  </motion.div>
                </AnimatePresence>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 4,
                  pt: 4,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    px: 3,
                    borderRadius: 28,
                    '&:hover:not(:disabled)': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      background: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
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
                  sx={{ 
                    background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                    px: 4,
                    borderRadius: 28,
                    boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
                    '&:hover:not(:disabled)': {
                      boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
                    }
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
                </Button>
              </Box>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default BookingPage;