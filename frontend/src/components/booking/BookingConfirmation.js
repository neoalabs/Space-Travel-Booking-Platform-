// src/components/booking/BookingConfirmation.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Paper, Button, Divider, Grid, 
  Chip, IconButton, Tooltip, useTheme, alpha,
  Stepper, Step, StepLabel, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import * as THREE from 'three';

// Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DownloadIcon from '@mui/icons-material/Download';
import QrCodeIcon from '@mui/icons-material/QrCode';
import StarIcon from '@mui/icons-material/Star';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NearMeIcon from '@mui/icons-material/NearMe';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Styled components
const GlowingCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(22, 27, 51, 0.75)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(140, 158, 255, 0.25)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(140, 158, 255, 0.15)',
  overflow: 'hidden',
  position: 'relative',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  fontWeight: 700,
}));

const SuccessIconWrapper = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: 'rgba(140, 158, 255, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  position: 'relative',
  zIndex: 10,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: -5,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(140, 158, 255, 0.5) 0%, rgba(140, 158, 255, 0) 70%)',
    zIndex: -1,
    animation: 'rotate 8s linear infinite',
  },
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: theme.spacing(3, 0),
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'rgba(140, 158, 255, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  marginTop: 2,
  flexShrink: 0,
  color: theme.palette.primary.main,
}));

const GlowingButton = styled(Button)(({ theme, variant }) => {
  const isContained = variant !== 'outlined';
  return {
    borderRadius: 28,
    padding: theme.spacing(1.5, 4),
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    fontWeight: 600,
    fontSize: '1rem',
    letterSpacing: 0.5,
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
      borderColor: 'rgba(140, 158, 255, 0.5)',
      color: 'white',
      '&:hover': {
        borderColor: 'rgba(140, 158, 255, 0.8)',
        background: 'rgba(140, 158, 255, 0.05)',
      }
    })
  };
});

