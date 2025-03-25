// src/pages/BookingPage.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, Card, Grid, Button, Paper, 
  CircularProgress, useTheme, alpha, useMediaQuery
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
import * as THREE from 'three';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import HotelIcon from '@mui/icons-material/Hotel';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';

// API client for booking
import { fetchAvailableDestinations, fetchSeatClasses, fetchAccommodations, createBooking } from '../api/bookingApi';

// Step names
const steps = ['Select Destination', 'Choose Seat Class', 'Select Accommodation', 'Review & Checkout'];

// Styled components
const GlowingCard = styled(Card)(({ theme }) => ({
  background: 'rgba(22, 27, 51, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(140, 158, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  fontWeight: 700,
}));

const StepperDot = styled(Box)(({ theme, active, completed }) => ({
  width: active || completed ? 15 : 12,
  height: active || completed ? 15 : 12,
  borderRadius: '50%',
  backgroundColor: active || completed ? theme.palette.primary.main : 'rgba(140, 158, 255, 0.2)',
  boxShadow: active ? '0 0 15px rgba(140, 158, 255, 0.8)' : 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 10,
}));

const StepperLine = styled(Box)(({ theme, active }) => ({
  height: 3,
  backgroundColor: active ? 'rgba(140, 158, 255, 1)' : 'rgba(140, 158, 255, 0.15)',
  flex: 1,
  position: 'relative',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active ? '0 0 8px rgba(140, 158, 255, 0.7)' : 'none',
}));

const GlowingButton = styled(Button)(({ theme, variant }) => {
  const isContained = variant === 'contained';
  return {
    borderRadius: 28,
    padding: theme.spacing(1.2, 3),
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    fontWeight: 600,
    letterSpacing: 0.5,
    fontSize: '0.95rem',
    
    ...(isContained && {
      background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
      boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
      '&:hover': {
        boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
        transform: 'translateY(-2px)',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
        transition: 'all 0.6s ease',
      },
      '&:hover::after': {
        left: '100%',
      }
    }),
    
    ...(!isContained && {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      color: 'white',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
        background: 'rgba(255, 255, 255, 0.05)',
      }
    })
  };
});

const BookingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs
  const threeJsContainerRef = useRef(null);
  
  // States
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
    const generatedStars = Array.from({ length: 100 }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }));
    setStars(generatedStars);
  }, []);
  
  // Initialize Three.js scene for immersive background
  useEffect(() => {
    if (!threeJsContainerRef.current) return;
    
    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Clean up existing canvas if any
    while (threeJsContainerRef.current.firstChild) {
      threeJsContainerRef.current.removeChild(threeJsContainerRef.current.firstChild);
    }
    
    threeJsContainerRef.current.appendChild(renderer.domElement);
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20 - 5;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Create a nebula effect using point clouds
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaMaterial = new THREE.PointsMaterial({
      color: 0x8c9eff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const nebulaVertices = [];
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (Math.random() - 0.5) * 3 - 8;
      nebulaVertices.push(x, y, z);
    }
    
    nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaVertices, 3));
    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
    
    // Create a second nebula with different color
    const nebula2Geometry = new THREE.BufferGeometry();
    const nebula2Material = new THREE.PointsMaterial({
      color: 0xff9e80,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const nebula2Vertices = [];
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 3;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (Math.random() - 0.5) * 3 - 10;
      nebula2Vertices.push(x, y, z);
    }
    
    nebula2Geometry.setAttribute('position', new THREE.Float32BufferAttribute(nebula2Vertices, 3));
    const nebula2 = new THREE.Points(nebula2Geometry, nebula2Material);
    scene.add(nebula2);
    
    // Handle mouse movement for interactive background
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      stars.rotation.y = mouseX * 0.1;
      stars.rotation.x = mouseY * 0.1;
      
      nebula.rotation.y = mouseX * 0.2;
      nebula.rotation.x = mouseY * 0.2;
      
      nebula2.rotation.y = -mouseX * 0.1;
      nebula2.rotation.x = -mouseY * 0.1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      stars.rotation.y += 0.0003;
      nebula.rotation.y += 0.0005;
      nebula2.rotation.y -= 0.0003;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
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
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: direction => ({
      x: direction === 'forward' ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    })
  };
  
  const glowVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  };
  
  const renderStepIcon = (index) => {
    const icons = {
      0: <RocketLaunchIcon />,
      1: <AirplaneTicketIcon />,
      2: <HotelIcon />,
      3: <FactCheckIcon />,
    };
    
    return icons[index];
  };
  
  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0B0D1B 0%, #161B33 100%)',
      pt: { xs: 10, md: 12 },
      pb: 12,
      overflow: 'hidden'
    }}>
      {/* Three.js Background */}
      <Box 
        ref={threeJsContainerRef}
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.8,
          '& canvas': {
            display: 'block',
          }
        }}
      />
      
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
            animation: `twinkle ${star.animationDuration} infinite alternate ${star.animationDelay}`,
            '@keyframes twinkle': {
              '0%': { opacity: star.opacity, boxShadow: '0 0 0 rgba(255, 255, 255, 0)' },
              '100%': { opacity: star.opacity * 0.3, boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)' }
            },
            zIndex: 0
          }}
        />
      ))}
      
      {/* Background planets */}
      <Box 
        component={motion.div}
        animate={{ 
          y: [0, -15, 0],
          rotate: 360,
        }}
        transition={{
          y: { 
            duration: 12, 
            repeat: Infinity,
            repeatType: 'loop'
          },
          rotate: {
            duration: 180,
            repeat: Infinity,
            ease: 'linear'
          }
        }}
        sx={{
          position: 'absolute',
          right: { xs: -40, md: '5%' },
          top: { xs: '20%', md: '15%' },
          width: { xs: 80, md: 150 },
          height: { xs: 80, md: 150 },
          borderRadius: '50%',
          background: 'radial-gradient(circle at 70% 30%, #aa7700 0%, #995500 60%, #774400 100%)',
          filter: 'blur(1px)',
          opacity: 0.3,
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%)',
          }
        }}
      />
      
      <Box 
        component={motion.div}
        animate={{ 
          y: [0, 10, 0],
          rotate: -360,
        }}
        transition={{
          y: { 
            duration: 8, 
            repeat: Infinity,
            repeatType: 'loop'
          },
          rotate: {
            duration: 120,
            repeat: Infinity,
            ease: 'linear'
          }
        }}
        sx={{
          position: 'absolute',
          left: { xs: -30, md: '8%' },
          bottom: { xs: '10%', md: '15%' },
          width: { xs: 60, md: 90 },
          height: { xs: 60, md: 90 },
          borderRadius: '50%',
          background: 'radial-gradient(circle at 70% 30%, #11aaff 0%, #0088cc 70%, #006699 100%)',
          filter: 'blur(1px)',
          opacity: 0.25,
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%)',
          }
        }}
      />
      
      {/* Shooting star animation */}
      <Box 
        component={motion.div}
        animate={{
          left: ['-5%', '120%'],
          top: ['10%', '30%'],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 4,
          times: [0, 0.1, 0.9, 1],
          repeat: Infinity,
          repeatDelay: 12
        }}
        sx={{
          position: 'absolute',
          width: 120,
          height: 2,
          background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 100%)',
          boxShadow: '0 0 10px rgba(140, 158, 255, 0.8), 0 0 20px rgba(140, 158, 255, 0.5)',
          borderRadius: 4,
          zIndex: 0,
          transform: 'rotate(-30deg)'
        }}
      />
      
      <Container 
        maxWidth="lg" 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 6,
            position: 'relative'
          }}
        >
          <GradientText 
            variant="h3" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              textShadow: '0 0 30px rgba(140, 158, 255, 0.3)',
              position: 'relative',
            }}
          >
            Book Your Space Journey
            
            {/* Decorative rocket */}
            <Box 
              component={motion.div}
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              sx={{
                position: 'absolute',
                right: { xs: '-20px', sm: '-30px', md: '-40px' },
                top: { xs: '-15px', sm: '-30px', md: '-40px' },
                transform: 'rotate(45deg)'
              }}
            >
              <RocketLaunchIcon 
                sx={{ 
                  fontSize: { xs: 30, sm: 40, md: 50 },
                  color: '#FF9E80',
                  filter: 'drop-shadow(0 0 8px rgba(255, 158, 128, 0.7))'
                }} 
              />
            </Box>
          </GradientText>
          
          {/* Accent line */}
          <Box
            component={motion.div}
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ delay: 0.3, duration: 1 }}
            sx={{
              height: '3px',
              background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 50%, rgba(140, 158, 255, 0) 100%)',
              borderRadius: '3px',
              mb: 3,
              boxShadow: '0 0 10px rgba(140, 158, 255, 0.7)',
            }}
          />
          
          <Typography 
            variant="h6" 
            align="center" 
            color="rgba(255, 255, 255, 0.8)" 
            paragraph
            sx={{ 
              mb: 6,
              maxWidth: 750,
              mx: 'auto',
              fontWeight: 300,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.1rem' },
              textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            Select your destination, choose your seat class, and prepare for an out-of-this-world adventure with Dubai's premier space travel service.
          </Typography>
        </Box>
        
        <Box sx={{ width: '100%', mt: 2, mb: 8 }}>
          {/* Enhanced custom stepper */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              px: { xs: 0, sm: 5, md: 10 },
              mb: 6,
              position: 'relative'
            }}
          >
            {/* Background line for stepper */}
            <Box 
              sx={{ 
                position: 'absolute',
                height: 3,
                left: { xs: 30, sm: 60, md: 80 },
                right: { xs: 30, sm: 60, md: 80 },
                top: { xs: 18, sm: 24, md: 28 },
                backgroundColor: 'rgba(140, 158, 255, 0.15)',
                borderRadius: 2,
                zIndex: 1
              }}
            />
            
            {/* Progress indicator */}
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.6 }}
              sx={{
                position: 'absolute',
                height: 3,
                left: { xs: 30, sm: 60, md: 80 },
                top: { xs: 18, sm: 24, md: 28 },
                background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                borderRadius: 2,
                boxShadow: '0 0 8px rgba(140, 158, 255, 0.7)',
                zIndex: 2
              }}
            />
            
            {/* Step dots and labels */}
            {steps.map((label, index) => (
              <Box 
                key={label} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 5
                }}
              >
                <StepperDot 
                  active={activeStep === index} 
                  completed={activeStep > index}
                  component={motion.div}
                  animate={activeStep === index ? glowVariants.animate : {}}
                >
                  {activeStep > index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ✓
                      </Box>
                    </motion.div>
                  )}
                </StepperDot>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1.5, 
                    color: activeStep >= index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    fontWeight: activeStep === index ? 600 : 400,
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                    textAlign: 'center',
                    maxWidth: { xs: 60, sm: 'none' },
                    display: { xs: index === activeStep ? 'block' : 'none', sm: 'block' },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {label}
                </Typography>
                
                {/* Icon below label */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    color: activeStep >= index ? alpha('#8C9EFF', 0.9) : alpha('#8C9EFF', 0.3),
                    mt: 0.5,
                    fontSize: 20,
                  }}
                >
                  {renderStepIcon(index)}
                </Box>
              </Box>
            ))}
          </Box>
          
          {loading && activeStep < steps.length ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                my: 10,
                height: 300,
              }}
            >
              <Box 
                component={motion.div}
                animate={{ 
                  rotate: 360,
                  boxShadow: ['0 0 10px rgba(140, 158, 255, 0.5)', '0 0 20px rgba(140, 158, 255, 0.8)', '0 0 10px rgba(140, 158, 255, 0.5)']
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                  boxShadow: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' }
                }}
                sx={{ 
                  position: 'relative',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  border: '3px solid transparent',
                  borderTopColor: '#8C9EFF',
                  borderBottomColor: 'rgba(140, 158, 255, 0.3)',
                  mb: 4
                }}
              >
                <Box 
                  component={motion.div}
                  animate={{ 
                    rotate: -360
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: 'linear' 
                  }}
                  sx={{
                    position: 'absolute',
                    width: 70,
                    height: 70,
                    top: '50%',
                    left: '50%',
                    marginTop: -35,
                    marginLeft: -35,
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: 'rgba(255, 158, 128, 0.7)',
                    borderBottomColor: 'rgba(255, 158, 128, 0.2)',
                  }}
                />
              </Box>
              
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Preparing Your Space Journey
              </Typography>
              
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Loading cosmic possibilities...
              </Typography>
            </Box>
          ) : activeStep === steps.length ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <BookingConfirmation bookingData={bookingData} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <GlowingCard 
              sx={{ 
                p: { xs: 3, md: 4 },
                background: 'rgba(22, 27, 51, 0.75)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(140, 158, 255, 0.25)',
                borderRadius: { xs: 3, md: 4 },
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Glowing corner accent */}
              <Box
                component={motion.div}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'loop'
                }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 150,
                  height: 150,
                  background: 'radial-gradient(circle at top right, rgba(140, 158, 255, 0.2) 0%, rgba(140, 158, 255, 0) 70%)',
                  filter: 'blur(20px)',
                  zIndex: 0
                }}
              />
              
              <Box
                component={motion.div}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: 1
                }}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 120,
                  height: 120,
                  background: 'radial-gradient(circle at bottom left, rgba(255, 158, 128, 0.15) 0%, rgba(255, 158, 128, 0) 70%)',
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
                  mt: 5,
                  pt: 3,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <GlowingButton
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    minWidth: { xs: 100, md: 130 }
                  }}
                >
                  Back
                </GlowingButton>
                
                <GlowingButton
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? handleSubmitBooking : handleNext}
                  disabled={
                    (activeStep === 0 && !bookingData.destination) ||
                    (activeStep === 1 && !bookingData.seatClass) ||
                    (activeStep === 2 && !bookingData.accommodation)
                  }
                  endIcon={activeStep === steps.length - 1 ? <SendIcon /> : <ArrowForwardIcon />}
                  component={motion.button}
                  whileHover={{ scale: activeStep === steps.length - 1 ? 1.05 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  sx={{ 
                    minWidth: { xs: 100, md: 130 },
                    ...(activeStep === steps.length - 1 && {
                      background: 'linear-gradient(90deg, #FF9E80 0%, #FF6E40 100%)',
                      boxShadow: '0 4px 14px rgba(255, 110, 64, 0.6)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(255, 110, 64, 0.8)',
                      }
                    })
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
                </GlowingButton>
              </Box>
            </GlowingCard>
          )}
        </Box>
        
        {/* Testimonials or additional info can be added here */}
        {!loading && activeStep < steps.length && (
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            sx={{ 
              mt: { xs: 6, md: 10 }, 
              mb: 4,
              textAlign: 'center',
              maxWidth: 900,
              mx: 'auto'
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                color: 'white',
                mb: 3
              }}
            >
              Why Book with Dubai Space Travel?
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(22, 27, 51, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(140, 158, 255, 0.15)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(140, 158, 255, 0.2)',
                    border: '1px solid rgba(140, 158, 255, 0.3)',
                  }
                }}>
                  <Box 
                    component={motion.div}
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                    sx={{ mb: 2 }}
                  >
                    <RocketLaunchIcon sx={{ fontSize: 40, color: '#8C9EFF' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>Cutting-Edge Technology</Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Our spacecraft feature the latest advancements in space travel technology, ensuring a safe and comfortable journey.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(22, 27, 51, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(140, 158, 255, 0.15)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(140, 158, 255, 0.2)',
                    border: '1px solid rgba(140, 158, 255, 0.3)',
                  }
                }}>
                  <Box sx={{ mb: 2 }}>
                    <HotelIcon sx={{ fontSize: 40, color: '#FF9E80' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>Luxury Accommodations</Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Experience unparalleled comfort with our range of premium space habitats and accommodation options.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(22, 27, 51, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(140, 158, 255, 0.15)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(140, 158, 255, 0.2)',
                    border: '1px solid rgba(140, 158, 255, 0.3)',
                  }
                }}>
                  <Box sx={{ mb: 2 }}>
                    <FactCheckIcon sx={{ fontSize: 40, color: '#BB86FC' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>Comprehensive Training</Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    All travelers receive extensive pre-flight training to ensure a safe and enjoyable space experience.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BookingPage;