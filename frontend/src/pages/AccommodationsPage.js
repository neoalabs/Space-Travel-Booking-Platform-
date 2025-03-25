// src/pages/AccommodationsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, 
  Tabs, Tab, Button, Chip, Rating, Divider, CircularProgress,
  useTheme, alpha, IconButton, Paper, Tooltip, useMediaQuery, Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Icons
import HotelIcon from '@mui/icons-material/Hotel';
import StarIcon from '@mui/icons-material/Star';
import ShowerIcon from '@mui/icons-material/Shower';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WindowIcon from '@mui/icons-material/Window';
import SpaIcon from '@mui/icons-material/Spa';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PublicIcon from '@mui/icons-material/Public';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import KingBedIcon from '@mui/icons-material/KingBed';
import SecurityIcon from '@mui/icons-material/Security';

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
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 15px rgba(140, 158, 255, 0.2)',
    border: '1px solid rgba(140, 158, 255, 0.3)',
  }
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  fontWeight: 700,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
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

// Sample data for accommodations
const accommodationsData = {
  orbitHotel: [
    {
      id: 1,
      name: "Standard Gravity Pod",
      description: "Experience the perfect balance of comfort and value in our Standard Gravity Pods. These efficient accommodations feature artificial gravity, ensuring a comfortable Earth-like experience while offering spectacular orbital views.",
      price: 85000,
      perNight: true,
      rating: 4.2,
      size: "22 sq meters",
      capacity: "2 travelers",
      imageUrl: "/images/standard-pod.jpg",
      features: [
        { icon: <ShowerIcon />, name: "Private Bathroom" },
        { icon: <RestaurantIcon />, name: "Meal Delivery" },
        { icon: <WindowIcon />, name: "Earth View Window" },
        { icon: <WifiIcon />, name: "Space Internet" },
        { icon: <KingBedIcon />, name: "Comfort Sleep System" },
        { icon: <SecurityIcon />, name: "24/7 Life Support" }
      ],
      description2: "The Standard Gravity Pod provides all essential amenities required for a comfortable stay in Earth's orbit. Each pod includes a revolutionary Comfort Sleep System designed for zero-G to Earth-gravity transitions, automated climate control, and daily automated cleaning service. The integrated entertainment system offers a library of space documentaries and Earth observation feeds."
    },
    {
      id: 2,
      name: "Deluxe Orbital Suite",
      description: "Indulge in unparalleled luxury with our Deluxe Orbital Suites. These spacious accommodations feature 180-degree panoramic Earth views, personalized service, and premium amenities that redefine luxury in space.",
      price: 215000,
      perNight: true,
      rating: 4.8,
      size: "45 sq meters",
      capacity: "2-4 travelers",
      imageUrl: "/images/deluxe-suite.jpg",
      features: [
        { icon: <ShowerIcon />, name: "Deluxe Shower" },
        { icon: <RestaurantIcon />, name: "Premium Dining" },
        { icon: <WindowIcon />, name: "Panoramic Views" },
        { icon: <WifiIcon />, name: "High-Speed Space Internet" },
        { icon: <LiveTvIcon />, name: "Entertainment System" },
        { icon: <SpaIcon />, name: "Zero-G Spa Access" },
        { icon: <LocalBarIcon />, name: "In-Suite Bar" },
        { icon: <FitnessCenterIcon />, name: "Fitness Area" },
        { icon: <KingBedIcon />, name: "Premium Sleep Pod" },
        { icon: <SecurityIcon />, name: "Enhanced Life Support" }
      ],
      description2: "The Deluxe Orbital Suite represents the pinnacle of space hospitality. With separate living and sleeping areas, these suites offer flexibility for families or small groups. The panoramic observation lounge provides breathtaking views of Earth and celestial phenomena. Suite guests enjoy priority scheduling for all hotel activities, exclusive access to the Zero-G recreation area, and personal concierge service to customize every aspect of their stay."
    },
    {
      id: 3,
      name: "Zero-G Experience Pod",
      description: "Embrace the unique sensation of weightlessness in our specialized Zero-G Pods. These innovative accommodations feature variable gravity controls, allowing you to experience authentic zero gravity or adjust to your comfort level.",
      price: 125000,
      perNight: true,
      rating: 4.5,
      size: "30 sq meters",
      capacity: "2 travelers",
      imageUrl: "/images/zero-g-pod.jpg",
      features: [
        { icon: <ShowerIcon />, name: "Zero-G Shower System" },
        { icon: <RestaurantIcon />, name: "Floating Dining" },
        { icon: <WindowIcon />, name: "Observation Port" },
        { icon: <WifiIcon />, name: "Space Internet" },
        { icon: <ViewInArIcon />, name: "Gravity Controls" },
        { icon: <LiveTvIcon />, name: "Entertainment System" },
        { icon: <KingBedIcon />, name: "Adaptable Sleep System" },
        { icon: <SecurityIcon />, name: "Enhanced Life Support" }
      ],
      description2: "The Zero-G Experience Pod is designed for those seeking the authentic space experience. The revolutionary variable gravity system allows guests to switch between Earth-normal gravity, Lunar gravity (1/6th Earth), Martian gravity (1/3rd Earth), or complete weightlessness at the touch of a button. Special training is provided for zero-G movement and daily activities. The pod includes specialized fixtures and systems designed for use in multiple gravity environments."
    }
  ],
  lunarBase: [
    {
      id: 4,
      name: "Lunar Surface Habitat",
      description: "Experience life on the lunar surface in our sustainable habitats. Built into lava tubes for natural radiation protection, these accommodations offer comfortable living with 1/6th Earth's gravity and stunning views of the lunar landscape.",
      price: 175000,
      perNight: true,
      rating: 4.6,
      size: "35 sq meters",
      capacity: "2 travelers",
      imageUrl: "/images/lunar-habitat.jpg",
      features: [
        { icon: <ShowerIcon />, name: "Water Recycling Shower" },
        { icon: <RestaurantIcon />, name: "Lunar Dining" },
        { icon: <WindowIcon />, name: "Surface Viewport" },
        { icon: <WifiIcon />, name: "Lunar Network" },
        { icon: <KingBedIcon />, name: "Low-G Sleep System" },
        { icon: <SecurityIcon />, name: "Advanced Life Support" }
      ],
      description2: "The Lunar Surface Habitat combines frontier living with essential comforts. Each habitat is equipped with a small hydroponic garden growing fresh herbs and vegetables, an Earth observation telescope, and an airlock for supervised lunar surface excursions in pressurized suits. The unique 1/6th gravity environment offers guests the ability to experience low-gravity recreation while maintaining comfortable living conditions."
    }
  ],
  marsBase: [
    {
      id: 5,
      name: "Martian Pioneer Suite",
      description: "Be among the first humans to experience living on the red planet. Our Martian Pioneer Suites are designed for comfort in the 0.38g environment, with reinforced construction to withstand the harsh Martian conditions.",
      price: 325000,
      perNight: true,
      rating: 4.7,
      size: "40 sq meters",
      capacity: "2 travelers",
      imageUrl: "/images/mars-suite.jpg",
      features: [
        { icon: <ShowerIcon />, name: "Water Conserving System" },
        { icon: <RestaurantIcon />, name: "Mars Colony Dining" },
        { icon: <WindowIcon />, name: "Martian Landscape View" },
        { icon: <WifiIcon />, name: "Delayed Earth Communications" },
        { icon: <KingBedIcon />, name: "Mars-G Comfort Bed" },
        { icon: <SecurityIcon />, name: "Critical Life Support" }
      ],
      description2: "The Martian Pioneer Suite represents the frontier of human space exploration. Each suite includes a personal Mars rover excursion, allowing guests to explore the immediate surroundings under staff supervision. The habitat maintains Earth-like atmospheric pressure and composition while allowing guests to experience the unique 0.38g Martian gravity. Windows are specially designed to filter the harsh radiation while providing stunning views of the rusty Martian landscape."
    }
  ],
};