const BookingConfirmation = ({ bookingData }) => {
  const theme = useTheme();
  const threeJsContainerRef = useRef(null);
  const [bookingId, setBookingId] = useState('');
  const [stars, setStars] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  
  // Generate booking ID
  useEffect(() => {
    const generatedId = `DST-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(generatedId);
  }, []);
  
  // Generate stars for background
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }, () => ({
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
  
  // Initialize Three.js scene for dynamic background
  useEffect(() => {
    if (!threeJsContainerRef.current) return;
    
    const container = threeJsContainerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Clear previous canvas if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    container.appendChild(renderer.domElement);
    
    // Particle system for celebration effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Initial positions in a sphere around center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * 5 + 1;
      
      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = r * Math.cos(phi);
      
      // Velocities for animation
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      });
    }
    
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3));
    
    // Different colors for particles
    const particleMaterial1 = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x8C9EFF,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    
    const particleMaterial2 = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xFF9E80,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    
    const particleMaterial3 = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xFFFFFF,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    
    // Create three particle systems with different colors
    const particles1 = new THREE.Points(particlesGeometry.clone(), particleMaterial1);
    const particles2 = new THREE.Points(particlesGeometry.clone(), particleMaterial2);
    const particles3 = new THREE.Points(particlesGeometry.clone(), particleMaterial3);
    
    scene.add(particles1);
    scene.add(particles2);
    scene.add(particles3);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      const positions1 = particles1.geometry.attributes.position.array;
      const positions2 = particles2.geometry.attributes.position.array;
      const positions3 = particles3.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        const idx = i / 3;
        
        // Update positions with velocities
        positions1[i] += velocities[idx].x;
        positions1[i + 1] += velocities[idx].y;
        positions1[i + 2] += velocities[idx].z;
        
        positions2[i] += velocities[idx].x * 0.8;
        positions2[i + 1] += velocities[idx].y * 0.8;
        positions2[i + 2] += velocities[idx].z * 0.8;
        
        positions3[i] += velocities[idx].x * 1.2;
        positions3[i + 1] += velocities[idx].y * 1.2;
        positions3[i + 2] += velocities[idx].z * 1.2;
        
        // Bounce off invisible boundaries
        if (Math.abs(positions1[i]) > 8) velocities[idx].x *= -1;
        if (Math.abs(positions1[i + 1]) > 8) velocities[idx].y *= -1;
        if (Math.abs(positions1[i + 2]) > 8) velocities[idx].z *= -1;
      }
      
      particles1.geometry.attributes.position.needsUpdate = true;
      particles2.geometry.attributes.position.needsUpdate = true;
      particles3.geometry.attributes.position.needsUpdate = true;
      
      particles1.rotation.y += 0.0005;
      particles2.rotation.y -= 0.0005;
      particles3.rotation.x += 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);
  
  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleAddToCalendar = () => {
    setAddedToCalendar(true);
    // In a real implementation, this would integrate with calendar APIs
    setTimeout(() => setAddedToCalendar(false), 2000);
  };
  
  const handleDownloadTicket = () => {
    setLoadingDownload(true);
    // Simulate download process
    setTimeout(() => {
      setLoadingDownload(false);
      // In a real implementation, this would trigger a file download
    }, 1500);
  };
  
  const bookingDate = new Date();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const celebrationVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        delay: 0.2
      }
    }
  };
  
  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  };
  
  // Timeline steps for pre-journey preparation
  const timelineSteps = [
    {
      label: 'Booking Confirmed',
      date: format(bookingDate, 'MMM dd, yyyy'),
      completed: true,
      icon: <CheckCircleOutlineIcon />,
    },
    {
      label: 'Medical Examination',
      date: format(addDays(new Date(bookingData.departureDate), -30), 'MMM dd, yyyy'),
      completed: false,
      icon: <EventAvailableIcon />,
    },
    {
      label: 'Pre-flight Training',
      date: format(addDays(new Date(bookingData.departureDate), -14), 'MMM dd, yyyy'),
      completed: false,
      icon: <EventAvailableIcon />,
    },
    {
      label: 'Final Briefing',
      date: format(addDays(new Date(bookingData.departureDate), -3), 'MMM dd, yyyy'),
      completed: false,
      icon: <EventAvailableIcon />,
    },
    {
      label: 'Launch Day',
      date: format(new Date(bookingData.departureDate), 'MMM dd, yyyy'),
      completed: false,
      icon: <RocketLaunchIcon />,
    },
  ];
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        minHeight: '100vh',
      }}
    >
      {/* Three.js Background */}
      <Box 
        ref={threeJsContainerRef}
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
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
      
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
          textAlign: 'center', 
          position: 'relative',
          zIndex: 1,
          mx: 'auto',
          maxWidth: 1000
        }}
      >
        <motion.div variants={celebrationVariants}>
          <SuccessIconWrapper>
            <CheckCircleOutlineIcon 
              sx={{ 
                fontSize: 80, 
                color: '#81c784',
                filter: 'drop-shadow(0 0 10px rgba(129, 199, 132, 0.7))'
              }} 
            />
          </SuccessIconWrapper>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <GradientText 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              mt: 3,
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Booking Confirmed!
          </GradientText>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h6" 
            paragraph
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: 600,
              mx: 'auto',
              mb: 4
            }}
          >
            Your space journey to {bookingData.destination?.name} has been successfully booked.
            Get ready for an extraordinary adventure beyond Earth!
          </Typography>
        </motion.div>
        
        <Box 
          component={motion.div}
          variants={itemVariants}
          sx={{ mb: 6 }}
        >
          <Chip 
            icon={<FingerprintIcon />}
            label={bookingId}
            sx={{ 
              bgcolor: 'rgba(140, 158, 255, 0.15)',
              color: 'white',
              border: '1px solid rgba(140, 158, 255, 0.3)',
              py: 2.5,
              px: 1,
              '& .MuiChip-icon': {
                color: theme.palette.primary.main,
              }
            }}
            deleteIcon={
              copied ? 
              <CheckCircleOutlineIcon sx={{ color: '#81c784' }} /> : 
              <ContentCopyIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            }
            onDelete={handleCopyBookingId}
          />
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
            Booking Reference - Click to copy
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid 
            item 
            xs={12} 
            md={7}
            component={motion.div}
            variants={itemVariants}
          >
            <GlowingCard sx={{ p: 4, textAlign: 'left', height: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2 
              }}>
                <Typography variant="h5" component="h3" sx={{ color: 'white', fontWeight: 600 }}>
                  Journey Details
                </Typography>
                
                <Chip 
                  label={booking => booking.status || "Confirmed"} 
                  size="small"
                  sx={{ 
                    background: 'rgba(129, 199, 132, 0.2)',
                    color: '#81c784',
                    fontWeight: 500,
                    borderColor: 'rgba(129, 199, 132, 0.5)',
                    border: '1px solid'
                  }}
                />
              </Box>
              
              <StyledDivider />
              
              <InfoItem>
                <IconContainer>
                  <PublicIcon />
                </IconContainer>
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Destination
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {bookingData.destination?.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 0.5 }}>
                    {bookingData.destination?.type} • {bookingData.destination?.travelTime} journey
                  </Typography>
                </Box>
              </InfoItem>
              
              <InfoItem>
                <IconContainer>
                  <FlightTakeoffIcon />
                </IconContainer>
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Travel Dates
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="white">
                        Departure: {format(new Date(bookingData.departureDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="white">
                        Return: {format(new Date(bookingData.returnDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </InfoItem>
              
              <InfoItem>
                <IconContainer>
                  <AirplaneTicketIcon />
                </IconContainer>
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Seat Class
                  </Typography>
                  <Typography variant="body1" color="white">
                    {bookingData.seatClass?.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 0.5 }}>
                    {bookingData.seatClass?.description}
                  </Typography>
                </Box>
              </InfoItem>
              
              <InfoItem>
                <IconContainer>
                  <BedtimeIcon />
                </IconContainer>
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Accommodation
                  </Typography>
                  <Typography variant="body1" color="white">
                    {bookingData.accommodation?.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 0.5 }}>
                    {bookingData.accommodation?.pricePerNight.toLocaleString()} credits per night
                  </Typography>
                </Box>
              </InfoItem>
              
              <InfoItem>
                <IconContainer>
                  <PersonIcon />
                </IconContainer>
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Travelers
                  </Typography>
                  <Typography variant="body1" color="white">
                    {bookingData.passengers} {bookingData.passengers > 1 ? 'Passengers' : 'Passenger'}
                  </Typography>
                </Box>
              </InfoItem>
              
              <StyledDivider />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Total Price
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <AttachMoneyIcon sx={{ mr: 0.5, fontSize: 28 }} />
                    {bookingData.totalPrice.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Booking Date
                  </Typography>
                  <Typography variant="body1" color="white">
                    {format(bookingDate, 'MMMM dd, yyyy')}
                  </Typography>
                </Box>
              </Box>
            </GlowingCard>
          </Grid>
          
          <Grid 
            item 
            xs={12} 
            md={5}
            component={motion.div}
            variants={itemVariants}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <GlowingCard sx={{ p: 3, mb: 3, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ 
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at center, rgba(140, 158, 255, 0.3) 0%, rgba(140, 158, 255, 0) 70%)',
                  filter: 'blur(20px)',
                  zIndex: 0
                }} />
                
                <Box 
                  component={motion.div}
                  animate={floatAnimation}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    position: 'relative',
                    height: 120
                  }}
                >
                  <QrCodeIcon 
                    sx={{ 
                      fontSize: 100, 
                      color: alpha(theme.palette.primary.main, 0.7),
                      filter: 'drop-shadow(0 0 10px rgba(140, 158, 255, 0.5))'
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h6" 
                  align="center" 
                  sx={{ 
                    color: 'white', 
                    mb: 2, 
                    fontWeight: 600 
                  }}
                >
                  Your E-Ticket is Ready
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <GlowingButton 
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyBookingId}
                  >
                    {copied ? 'Copied!' : 'Copy ID'}
                  </GlowingButton>
                  
                  <GlowingButton 
                    variant="contained"
                    startIcon={loadingDownload ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                    onClick={handleDownloadTicket}
                    disabled={loadingDownload}
                  >
                    {loadingDownload ? 'Preparing...' : 'Download'}
                  </GlowingButton>
                </Box>
              </GlowingCard>
              
              <GlowingCard sx={{ p: 3, mb: 3, flex: 1 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <AccessTimeIcon sx={{ color: theme.palette.primary.main }} />
                  Preparation Timeline
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Stepper 
                    activeStep={0} 
                    orientation="vertical"
                    sx={{ 
                      '& .MuiStepConnector-line': {
                        minHeight: 40,
                        borderLeft: '2px dashed rgba(140, 158, 255, 0.2)'
                      }
                    }}
                  >
                    {timelineSteps.map((step, index) => (
                      <Step 
                        key={step.label} 
                        completed={step.completed}
                        sx={{ 
                          '& .MuiStepLabel-iconContainer': {
                            bgcolor: step.completed ? 'rgba(129, 199, 132, 0.2)' : 'rgba(140, 158, 255, 0.1)',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: step.completed 
                              ? '1px solid rgba(129, 199, 132, 0.5)' 
                              : '1px solid rgba(140, 158, 255, 0.3)',
                            color: step.completed ? '#81c784' : theme.palette.primary.main,
                            boxShadow: step.completed 
                              ? '0 0 10px rgba(129, 199, 132, 0.3)'
                              : 'none',
                          },
                          '& .MuiStepLabel-label': {
                            color: 'white'
                          }
                        }}
                      >
                        <StepLabel
                          StepIconComponent={() => step.icon}
                          optional={
                            <Typography 
                              variant="caption" 
                              color={step.completed ? 'rgba(129, 199, 132, 0.8)' : 'rgba(255, 255, 255, 0.5)'}
                            >
                              {step.date}
                            </Typography>
                          }
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: step.completed ? 'rgba(129, 199, 132, 0.8)' : 'white',
                              fontWeight: step.completed ? 600 : 400,
                            }}
                          >
                            {step.label}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </GlowingCard>
              
              <GlowingCard sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <CalendarTodayIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                    Add to Calendar
                  </Typography>
                </Box>
                
                <GlowingButton
                  variant={addedToCalendar ? "outlined" : "contained"}
                  fullWidth
                  onClick={handleAddToCalendar}
                  startIcon={addedToCalendar ? <CheckCircleOutlineIcon /> : <CalendarTodayIcon />}
                >
                  {addedToCalendar ? 'Added to Calendar' : 'Save to Calendar'}
                </GlowingButton>
              </GlowingCard>
            </Box>
          </Grid>
        </Grid>
        
        {/* Special offer card */}
        <Grid
          container
          spacing={4}
          sx={{ mt: 2 }}
          component={motion.div}
          variants={itemVariants}
        >
          <Grid item xs={12}>
            <GlowingCard 
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, rgba(255, 158, 128, 0.15) 0%, rgba(255, 158, 128, 0.05) 100%)',
                border: '1px solid rgba(255, 158, 128, 0.2)',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: { xs: 2, sm: 0 }
                }}>
                  <LocalOfferIcon sx={{ color: '#FF9E80', mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      Special Offer for Space Travelers
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                      Book your next cosmic journey within 90 days and receive a 10% discount!
                    </Typography>
                  </Box>
                </Box>
                <GlowingButton
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  component={Link}
                  to="/destinations"
                  sx={{ 
                    background: 'linear-gradient(90deg, #FF9E80 0%, #FF6E40 100%)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(255, 110, 64, 0.7)',
                    }
                  }}
                >
                  Explore Destinations
                </GlowingButton>
              </Box>
            </GlowingCard>
          </Grid>
        </Grid>
        
        {/* Action buttons */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            mt: 6,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
          }}
          component={motion.div}
          variants={itemVariants}
        >
          <GlowingButton 
            variant="contained" 
            component={Link} 
            to="/dashboard"
            endIcon={<ArrowForwardIcon />}
            sx={{ minWidth: 200 }}
          >
            View My Dashboard
          </GlowingButton>
          
          <GlowingButton 
            variant="outlined"
            component={Link} 
            to="/"
            sx={{ minWidth: 200 }}
          >
            Return to Home
          </GlowingButton>
        </Box>
        
        {/* Information note */}
        <Box 
          sx={{ 
            mt: 6,
            p: 2,
            background: 'rgba(140, 158, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            border: '1px solid rgba(140, 158, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            maxWidth: 800,
            mx: 'auto'
          }}
          component={motion.div}
          variants={itemVariants}
        >
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="body2" color="rgba(255, 255, 255, 0.9)">
            A confirmation email has been sent to your registered email address with complete journey details. 
            You can access your tickets anytime from your dashboard.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;