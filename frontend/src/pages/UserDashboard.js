// src/pages/UserDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Grid, Typography, Box, Tabs, Tab, Paper, Card, CardContent,
  CardActions, Button, Divider, Avatar, Chip, LinearProgress, List,
  ListItem, ListItemIcon, ListItemText, CircularProgress, Badge, IconButton,
  Tooltip, useTheme, alpha, Menu, MenuItem, useMediaQuery, Slider
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { format, differenceInDays, differenceInHours, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ScienceIcon from '@mui/icons-material/Science';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LanguageIcon from '@mui/icons-material/Language';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import BiotechIcon from '@mui/icons-material/Biotech';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SpeedIcon from '@mui/icons-material/Speed';
import TerrainIcon from '@mui/icons-material/Terrain';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import ShieldIcon from '@mui/icons-material/Shield';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';

import { 
  fetchUserBookings, 
  fetchUserProfile, 
  fetchSpaceTravelTips 
} from '../api/userApi';

// Custom styled components
const GlowingCard = styled(Card)(({ theme, hoverable }) => ({
  background: 'rgba(22, 27, 51, 0.75)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(140, 158, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  ...(hoverable && {
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 15px rgba(140, 158, 255, 0.2)',
      border: '1px solid rgba(140, 158, 255, 0.3)',
    }
  })
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  fontWeight: 700,
}));

const AnimatedTab = styled(Tab)(({ theme }) => ({
  minHeight: 60,
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  opacity: 0.7,
  color: 'white',
  '&.Mui-selected': {
    opacity: 1,
    fontWeight: 600,
    color: theme.palette.primary.main,
  }
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'rgba(140, 158, 255, 0.15)',
  border: '1px solid rgba(140, 158, 255, 0.3)',
  color: 'white',
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  }
}));

const GlowingProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  background: alpha(theme.palette.primary.main, 0.15),
  '& .MuiLinearProgress-bar': {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    boxShadow: `0 0 10px ${theme.palette.primary.main}`,
  },
  '& .MuiLinearProgress-dashed': {
    backgroundImage: 'none',
  }
}));

const GlowingButton = styled(Button)(({ theme, variant }) => {
  const isContained = variant === 'contained';
  return {
    borderRadius: 28,
    padding: theme.spacing(1, 2.5),
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    fontWeight: 600,
    letterSpacing: 0.5,
    fontSize: '0.9rem',
    
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

const PulsatingBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: 'linear-gradient(45deg, #FF9E80 0%, #FF6E40 100%)',
    boxShadow: '0 0 10px rgba(255, 158, 128, 0.7)',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(255, 158, 128, 0.7)',
      },
      '70%': {
        boxShadow: '0 0 0 10px rgba(255, 158, 128, 0)',
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(255, 158, 128, 0)',
      },
    },
  },
}));

const UserDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs
  const threeJsContainerRef = useRef(null);
  const earthCanvasRef = useRef(null);
  
  // States
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [travelTips, setTravelTips] = useState([]);
  const [stars, setStars] = useState([]);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [bookmarkedTipId, setBookmarkedTipId] = useState(1); // Example bookmarked tip
  const [achievementTooltip, setAchievementTooltip] = useState(null);

  // Sample achievements data
  const achievements = [
    { 
      id: 1, 
      name: "Space Cadet", 
      icon: <RocketLaunchIcon />, 
      description: "Completed your first space journey", 
      date: "Jan 15, 2025",
      unlocked: true 
    },
    { 
      id: 2, 
      name: "Lunar Pioneer", 
      icon: <TerrainIcon />, 
      description: "Visited the Lunar Gateway Station", 
      date: "Feb 28, 2025",
      unlocked: true 
    },
    { 
      id: 3, 
      name: "Zero-G Master", 
      icon: <FilterDramaIcon />, 
      description: "Experienced weightlessness for over 24 hours", 
      date: null,
      unlocked: false,
      progress: 70 
    },
    { 
      id: 4, 
      name: "Martian Explorer", 
      icon: <ViewInArIcon />, 
      description: "Visited Mars Base Alpha", 
      date: null,
      unlocked: false,
      progress: 0 
    },
    { 
      id: 5, 
      name: "Million Mile Club", 
      icon: <AutoGraphIcon />, 
      description: "Traveled over 1 million space miles", 
      date: null,
      unlocked: false,
      progress: 85 
    },
  ];

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "Pre-flight Training Reminder",
      message: "Your pre-flight training for the Lunar Gateway trip begins in 3 days. Please prepare accordingly.",
      time: "2 hours ago",
      icon: <ScheduleIcon sx={{ color: theme.palette.primary.main }} />,
      read: false
    },
    {
      id: 2,
      title: "Special Offer",
      message: "Exclusive discount on Mars Base Alpha bookings for our Elite Space Travelers.",
      time: "1 day ago",
      icon: <LocalOfferIcon sx={{ color: "#FF9E80" }} />,
      read: false
    },
    {
      id: 3,
      title: "System Update",
      message: "We've updated our booking system with new features. Check out what's new!",
      time: "3 days ago",
      icon: <BiotechIcon sx={{ color: "#BB86FC" }} />,
      read: false
    },
    {
      id: 4,
      title: "Booking Confirmed",
      message: "Your booking for Orbital Hotel Artemis has been confirmed.",
      time: "1 week ago",
      icon: <CheckCircleOutlineIcon sx={{ color: "#81C784" }} />,
      read: true
    }
  ];

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

  // Earth globe in profile card
  useEffect(() => {
    if (!earthCanvasRef.current) return;

    const canvas = earthCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Create a simple animated globe
    let rotation = 0;

    function drawEarth() {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Draw Earth
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, width / 2 * 0.9);
      gradient.addColorStop(0, '#1a237e');
      gradient.addColorStop(0.5, '#3f51b5');
      gradient.addColorStop(1, '#8c9eff');
      
      ctx.beginPath();
      ctx.arc(0, 0, width / 2 * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw some simplified "continents"
      ctx.fillStyle = '#81c784';
      
      // Rotating continent 1
      ctx.save();
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.ellipse(-10, 10, 25, 15, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Rotating continent 2
      ctx.save();
      ctx.rotate(rotation + Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(12, -8, 20, 10, Math.PI / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Rotating continent 3
      ctx.save();
      ctx.rotate(rotation + Math.PI);
      ctx.beginPath();
      ctx.ellipse(-5, -15, 18, 12, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Glowing atmosphere
      const atmosphereGradient = ctx.createRadialGradient(0, 0, width / 2 * 0.9, 0, 0, width / 2 * 1.1);
      atmosphereGradient.addColorStop(0, 'rgba(140, 158, 255, 0.5)');
      atmosphereGradient.addColorStop(1, 'rgba(140, 158, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(0, 0, width / 2 * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = atmosphereGradient;
      ctx.fill();
      
      ctx.restore();
      
      rotation += 0.005;
      requestAnimationFrame(drawEarth);
    }

    drawEarth();

    // Cleanup
    return () => {
      // No specific cleanup needed for canvas
    };
  }, []);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile, bookings and travel tips in parallel
        const [userProfileData, userBookingsData, spaceTravelTipsData] = await Promise.all([
          fetchUserProfile(),
          fetchUserBookings(),
          fetchSpaceTravelTips()
        ]);
        
        setProfile(userProfileData);
        setBookings(userBookingsData);
        setTravelTips(spaceTravelTipsData);
        setTimeout(() => setLoading(false), 1000); // Add slight delay for smooth loading animation
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setExpandedBookingId(null); // Reset expanded card when changing tabs
  };
  
  // Calculate preparation progress
  const calculatePreparationProgress = (departureDate) => {
    const now = new Date();
    const departure = new Date(departureDate);
    const totalDays = 90; // Assuming 90 days of preparation time
    const daysRemaining = differenceInDays(departure, now);
    
    // Calculate percentage completed
    const progress = Math.min(100, Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100));
    return Math.round(progress);
  };

  const handleExpandBooking = (id) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleBookmarkTip = (id) => {
    setBookmarkedTipId(bookmarkedTipId === id ? null : id);
  };

  const handleAchievementTooltip = (id) => {
    setAchievementTooltip(id);
  };

  const handleCloseAchievementTooltip = () => {
    setAchievementTooltip(null);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const blinkAnimation = {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'mirror'
      }
    }
  };
  
  // If loading, show spinner
  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          background: 'linear-gradient(to bottom, #0B0D1B 0%, #161B33 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Generate some random stars in the loading screen */}
        {Array.from({ length: 50 }).map((_, i) => (
          <Box
            key={`loading-star-${i}`}
            sx={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              borderRadius: '50%',
              backgroundColor: 'white',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate ${Math.random() * 5}s`,
              '@keyframes twinkle': {
                '0%': { opacity: Math.random() * 0.5 + 0.1, boxShadow: '0 0 0 rgba(255, 255, 255, 0)' },
                '100%': { opacity: Math.random() * 0.2 + 0.05, boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)' }
              },
            }}
          />
        ))}

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
        
        <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
          Preparing Your Space Dashboard
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1, maxWidth: 400, textAlign: 'center' }}>
          Loading your journey data, achievements, and upcoming space adventures...
        </Typography>
      </Box>
    );
  }
  
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
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
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
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4, 
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'space-between',
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
            <GradientText
              variant="h3"
              component="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' },
                textShadow: '0 0 30px rgba(140, 158, 255, 0.3)',
              }}
            >
              Space Traveler Dashboard
            </GradientText>

            <Box
              component={motion.div}
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -3, 3, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              sx={{ ml: 2, mt: 1 }}
            >
              <RocketLaunchIcon
                sx={{
                  fontSize: { xs: 30, sm: 36 },
                  color: '#FF9E80',
                  filter: 'drop-shadow(0 0 8px rgba(255, 158, 128, 0.7))'
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2
            }}
          >
            <PulsatingBadge 
              badgeContent={notificationsCount} 
              color="error"
              overlap="circular"
            >
              <IconButton
                sx={{
                  background: 'rgba(22, 27, 51, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(140, 158, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(22, 27, 51, 0.8)',
                  }
                }}
                onClick={handleNotificationsOpen}
              >
                <NotificationsIcon sx={{ color: 'white' }} />
              </IconButton>
            </PulsatingBadge>
            
            <IconButton
              sx={{
                background: 'rgba(22, 27, 51, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(140, 158, 255, 0.2)',
                '&:hover': {
                  background: 'rgba(22, 27, 51, 0.8)',
                }
              }}
              onClick={handleUserMenuOpen}
            >
              <PersonIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Sidebar - User Profile and Space Achievements */}
          <Grid 
            item 
            xs={12} 
            md={4} 
            lg={3}
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            {/* User Profile Card */}
            <GlowingCard sx={{ mb: 4, overflow: 'visible' }}>
              {/* Profile header with Earth visualization */}
              <Box sx={{ 
                position: 'relative',
                height: 120, 
                background: 'linear-gradient(135deg, rgba(11, 13, 27, 0.8) 0%, rgba(11, 13, 27, 0.6) 100%)',
                overflow: 'hidden'
              }}>
                {/* Earth canvas */}
                <Box sx={{ 
                  position: 'absolute', 
                  right: 20, 
                  top: -30,
                  width: 100,
                  height: 100,
                  zIndex: 1
                }}>
                  <canvas 
                    ref={earthCanvasRef} 
                    width={100} 
                    height={100}
                    style={{ position: 'relative', zIndex: 1 }}
                  />
                </Box>
                
                {/* Space miles route visualization */}
                <Box sx={{ 
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0.7,
                }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Box 
                      key={`orbit-path-${i}`}
                      component={motion.div}
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: i * 0.5
                      }}
                      sx={{
                        position: 'absolute',
                        top: 10 + (i * 15),
                        left: 10 + (i * 5),
                        width: `calc(100% - ${20 + (i * 10)}px)`,
                        height: 1,
                        background: 'linear-gradient(90deg, rgba(140, 158, 255, 0.1) 0%, rgba(140, 158, 255, 0.5) 50%, rgba(140, 158, 255, 0.1) 100%)',
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Box>
              </Box>
              
              <CardContent sx={{ textAlign: 'center', position: 'relative', mt: -6 }}>
                <Avatar
                  src={profile?.avatarUrl}
                  alt={profile?.fullName}
                  sx={{ 
                    width: 110, 
                    height: 110, 
                    margin: '0 auto 16px',
                    border: '4px solid rgba(140, 158, 255, 0.5)',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {!profile?.avatarUrl && <AccountCircleIcon sx={{ fontSize: 70 }} />}
                </Avatar>
                
                <Typography variant="h5" component="div" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                  {profile?.fullName}
                </Typography>
                
                <Chip 
                  icon={<RocketLaunchIcon />} 
                  label={`Space Traveler Level ${profile?.travelerLevel}`} 
                  sx={{ 
                    mb: 2, 
                    background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                    color: 'white',
                    fontWeight: 500,
                    boxShadow: '0 2px 10px rgba(105, 121, 248, 0.5)',
                  }}
                />
                
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" paragraph>
                  {profile?.bio}
                </Typography>
                
                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    background: 'rgba(10, 15, 30, 0.5)',
                    borderRadius: 2,
                    p: 2,
                    mb: 2
                  }}
                >
                  <Box 
                    component={motion.div}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 700, 
                          color: 'white',
                          textShadow: '0 0 10px rgba(140, 158, 255, 0.3)'
                        }}
                      >
                        {profile?.totalMiles.toLocaleString()}
                      </Typography>
                    </motion.div>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">Space Miles</Typography>
                  </Box>
                  
                  <Box 
                    component={motion.div}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 700, 
                          color: 'white',
                          textShadow: '0 0 10px rgba(140, 158, 255, 0.3)'
                        }}
                      >
                        {profile?.completedTrips}
                      </Typography>
                    </motion.div>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">Trips</Typography>
                  </Box>
                  
                  <Box 
                    component={motion.div}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 700, 
                          color: 'white',
                          textShadow: '0 0 10px rgba(140, 158, 255, 0.3)'
                        }}
                      >
                        {profile?.destinations}
                      </Typography>
                    </motion.div>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">Destinations</Typography>
                  </Box>
                </Box>

                <GlowingButton 
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  sx={{ mb: 2 }}
                >
                  Edit Profile
                </GlowingButton>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 1 
                }}>
                  <GlowingButton 
                    variant="outlined"
                    sx={{ flex: 1 }}
                    startIcon={<LanguageIcon />}
                  >
                    Preferences
                  </GlowingButton>
                  
                  <GlowingButton 
                    variant="outlined"
                    sx={{ flex: 1 }}
                    startIcon={<AccessTimeFilledIcon />}
                  >
                    History
                  </GlowingButton>
                </Box>
              </CardContent>
            </GlowingCard>
            
            {/* Space Achievements Card */}
            <GlowingCard
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{ mb: 4 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmojiEventsIcon sx={{ 
                    mr: 1.5, 
                    color: '#FF9E80',
                    filter: 'drop-shadow(0 0 8px rgba(255, 158, 128, 0.5))'
                  }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Space Achievements
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                <Box 
                  sx={{ 
                    background: 'rgba(10, 15, 30, 0.5)',
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  {achievements.map((achievement) => (
                    <Box 
                      key={achievement.id}
                      component={motion.div}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * achievement.id }}
                      sx={{ 
                        mb: 2, 
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: achievement.unlocked ? 1 : 0.7
                      }}
                      onMouseEnter={() => handleAchievementTooltip(achievement.id)}
                      onMouseLeave={handleCloseAchievementTooltip}
                    >
                      <Box 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          borderRadius: '50%', 
                          background: achievement.unlocked 
                            ? 'linear-gradient(135deg, #8C9EFF 0%, #6979F8 100%)' 
                            : 'rgba(140, 158, 255, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: achievement.unlocked 
                            ? '0 0 15px rgba(140, 158, 255, 0.5)' 
                            : 'none',
                          mr: 2,
                          color: achievement.unlocked ? 'white' : 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {achievement.icon}
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            color: achievement.unlocked ? 'white' : 'rgba(255, 255, 255, 0.7)'
                          }}
                        >
                          {achievement.name}
                        </Typography>
                        
                        {achievement.unlocked ? (
                          <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                            Unlocked: {achievement.date}
                          </Typography>
                        ) : (
                          <Box sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                                Progress: {achievement.progress}%
                              </Typography>
                              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                {achievement.progress < 50 ? 'In Progress' : 'Almost There!'}
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={achievement.progress} 
                              sx={{ 
                                height: 4, 
                                borderRadius: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: achievement.progress < 50 
                                    ? 'rgba(140, 158, 255, 0.5)' 
                                    : 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                                  borderRadius: 2,
                                }
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                      
                      {/* Tooltip for more details */}
                      <AnimatePresence>
                        {achievementTooltip === achievement.id && (
                          <Box
                            component={motion.div}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            sx={{
                              position: 'absolute',
                              top: -80,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 220,
                              p: 1.5,
                              borderRadius: 2,
                              background: 'rgba(22, 27, 51, 0.95)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(140, 158, 255, 0.3)',
                              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                              zIndex: 10,
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -8,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 0,
                                height: 0,
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderTop: '8px solid rgba(22, 27, 51, 0.95)',
                              }
                            }}
                          >
                            <Typography variant="body2" sx={{ textAlign: 'center', color: 'white', fontWeight: 500 }}>
                              {achievement.description}
                            </Typography>
                          </Box>
                        )}
                      </AnimatePresence>
                    </Box>
                  ))}
                  
                  <GlowingButton 
                    variant="text"
                    fullWidth
                    sx={{ 
                      mt: 1, 
                      color: theme.palette.primary.main,
                      background: 'rgba(140, 158, 255, 0.05)'
                    }}
                  >
                    View All Achievements
                  </GlowingButton>
                </Box>
              </CardContent>
            </GlowingCard>
            
            {/* AI Space Travel Tips Card */}
            <GlowingCard
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LightbulbIcon sx={{ 
                    mr: 1.5, 
                    color: '#FF9E80',
                    animation: 'glow 2s infinite alternate',
                    '@keyframes glow': {
                      '0%': { filter: 'drop-shadow(0 0 2px rgba(255, 158, 128, 0.4))' },
                      '100%': { filter: 'drop-shadow(0 0 8px rgba(255, 158, 128, 0.7))' }
                    }
                  }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    AI Space Travel Tips
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                <Box 
                  sx={{ 
                    background: 'rgba(10, 15, 30, 0.5)',
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  {travelTips.map((tip, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        background: bookmarkedTipId === index ? 'rgba(140, 158, 255, 0.15)' : 'transparent',
                        border: bookmarkedTipId === index ? '1px dashed rgba(140, 158, 255, 0.3)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                      component={motion.div}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <TipsAndUpdatesIcon 
                          fontSize="small" 
                          sx={{ 
                            mt: 0.5,
                            mr: 1.5,
                            color: '#FF9E80',
                          }}
                        />
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            flex: 1
                          }}
                        >
                          {tip}
                        </Typography>
                        
                        <IconButton 
                          size="small" 
                          onClick={() => handleBookmarkTip(index)}
                          sx={{ 
                            color: bookmarkedTipId === index ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.4)',
                            '&:hover': {
                              color: theme.palette.primary.main
                            }
                          }}
                        >
                          {bookmarkedTipId === index ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </GlowingCard>
          </Grid>
          
          {/* Main Dashboard Content */}
          <Grid 
            item 
            xs={12} 
            md={8} 
            lg={9}
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper 
              sx={{ 
                width: '100%', 
                mb: 4,
                background: 'rgba(16, 20, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(140, 158, 255, 0.2)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile}
                allowScrollButtonsMobile
                centered={!isMobile}
                sx={{ 
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 1.5,
                    background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                    boxShadow: '0 0 10px rgba(140, 158, 255, 0.7)',
                  }
                }}
              >
                <AnimatedTab 
                  label="Upcoming Trips" 
                  icon={<RocketLaunchIcon />} 
                  iconPosition="start" 
                />
                <AnimatedTab 
                  label="Past Journeys" 
                  icon={<CalendarTodayIcon />} 
                  iconPosition="start" 
                />
                <AnimatedTab 
                  label="My Tickets" 
                  icon={<ConfirmationNumberIcon />} 
                  iconPosition="start" 
                />
                <AnimatedTab 
                  label="Journey Stats" 
                  icon={<AutoGraphIcon />} 
                  iconPosition="start" 
                />
              </Tabs>
            </Paper>
            
            {/* Tab panels with animated transitions */}
            <AnimatePresence mode="wait">
              {/* Upcoming Trips */}
              {tabValue === 0 && (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      <TravelExploreIcon sx={{ color: theme.palette.primary.main }} />
                      Your Upcoming Space Journeys
                    </Typography>
                    
                    {bookings.filter(booking => new Date(booking.departureDate) > new Date()).length === 0 ? (
                      <GlowingCard 
                        sx={{ 
                          p: 4, 
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <Box
                          component={motion.div}
                          animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: 'loop'
                          }}
                        >
                          <PublicIcon 
                            sx={{ 
                              fontSize: 60, 
                              color: 'rgba(140, 158, 255, 0.7)',
                            }}
                          />
                        </Box>
                        
                        <Typography variant="h6" paragraph sx={{ color: 'white' }}>
                          No upcoming trips scheduled
                        </Typography>
                        
                        <GlowingButton
                          variant="contained" 
                          component={Link} 
                          to="/booking"
                          startIcon={<RocketLaunchIcon />}
                        >
                          Book Your First Space Journey
                        </GlowingButton>
                      </GlowingCard>
                    ) : (
                      <Box component={motion.div} layout>
                        {bookings
                          .filter(booking => new Date(booking.departureDate) > new Date())
                          .map((booking, index) => (
                            <GlowingCard 
                              key={booking.id}
                              sx={{ mb: 3 }}
                              component={motion.div}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                              hoverable
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                              }}>
                                <Box 
                                  sx={{ 
                                    width: { xs: '100%', sm: 240 }, 
                                    height: { xs: 140, sm: 'auto' }, 
                                    position: 'relative' 
                                  }}
                                >
                                  <Box 
                                    component="img"
                                    src={booking.destination.imageUrl}
                                    alt={booking.destination.name}
                                    sx={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'cover',
                                      filter: 'brightness(0.8) contrast(1.2)'
                                    }}
                                  />
                                  
                                  {/* Overlay gradient */}
                                  <Box sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '50%',
                                    background: 'linear-gradient(to top, rgba(22, 27, 51, 1) 0%, rgba(22, 27, 51, 0) 100%)',
                                  }} />
                                  
                                  {/* Destination badge */}
                                  <Box 
                                    sx={{
                                      position: 'absolute', 
                                      top: 16, 
                                      left: 16, 
                                      backgroundColor: 'rgba(11, 13, 27, 0.85)',
                                      color: 'white',
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: 10,
                                      backdropFilter: 'blur(8px)',
                                      border: '1px solid rgba(140, 158, 255, 0.3)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5
                                    }}
                                  >
                                    <PublicIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                      {booking.destination.name.split(' ')[0]}
                                    </Typography>
                                  </Box>
                                  
                                  <Box 
                                    sx={{ 
                                      position: 'absolute', 
                                      bottom: 10, 
                                      left: 0, 
                                      width: '100%', 
                                      px: 2
                                    }}
                                  >
                                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                                      {booking.destination.name}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={7}>
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
                                        <RocketLaunchIcon 
                                          sx={{ 
                                            color: '#8C9EFF',
                                            animation: 'pulse 2s infinite alternate',
                                            '@keyframes pulse': {
                                              '0%': { opacity: 0.7 },
                                              '100%': { opacity: 1 }
                                            }
                                          }} 
                                        />
                                        {booking.destination.name} Adventure
                                      </Typography>
                                      
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 1.5,
                                        color: 'rgba(255, 255, 255, 0.8)'
                                      }}>
                                        <RocketLaunchIcon 
                                          fontSize="small" 
                                          sx={{ mr: 1, color: 'rgba(140, 158, 255, 0.8)' }} 
                                        />
                                        <Typography variant="body2">
                                          Departure: {format(new Date(booking.departureDate), 'MMM dd, yyyy - HH:mm')}
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 1.5,
                                        color: 'rgba(255, 255, 255, 0.8)'
                                      }}>
                                        <HotelIcon 
                                          fontSize="small" 
                                          sx={{ mr: 1, color: 'rgba(140, 158, 255, 0.8)' }} 
                                        />
                                        <Typography variant="body2">
                                          {booking.accommodation.name}
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ display: 'flex', mt: 2, flexWrap: 'wrap', gap: 1 }}>
                                        <Chip 
                                          label={booking.seatClass.name} 
                                          size="small" 
                                          sx={{ 
                                            background: 'linear-gradient(90deg, #FF9E80 0%, #FF8A65 100%)',
                                            color: 'white',
                                            fontWeight: 500
                                          }}
                                        />
                                        <Chip 
                                          label={`${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}`} 
                                          size="small"
                                          sx={{ 
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            color: 'white',
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid'
                                          }}
                                        />
                                        <Chip 
                                          label={booking.status} 
                                          size="small"
                                          sx={{ 
                                            background: booking.status === 'Confirmed' 
                                              ? 'rgba(129, 199, 132, 0.2)' 
                                              : 'rgba(255, 235, 59, 0.2)',
                                            color: booking.status === 'Confirmed' 
                                              ? '#81c784' 
                                              : '#ffeb3b',
                                            borderColor: booking.status === 'Confirmed' 
                                              ? 'rgba(129, 199, 132, 0.5)' 
                                              : 'rgba(255, 235, 59, 0.5)',
                                            border: '1px solid'
                                          }}
                                        />
                                      </Box>
                                      
                                      {/* Journey progress */}
                                      <Box sx={{ mt: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Journey Progress
                                          </Typography>
                                          <Typography 
                                            variant="body2" 
                                            sx={{ 
                                              color: '#8C9EFF',
                                              fontWeight: 500
                                            }}
                                          >
                                            Upcoming
                                          </Typography>
                                        </Box>
                                        
                                        <Box sx={{ position: 'relative' }}>
                                          <Box sx={{ 
                                            height: 8, 
                                            bgcolor: 'rgba(140, 158, 255, 0.1)', 
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                          }}>
                                            <Box 
                                              component={motion.div}
                                              initial={{ width: 0 }}
                                              animate={{ width: `0%` }}
                                              transition={{ duration: 1, delay: 0.5 }}
                                              sx={{
                                                height: '100%',
                                                background: `linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)`,
                                                borderRadius: 4,
                                                position: 'relative',
                                              }}
                                            />
                                          </Box>
                                          
                                          {/* Journey milestones */}
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Box sx={{ position: 'relative' }}>
                                              <Box 
                                                sx={{ 
                                                  width: 10, 
                                                  height: 10, 
                                                  borderRadius: '50%', 
                                                  bgcolor: 'rgba(140, 158, 255, 0.3)',
                                                  position: 'absolute',
                                                  top: -18,
                                                  left: 0,
                                                  transform: 'translateX(-50%)',
                                                }}
                                                component={motion.div}
                                                animate={blinkAnimation.animate}
                                              />
                                              <Typography variant="caption" color="text.secondary">
                                                Now
                                              </Typography>
                                            </Box>
                                            
                                            <Box sx={{ position: 'relative' }}>
                                              <Box 
                                                sx={{ 
                                                  width: 10, 
                                                  height: 10, 
                                                  borderRadius: '50%', 
                                                  bgcolor: '#8C9EFF',
                                                  position: 'absolute',
                                                  top: -18,
                                                  left: '50%',
                                                  transform: 'translateX(-50%)',
                                                  boxShadow: '0 0 10px rgba(140, 158, 255, 0.7)',
                                                }}
                                              />
                                              <Typography variant="caption" color="text.secondary">
                                                Departure
                                              </Typography>
                                            </Box>
                                            
                                            <Box sx={{ position: 'relative' }}>
                                              <Box 
                                                sx={{ 
                                                  width: 10, 
                                                  height: 10, 
                                                  borderRadius: '50%', 
                                                  bgcolor: 'rgba(140, 158, 255, 0.3)',
                                                  position: 'absolute',
                                                  top: -18,
                                                  right: 0,
                                                  transform: 'translateX(50%)',
                                                }}
                                              />
                                              <Typography variant="caption" color="text.secondary">
                                                Return
                                              </Typography>
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                                      {/* Enhanced countdown */}
                                      <Box 
                                        sx={{ 
                                          p: 2,
                                          borderRadius: 2, 
                                          background: 'rgba(22, 27, 51, 0.9)',
                                          border: '1px solid rgba(140, 158, 255, 0.3)',
                                          mb: 2,
                                          boxShadow: 'inset 0 0 20px rgba(140, 158, 255, 0.1)'
                                        }}
                                      >
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
                                          Launch Countdown
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Box sx={{ 
                                              width: 50, 
                                              height: 50, 
                                              borderRadius: '50%', 
                                              border: '3px solid rgba(140, 158, 255, 0.2)',
                                              position: 'relative',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                            }}>
                                              <Box component={motion.div} 
                                                animate={{ 
                                                  background: ['rgba(140, 158, 255, 0.1)', 'rgba(140, 158, 255, 0.3)', 'rgba(140, 158, 255, 0.1)']
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                sx={{ 
                                                  position: 'absolute',
                                                  inset: -3,
                                                  borderRadius: '50%',
                                                  zIndex: -1
                                                }} 
                                              />
                                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                                                {differenceInDays(new Date(booking.departureDate), new Date())}
                                              </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                              Days
                                            </Typography>
                                          </Box>
                                          
                                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Box sx={{ 
                                              width: 50, 
                                              height: 50, 
                                              borderRadius: '50%', 
                                              border: '3px solid rgba(140, 158, 255, 0.2)',
                                              position: 'relative',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                            }}>
                                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                                                {differenceInHours(new Date(booking.departureDate), new Date()) % 24}
                                              </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                              Hours
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Box>
                                      
                                      <Box>
                                        <Typography 
                                          variant="subtitle2" 
                                          color="rgba(255, 255, 255, 0.7)" 
                                          gutterBottom
                                        >
                                          Preparation Progress
                                        </Typography>
                                        <GlowingProgress 
                                          variant="determinate" 
                                          value={calculatePreparationProgress(booking.departureDate)} 
                                        />
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            mt: 1,
                                            color: 'white',
                                            fontWeight: 500
                                          }}
                                        >
                                          {calculatePreparationProgress(booking.departureDate)}% Complete
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                  
                                  {/* Expandable section */}
                                  <AnimatePresence>
                                    {expandedBookingId === booking.id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                        
                                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                                          Trip Details
                                        </Typography>
                                        
                                        <Grid container spacing={2} sx={{ mb: 1 }}>
                                          <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                              Travel Duration:
                                            </Typography>
                                            <Typography variant="body2" color="white">
                                              {booking.destination.travelTime}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                              Stay Duration:
                                            </Typography>
                                            <Typography variant="body2" color="white">
                                              {differenceInDays(new Date(booking.returnDate), new Date(booking.departureDate))} days
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                              Booking Reference:
                                            </Typography>
                                            <Typography variant="body2" color="white">
                                              DST-{booking.id}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                              Booking Date:
                                            </Typography>
                                            <Typography variant="body2" color="white">
                                              {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                        
                                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'white', fontWeight: 600, mt: 2 }}>
                                          Pre-flight Schedule
                                        </Typography>
                                        
                                        <Box sx={{ mb: 2 }}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Chip 
                                              size="small" 
                                              label={format(addDays(new Date(booking.departureDate), -30), 'MMM dd')} 
                                              sx={{ 
                                                mr: 2,
                                                bgcolor: 'rgba(140, 158, 255, 0.2)',
                                                color: 'white',
                                                minWidth: 70,
                                              }}
                                            />
                                            <Typography variant="body2" color="white">
                                              Medical Examination
                                            </Typography>
                                          </Box>
                                          
                                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Chip 
                                              size="small" 
                                              label={format(addDays(new Date(booking.departureDate), -14), 'MMM dd')} 
                                              sx={{ 
                                                mr: 2,
                                                bgcolor: 'rgba(140, 158, 255, 0.2)',
                                                color: 'white',
                                                minWidth: 70,
                                              }}
                                            />
                                            <Typography variant="body2" color="white">
                                              Space Training Begins
                                            </Typography>
                                          </Box>
                                          
                                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Chip 
                                              size="small" 
                                              label={format(addDays(new Date(booking.departureDate), -3), 'MMM dd')} 
                                              sx={{ 
                                                mr: 2,
                                                bgcolor: 'rgba(140, 158, 255, 0.2)',
                                                color: 'white',
                                                minWidth: 70,
                                              }}
                                            />
                                            <Typography variant="body2" color="white">
                                              Final Briefing
                                            </Typography>
                                          </Box>
                                          
                                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Chip 
                                              size="small" 
                                              label={format(addDays(new Date(booking.departureDate), -1), 'MMM dd')} 
                                              sx={{ 
                                                mr: 2,
                                                bgcolor: 'rgba(255, 158, 128, 0.2)',
                                                color: '#FF9E80',
                                                minWidth: 70,
                                              }}
                                            />
                                            <Typography variant="body2" color="white">
                                              Spaceport Check-in
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </CardContent>
                              </Box>
                              
                              <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  onClick={() => handleExpandBooking(booking.id)}
                                  sx={{ 
                                    borderColor: 'rgba(140, 158, 255, 0.5)',
                                    color: '#8C9EFF',
                                    borderRadius: 28,
                                    px: 3,
                                    '&:hover': {
                                      borderColor: '#8C9EFF',
                                      background: 'rgba(140, 158, 255, 0.05)',
                                    }
                                  }}
                                >
                                  {expandedBookingId === booking.id ? 'Show Less' : 'Show Details'}
                                </Button>
                                
                                <Box>
                                  <GlowingButton
                                    variant="outlined"
                                    size="small"
                                    sx={{ 
                                      mr: 1,
                                      borderColor: 'rgba(255, 158, 128, 0.5)',
                                      color: '#FF9E80',
                                      '&:hover': {
                                        borderColor: '#FF9E80',
                                        background: 'rgba(255, 158, 128, 0.05)',
                                      }
                                    }}
                                  >
                                    Modify
                                  </GlowingButton>
                                  
                                  <GlowingButton
                                    variant="contained"
                                    size="small"
                                    endIcon={<ArrowForwardIcon />}
                                  >
                                    View Ticket
                                  </GlowingButton>
                                </Box>
                              </CardActions>
                            </GlowingCard>
                          ))}
                      </Box>
                    )}
                  </Box>
                </motion.div>
              )}
              
              {/* Past Journeys */}
              {tabValue === 1 && (
                <motion.div
                  key="past"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      <CalendarTodayIcon sx={{ color: theme.palette.primary.main }} />
                      Your Space Travel History
                    </Typography>
                    
                    {bookings.filter(booking => new Date(booking.departureDate) <= new Date()).length === 0 ? (
                      <GlowingCard 
                        sx={{ 
                          p: 4, 
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <CalendarTodayIcon 
                          sx={{ 
                            fontSize: 60, 
                            color: 'rgba(140, 158, 255, 0.7)',
                            opacity: 0.7
                          }} 
                        />
                        
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          No past journeys
                        </Typography>
                        
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                          Your completed space travels will appear here
                        </Typography>
                      </GlowingCard>
                    ) : (
                      <Grid container spacing={3}>
                        {/* Past bookings would go here with similar cards as upcoming */}
                        {/* We could add more detailed summary cards for past trips */}
                      </Grid>
                    )}
                  </Box>
                </motion.div>
              )}
              
              {/* My Tickets Tab */}
              {tabValue === 2 && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      <ConfirmationNumberIcon sx={{ color: theme.palette.primary.main }} />
                      Your Space Travel Tickets
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {bookings.filter(booking => new Date(booking.departureDate) > new Date()).map((booking, index) => (
                        <Grid 
                          item 
                          xs={12} 
                          md={6} 
                          key={booking.id}
                          component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                          <GlowingCard 
                            sx={{ 
                              height: '100%',
                              position: 'relative',
                              overflow: 'visible'
                            }}
                            hoverable
                          >
                            {/* Ticket hole punch */}
                            <Box 
                              sx={{ 
                                position: 'absolute',
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                bgcolor: 'background.default',
                                top: '50%',
                                left: -15,
                                transform: 'translateY(-50%)',
                                border: '1px solid rgba(140, 158, 255, 0.2)',
                                zIndex: 10,
                              }}
                            />
                            
                            <Box 
                              sx={{ 
                                position: 'absolute',
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                bgcolor: 'background.default',
                                top: '50%',
                                right: -15,
                                transform: 'translateY(-50%)',
                                border: '1px solid rgba(140, 158, 255, 0.2)',
                                zIndex: 10,
                              }}
                            />
                            
                            {/* Ticket header */}
                            <Box 
                              sx={{ 
                                p: 2, 
                                background: 'linear-gradient(90deg, rgba(140, 158, 255, 0.2) 0%, rgba(140, 158, 255, 0.1) 100%)',
                                borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <RocketLaunchIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                                  Space Ticket
                                </Typography>
                              </Box>
                              <Chip 
                                label={`DST-${booking.id}`} 
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                                  color: 'white',
                                }}
                              />
                            </Box>
                            
                            <CardContent>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                  Destination
                                </Typography>
                                <Typography variant="body1" color="white" sx={{ fontWeight: 600 }}>
                                  {booking.destination.name}
                                </Typography>
                              </Box>
                              
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                    Departure
                                  </Typography>
                                  <Typography variant="body1" color="white">
                                    {format(new Date(booking.departureDate), 'MMM dd, yyyy')}
                                  </Typography>
                                  <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                    {format(new Date(booking.departureDate), 'HH:mm')} Hours
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                    Return
                                  </Typography>
                                  <Typography variant="body1" color="white">
                                    {format(new Date(booking.returnDate), 'MMM dd, yyyy')}
                                  </Typography>
                                  <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                    {format(new Date(booking.returnDate), 'HH:mm')} Hours
                                  </Typography>
                                </Grid>
                              </Grid>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                  Seat Class
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AirplaneTicketIcon sx={{ mr: 1, color: '#FF9E80' }} />
                                  <Typography variant="body1" color="white">
                                    {booking.seatClass.name}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                                  Passengers
                                </Typography>
                                <Typography variant="body1" color="white">
                                  {booking.passengers} {booking.passengers > 1 ? 'Travelers' : 'Traveler'}
                                </Typography>
                              </Box>
                              
                              <Box 
                                sx={{ 
                                  position: 'relative',
                                  height: 100,
                                  mt: 3,
                                  mb: 2,
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 2,
                                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                                }}
                              >
                                {/* Mock QR code */}
                                <Box 
                                  sx={{ 
                                    width: 80,
                                    height: 80,
                                    background: `
                                      linear-gradient(90deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1)),
                                      linear-gradient(90deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))
                                    `,
                                    backgroundPosition: '0 0, 10px 10px',
                                    backgroundSize: '20px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '10px solid white'
                                  }}
                                >
                                  <Typography variant="caption" color="black" sx={{ fontWeight: 700, fontSize: 8 }}>
                                    QR CODE
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                            
                            <Box 
                              sx={{ 
                                p: 2, 
                                borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <GlowingButton
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                              >
                                View Full Ticket
                              </GlowingButton>
                            </Box>
                          </GlowingCard>
                        </Grid>
                      ))}
                      
                      {bookings.filter(booking => new Date(booking.departureDate) > new Date()).length === 0 && (
                        <Grid item xs={12}>
                          <GlowingCard 
                            sx={{ 
                              p: 4, 
                              textAlign: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 2
                            }}
                          >
                            <ConfirmationNumberIcon 
                              sx={{ 
                                fontSize: 60, 
                                color: 'rgba(140, 158, 255, 0.7)',
                                opacity: 0.7
                              }} 
                            />
                            
                            <Typography variant="h6" sx={{ color: 'white' }}>
                              No tickets found
                            </Typography>
                            
                            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" paragraph>
                              You don't have any active space travel tickets
                            </Typography>
                            
                            <GlowingButton
                              variant="contained" 
                              component={Link} 
                              to="/booking"
                              startIcon={<RocketLaunchIcon />}
                            >
                              Book Your Space Journey
                            </GlowingButton>
                          </GlowingCard>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </motion.div>
              )}
              
              {/* Journey Stats */}
              {tabValue === 3 && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      <AutoGraphIcon sx={{ color: theme.palette.primary.main }} />
                      Your Space Journey Stats
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {/* Space Miles */}
                      <Grid item xs={12} md={4}>
                        <GlowingCard hoverable>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <SpeedIcon 
                                sx={{ 
                                  mr: 1.5, 
                                  color: theme.palette.primary.main,
                                  opacity: 0.9
                                }} 
                              />
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                Space Miles
                              </Typography>
                            </Box>
                            
                            <Box 
                              sx={{ 
                                textAlign: 'center',
                                py: 2
                              }}
                            >
                              <Typography 
                                component={motion.div}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                variant="h3" 
                                sx={{ 
                                  color: 'white',
                                  fontWeight: 700,
                                  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                  textFillColor: 'transparent',
                                  mb: 2
                                }}
                              >
                                {profile?.totalMiles.toLocaleString()}
                              </Typography>
                              
                              <Box sx={{ display: 'inline-block', position: 'relative' }}>
                                <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                                  Next Tier: {(profile?.totalMiles + 5000000).toLocaleString()} miles
                                </Typography>
                                
                                <Box 
                                  component={motion.div}
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ delay: 0.5, duration: 0.8 }}
                                  sx={{
                                    position: 'absolute',
                                    bottom: -2,
                                    left: 0,
                                    height: 1,
                                    background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 50%, rgba(140, 158, 255, 0) 100%)',
                                  }}
                                />
                              </Box>
                            </Box>
                            
                            <Box sx={{ mt: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                  Progress to Elite Traveler
                                </Typography>
                                <Typography variant="body2" color={theme.palette.primary.main}>
                                  {Math.round((profile?.totalMiles / 20000000) * 100)}%
                                </Typography>
                              </Box>
                              <GlowingProgress
                                variant="determinate"
                                value={Math.round((profile?.totalMiles / 20000000) * 100)}
                              />
                            </Box>
                            
                            <Box 
                              sx={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 3,
                                pt: 2,
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                                Earth to Moon: 238,855 miles
                              </Typography>
                              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                                Earth to Mars: 140M miles
                              </Typography>
                            </Box>
                          </CardContent>
                        </GlowingCard>
                      </Grid>
                      
                      {/* Time in Space */}
                      <Grid item xs={12} md={4}>
                        <GlowingCard hoverable>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <AccessTimeFilledIcon 
                                sx={{ 
                                  mr: 1.5, 
                                  color: '#FF9E80',
                                  opacity: 0.9
                                }} 
                              />
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                Time in Space
                              </Typography>
                            </Box>
                            
                            <Box 
                              sx={{ 
                                textAlign: 'center',
                                py: 2
                              }}
                            >
                              <Typography 
                                component={motion.div}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                variant="h3" 
                                sx={{ 
                                  color: 'white',
                                  fontWeight: 700,
                                  background: 'linear-gradient(90deg, #FFFFFF 0%, #FF9E80 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                  textFillColor: 'transparent',
                                  mb: 2
                                }}
                              >
                                {15 * 24} Hrs
                              </Typography>
                              
                              <Box sx={{ display: 'inline-block', position: 'relative' }}>
                                <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                                  {15} Days Total
                                </Typography>
                                
                                <Box 
                                  component={motion.div}
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ delay: 0.6, duration: 0.8 }}
                                  sx={{
                                    position: 'absolute',
                                    bottom: -2,
                                    left: 0,
                                    height: 1,
                                    background: 'linear-gradient(90deg, rgba(255, 158, 128, 0) 0%, rgba(255, 158, 128, 1) 50%, rgba(255, 158, 128, 0) 100%)',
                                  }}
                                />
                              </Box>
                            </Box>
                            
                            <Box 
                              sx={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 3,
                                pt: 2,
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <Box>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                                  Zero-G Time
                                </Typography>
                                <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                                  {86} Hours
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                                  Lunar Time
                                </Typography>
                                <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                                  {124} Hours
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                                  Orbital Time
                                </Typography>
                                <Typography variant="body1" color="white" sx={{ fontWeight: 500 }}>
                                  {150} Hours
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </GlowingCard>
                      </Grid>
                      
                      {/* Destinations Visited */}
                      <Grid item xs={12} md={4}>
                        <GlowingCard hoverable>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <PublicIcon 
                                sx={{ 
                                  mr: 1.5, 
                                  color: '#BB86FC',
                                  opacity: 0.9
                                }} 
                              />
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                Destinations
                              </Typography>
                            </Box>
                            
                            <Box 
                              sx={{ 
                                textAlign: 'center',
                                py: 2
                              }}
                            >
                              <Box sx={{ position: 'relative' }}>
                                <Typography 
                                  component={motion.div}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.4, duration: 0.5 }}
                                  variant="h3" 
                                  sx={{ 
                                    color: 'white',
                                    fontWeight: 700,
                                    background: 'linear-gradient(90deg, #FFFFFF 0%, #BB86FC 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    textFillColor: 'transparent',
                                    mb: 2
                                  }}
                                >
                                  {profile?.destinations} / 3
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'inline-block', position: 'relative' }}>
                                <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                                  Destinations Visited
                                </Typography>
                                
                                <Box 
                                  component={motion.div}
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ delay: 0.7, duration: 0.8 }}
                                  sx={{
                                    position: 'absolute',
                                    bottom: -2,
                                    left: 0,
                                    height: 1,
                                    background: 'linear-gradient(90deg, rgba(187, 134, 252, 0) 0%, rgba(187, 134, 252, 1) 50%, rgba(187, 134, 252, 0) 100%)',
                                  }}
                                />
                              </Box>
                            </Box>
                            
                            <Box sx={{ mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box 
                                  component={motion.div}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  sx={{ 
                                    width: 24, 
                                    height: 24, 
                                    borderRadius: '50%', 
                                    bgcolor: '#BB86FC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.5
                                  }}
                                >
                                  <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'white' }} />
                                </Box>
                                <Typography variant="body2" color="white">
                                  Orbital Hotel Artemis
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box 
                                  component={motion.div}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  sx={{ 
                                    width: 24, 
                                    height: 24, 
                                    borderRadius: '50%', 
                                    bgcolor: '#BB86FC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.5
                                  }}
                                >
                                  <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'white' }} />
                                </Box>
                                <Typography variant="body2" color="white">
                                  Lunar Gateway Station
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box 
                                  sx={{ 
                                    width: 24, 
                                    height: 24, 
                                    borderRadius: '50%', 
                                    bgcolor: 'rgba(187, 134, 252, 0.2)',
                                    border: '1px dashed rgba(187, 134, 252, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.5
                                  }}
                                >
                                  <CancelIcon sx={{ fontSize: 16, color: 'rgba(187, 134, 252, 0.5)' }} />
                                </Box>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
                                  Mars Base Alpha (Not visited)
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </GlowingCard>
                      </Grid>
                    </Grid>
                    
                    {/* Additional stats */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 600, 
                        mt: 4, 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <StarIcon sx={{ color: theme.palette.primary.main }} />
                      Cosmic Experiences
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6} md={3}>
                        <Box 
                          sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'rgba(22, 27, 51, 0.4)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            border: '1px solid rgba(140, 158, 255, 0.15)',
                            height: '100%',
                          }}
                        >
                          <RestaurantIcon 
                            sx={{ 
                              fontSize: 40, 
                              color: theme.palette.primary.main,
                              mb: 1 
                            }}
                          />
                          <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                            42
                          </Typography>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                            Space Meals Consumed
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box 
                          sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'rgba(22, 27, 51, 0.4)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            border: '1px solid rgba(140, 158, 255, 0.15)',
                            height: '100%',
                          }}
                        >
                          <FilterDramaIcon 
                            sx={{ 
                              fontSize: 40, 
                              color: '#FF9E80',
                              mb: 1 
                            }}
                          />
                          <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                            18
                          </Typography>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                            Zero-G Activities
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box 
                          sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'rgba(22, 27, 51, 0.4)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            border: '1px solid rgba(140, 158, 255, 0.15)',
                            height: '100%',
                          }}
                        >
                          <TerrainIcon 
                            sx={{ 
                              fontSize: 40, 
                              color: '#BB86FC',
                              mb: 1 
                            }}
                          />
                          <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                            3
                          </Typography>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                            Surface Excursions
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box 
                          sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'rgba(22, 27, 51, 0.4)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            border: '1px solid rgba(140, 158, 255, 0.15)',
                            height: '100%',
                          }}
                        >
                          <ShieldIcon 
                            sx={{ 
                              fontSize: 40, 
                              color: '#81c784',
                              mb: 1 
                            }}
                          />
                          <Typography variant="h4" color="white" sx={{ fontWeight: 700 }}>
                            12
                          </Typography>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                            Safety Trainings
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Container>
      
      {/* User menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: 'rgba(22, 27, 51, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(140, 158, 255, 0.15)',
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 10px rgba(140, 158, 255, 0.1)',
          }
        }}
      >
        <MenuItem onClick={handleUserMenuClose} sx={{ minWidth: 200 }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        
        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#FF9E80' }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Notifications menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: 'rgba(22, 27, 51, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(140, 158, 255, 0.15)',
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 10px rgba(140, 158, 255, 0.1)',
            maxWidth: 360,
            maxHeight: 480
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>
        
        {notifications.map((notification) => (
          <MenuItem 
            key={notification.id} 
            onClick={handleNotificationsClose}
            sx={{ 
              borderLeft: notification.read ? 'none' : `3px solid ${theme.palette.primary.main}`,
              bgcolor: notification.read ? 'transparent' : 'rgba(140, 158, 255, 0.05)',
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon>{notification.icon}</ListItemIcon>
            <ListItemText 
              primary={notification.title} 
              secondary={notification.message}
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: 'white',
                fontWeight: notification.read ? 400 : 600,
                sx: { mb: 0.5 }
              }}
              secondaryTypographyProps={{ 
                variant: 'body2',
                color: 'rgba(255, 255, 255, 0.7)',
                sx: { 
                  '& .MuiTypography-root': { 
                    fontSize: '0.8rem',
                    whiteSpace: 'normal'
                  }
                }
              }}
            />
          </MenuItem>
        ))}
        
        <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
          <Button 
            size="small" 
            sx={{ 
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: 'rgba(140, 158, 255, 0.1)'
              }
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default UserDashboard;