// Testimonials from "space travelers"
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Zero-G Experience Pod Guest",
    avatar: "/avatars/guest1.jpg",
    text: "The variable gravity controls in the Zero-G Pod made for an unforgettable experience. Floating while watching Earth pass below is something I'll never forget. Worth every penny!",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Deluxe Orbital Suite Guest",
    avatar: "/avatars/guest2.jpg",
    text: "The panoramic views from our Deluxe Suite were mind-blowing. We could see thunderstorms over the Pacific and the northern lights in the same day. The staff attention to detail was impeccable.",
    rating: 5
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Lunar Surface Habitat Guest",
    avatar: "/avatars/guest3.jpg",
    text: "Walking in 1/6th gravity while looking up at Earth hanging in the black sky was a spiritual experience. The Lunar Habitat was cozy and well-designed - I didn't want to leave!",
    rating: 4
  }
];

const AccommodationsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs
  const threeJsContainerRef = useRef(null);
  
  // States
  const [tabValue, setTabValue] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [stars, setStars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get accommodation data based on selected tab
  const destinations = ['orbitHotel', 'lunarBase', 'marsBase'];
  const currentAccommodations = accommodationsData[destinations[tabValue]] || [];
  
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
    
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setExpandedId(null); // Reset expanded card when changing tabs
  };
  
  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
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
  
  // Destination descriptions
  const destinationDescriptions = {
    orbitHotel: "Experience luxury in Earth's orbit at the Artemis Orbital Hotel, featuring spectacular Earth views, zero-gravity recreation areas, and premium accommodations. Just one day's journey from Earth.",
    lunarBase: "Our Lunar Gateway Station offers unique accommodations built into natural lava tubes for radiation protection. Experience 1/6th Earth's gravity and stunning views of both the lunar landscape and Earth.",
    marsBase: "Be among the first humans to stay on the Red Planet at Mars Base Alpha. Our pioneering accommodations offer comfort in the harsh Martian environment, with guided surface excursions included.",
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
      
      {/* Content Container */}
      <Container 
        maxWidth="xl" 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        {isLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              my: 15,
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
              Preparing Accommodations
            </Typography>
            
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              Loading cosmic comfort options...
            </Typography>
          </Box>
        ) : (
          <>
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
                Space Accommodations
                
                {/* Decorative icon */}
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
                    top: { xs: '-15px', sm: '-20px', md: '-30px' },
                  }}
                >
                  <HotelIcon 
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
                Experience unparalleled luxury beyond Earth with our range of space accommodations. From orbital hotels to lunar habitats and Martian outposts, discover your perfect cosmic retreat.
              </Typography>
            </Box>
            
            <Paper 
              sx={{ 
                width: '100%', 
                mb: 4,
                background: 'rgba(16, 20, 42, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(140, 158, 255, 0.2)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                centered
                sx={{ 
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 1.5,
                    background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                    boxShadow: '0 0 10px rgba(140, 158, 255, 0.7)',
                  }
                }}
              >
                <StyledTab 
                  label="Orbital Hotel" 
                  icon={<PublicIcon />} 
                  iconPosition="start" 
                />
                <StyledTab 
                  label="Lunar Base" 
                  icon={<RocketLaunchIcon />} 
                  iconPosition="start" 
                />
                <StyledTab 
                  label="Mars Base" 
                  icon={<ViewInArIcon />} 
                  iconPosition="start" 
                />
              </Tabs>
            </Paper>
            
            <Box 
              component={motion.div}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              sx={{ 
                mb: 6,
                p: 3,
                background: 'rgba(22, 27, 51, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(140, 158, 255, 0.15)',
              }}
            >
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  color: 'white',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {tabValue === 0 && <PublicIcon sx={{ color: theme.palette.primary.main }} />}
                {tabValue === 1 && <RocketLaunchIcon sx={{ color: theme.palette.primary.main }} />}
                {tabValue === 2 && <ViewInArIcon sx={{ color: theme.palette.primary.main }} />}
                {tabValue === 0 && "Artemis Orbital Hotel"}
                {tabValue === 1 && "Lunar Gateway Station"}
                {tabValue === 2 && "Mars Base Alpha"}
              </Typography>
              
              <Typography 
                variant="body1" 
                color="rgba(255, 255, 255, 0.8)"
                sx={{ 
                  mb: 2,
                  lineHeight: 1.7
                }}
              >
                {destinationDescriptions[destinations[tabValue]]}
              </Typography>
              
              {/* Destination-specific highlights */}
              <Box 
                component={motion.div}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2, 
                  mt: 3,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                {tabValue === 0 && (
                  <>
                    <FeatureChip icon={<StarIcon />} label="Luxury Zero-G Spa" />
                    <FeatureChip icon={<RestaurantIcon />} label="Gourmet Space Cuisine" />
                    <FeatureChip icon={<WindowIcon />} label="360° Earth Views" />
                    <FeatureChip icon={<WifiIcon />} label="High-Speed Space Internet" />
                  </>
                )}
                
                {tabValue === 1 && (
                  <>
                    <FeatureChip icon={<StarIcon />} label="Lunar Surface Excursions" />
                    <FeatureChip icon={<RestaurantIcon />} label="Hydroponic Gardens" />
                    <FeatureChip icon={<WindowIcon />} label="Earth Rise Viewing" />
                    <FeatureChip icon={<PriceCheckIcon />} label="Lunar Souvenir Shop" />
                  </>
                )}
                
                {tabValue === 2 && (
                  <>
                    <FeatureChip icon={<StarIcon />} label="Mars Rover Excursions" />
                    <FeatureChip icon={<RestaurantIcon />} label="Martian Agriculture Lab" />
                    <FeatureChip icon={<WindowIcon />} label="Phobos & Deimos Viewing" />
                    <FeatureChip icon={<PriceCheckIcon />} label="Pioneer Certification" />
                  </>
                )}
              </Box>
            </Box>
            
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mb: 4, 
                color: 'white',
                fontWeight: 600,
                pl: 1,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
              }}
            >
              Available Accommodations
            </Typography>
            
            <Grid container spacing={4} component={motion.div} variants={staggerContainer} initial="hidden" animate="visible">
              {currentAccommodations.map((accommodation) => (
                <Grid 
                  item 
                  xs={12} 
                  md={6} 
                  lg={4} 
                  key={accommodation.id}
                  component={motion.div}
                  variants={fadeInUp}
                >
                  <GlowingCard>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                      <CardMedia
                        component="div"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${accommodation.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'brightness(0.8)'
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
                      
                      {/* Price tag */}
                      <Box 
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'rgba(11, 13, 27, 0.85)',
                          color: 'white',
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(140, 158, 255, 0.3)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                          ${accommodation.price.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                          {accommodation.perNight ? 'per night' : 'per stay'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ pt: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <HotelIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'white' }}>
                          {accommodation.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating 
                          value={accommodation.rating} 
                          precision={0.5} 
                          readOnly 
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: theme.palette.primary.main,
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                          {accommodation.rating.toFixed(1)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                          {accommodation.size}
                        </Typography>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                          {accommodation.capacity}
                        </Typography>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="rgba(255, 255, 255, 0.8)" 
                        sx={{ 
                          minHeight: { xs: 'auto', md: '100px' },
                          mb: 2 
                        }}
                      >
                        {accommodation.description}
                      </Typography>
                      
                      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      
                      <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'white' }}>
                        Key Features:
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {accommodation.features.slice(0, 5).map((feature, index) => (
                          <Tooltip key={index} title={feature.name}>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: theme.palette.primary.main,
                                bgcolor: 'rgba(140, 158, 255, 0.1)',
                                '&:hover': {
                                  bgcolor: 'rgba(140, 158, 255, 0.2)',
                                }
                              }}
                            >
                              {feature.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                        
                        {accommodation.features.length > 5 && (
                          <Tooltip title={`+${accommodation.features.length - 5} more features`}>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                                }
                              }}
                            >
                              +{accommodation.features.length - 5}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      
                      {/* Expandable details */}
                      <AnimatePresence>
                        {expandedId === accommodation.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Box sx={{ mt: 2, mb: 3 }}>
                              <Typography 
                                variant="body2" 
                                color="rgba(255, 255, 255, 0.7)"
                                paragraph
                              >
                                {accommodation.description2}
                              </Typography>
                              
                              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'white' }}>
                                All Features:
                              </Typography>
                              
                              <Grid container spacing={1}>
                                {accommodation.features.map((feature, index) => (
                                  <Grid item xs={6} key={index}>
                                    <Box 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1,
                                        py: 0.5
                                      }}
                                    >
                                      <Box sx={{ color: theme.palette.primary.main }}>
                                        {feature.icon}
                                      </Box>
                                      <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                                        {feature.name}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                          variant="text"
                          onClick={() => toggleExpanded(accommodation.id)}
                          endIcon={expandedId === accommodation.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          sx={{ 
                            color: theme.palette.primary.main,
                            textTransform: 'none'
                          }}
                        >
                          {expandedId === accommodation.id ? 'Show Less' : 'Show More'}
                        </Button>
                        
                        <GlowingButton
                          variant="contained"
                          component={Link}
                          to="/booking"
                          endIcon={<ArrowForwardIcon />}
                          sx={{ borderRadius: 28 }}
                        >
                          Book Now
                        </GlowingButton>
                      </Box>
                    </CardContent>
                  </GlowingCard>
                </Grid>
              ))}
            </Grid>
            
            {/* Testimonials Section */}
            <Box
              component={motion.div}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              sx={{ 
                mt: 10, 
                mb: 6,
                p: { xs: 3, md: 6 },
                background: 'rgba(22, 27, 51, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(140, 158, 255, 0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background glow */}
              <Box
                component={motion.div}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                sx={{
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  background: 'radial-gradient(circle, rgba(140, 158, 255, 0.15) 0%, rgba(140, 158, 255, 0) 70%)',
                  filter: 'blur(30px)',
                  zIndex: 0
                }}
              />
              
              <Typography 
                variant="h4" 
                component="h2" 
                align="center"
                sx={{ 
                  mb: 6, 
                  color: 'white',
                  position: 'relative'
                }}
              >
                <FormatQuoteIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: alpha(theme.palette.primary.main, 0.5),
                    position: 'absolute',
                    left: { xs: -30, md: -50 },
                    top: -20
                  }} 
                />
                Traveler Experiences
              </Typography>
              
              <Grid container spacing={4}>
                {testimonials.map((testimonial, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    md={4} 
                    key={testimonial.id}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.5 }}
                  >
                    <Paper 
                      sx={{ 
                        p: 3, 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(16, 20, 42, 0.5)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 3,
                        border: '1px solid rgba(140, 158, 255, 0.15)',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            alt={testimonial.name} 
                            src={testimonial.avatar}
                            sx={{ 
                              width: 48, 
                              height: 48,
                              border: `2px solid ${theme.palette.primary.main}` 
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                              {testimonial.name}
                            </Typography>
                            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                              {testimonial.role}
                            </Typography>
                          </Box>
                        </Box>
                        <Rating value={testimonial.rating} readOnly size="small" />
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="rgba(255, 255, 255, 0.8)"
                        sx={{ 
                          flex: 1,
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          position: 'relative',
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            {/* Call to Action Section */}
            <Box 
              component={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              sx={{ 
                textAlign: 'center',
                py: 8,
                px: { xs: 2, md: 10 },
                position: 'relative'
              }}
            >
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
              
              <GradientText 
                variant="h4" 
                component="h2"
                sx={{ mb: 3 }}
              >
                Ready to Experience Space?
              </GradientText>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: 800,
                  mx: 'auto',
                  fontWeight: 300
                }}
              >
                Book your cosmic getaway today and be among the first travelers to experience these revolutionary space accommodations.
              </Typography>
              
              <GlowingButton
                variant="contained"
                component={Link}
                to="/booking"
                size="large"
                endIcon={<RocketLaunchIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 28,
                  background: 'linear-gradient(90deg, #FF9E80 0%, #FF6E40 100%)',
                  boxShadow: '0 4px 14px rgba(255, 110, 64, 0.5)'
                }}
              >
                Book Your Space Journey
              </GlowingButton>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default AccommodationsPage;