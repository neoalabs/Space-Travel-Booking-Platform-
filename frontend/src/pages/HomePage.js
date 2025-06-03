// src/pages/HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, Button, Grid, Card, 
  CardMedia, CardContent, CardActions, useTheme, useMediaQuery 
} from '@mui/material';
import { Link } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExploreIcon from '@mui/icons-material/Explore';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Refs for scroll-based animations
  const heroRef = useRef(null);
  const threeJsContainerRef = useRef(null);
  
  // Scroll progress
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  
  // States
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Initialize Three.js scene
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

  // Featured destinations
  const featuredDestinations = [
    {
      id: 1,
      name: "Lunar Gateway Station",
      description: "Experience the moon's orbit in this state-of-the-art space station with breathtaking views of Earth and lunar landscapes.",
      imageUrl: "/images/lunar-gateway.jpg",
      price: 1200000
    },
    {
      id: 2,
      name: "Mars Base Alpha",
      description: "Be among the first civilians to visit the red planet. Tour the first human settlement on Mars and experience 0.38g gravity.",
      imageUrl: "/images/mars-base.jpg",
      price: 4500000
    },
    {
      id: 4,
      name: "Orbital Hotel Artemis",
      description: "Luxury accommodations in Earth's orbit. Experience zero gravity living with five-star amenities.",
      imageUrl: "/images/orbital-hotel.jpg",
      price: 850000
    },
  ];

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
        delayChildren: 0.2,
      }
    }
  };
  
  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10 
      }
    }
  };
  
  const glowPulse = {
    initial: { boxShadow: '0 0 10px rgba(140, 158, 255, 0.5)' },
    animate: { 
      boxShadow: ['0 0 10px rgba(140, 158, 255, 0.5)', '0 0 20px rgba(140, 158, 255, 0.8)', '0 0 10px rgba(140, 158, 255, 0.5)'],
      transition: { 
        duration: 2, 
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Three.js Background */}
      <Box 
        ref={threeJsContainerRef}
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          '& canvas': {
            display: 'block',
          }
        }}
      />
      
      {/* Background Gradient Overlay */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(5,13,39,0.7) 30%, rgba(15,10,35,0.7) 70%, rgba(21,0,53,0.7) 100%)',
      }} />

      {/* Enhanced Hero Section */}
      <Box 
        ref={heroRef}
        component={motion.div}
        style={{ scale: heroScale }}
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 6, md: 0 },
        }}
      >
        {/* Animated space ship light beam */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
          animate={{ opacity: [0, 0.7, 0], scaleY: [0, 1, 0] }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            repeatDelay: 7
          }}
          sx={{
            position: 'absolute',
            top: '-5%',
            left: { xs: '10%', md: '30%' },
            width: '2px',
            height: '300px',
            background: 'linear-gradient(to bottom, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 0.8) 50%, rgba(140, 158, 255, 0) 100%)',
            boxShadow: '0 0 20px rgba(140, 158, 255, 0.8)',
            zIndex: 1,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Typography
              component="h1"
              variant="h1"
              align="center"
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
                background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 50%, #FF9E80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                textShadow: '0 0 30px rgba(140, 158, 255, 0.5)',
                mb: 2,
                position: 'relative',
                letterSpacing: '-0.02em',
              }}
            >
              DUBAI TO THE STARS
            </Typography>
            
            {/* Animated glow accent */}
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
              sx={{
                height: '3px',
                background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 50%, rgba(140, 158, 255, 0) 100%)',
                mx: 'auto',
                mb: 4,
                maxWidth: '200px',
                borderRadius: '2px',
                boxShadow: '0 0 10px rgba(140, 158, 255, 0.8)',
              }}
            />
          </motion.div>
          
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Typography 
              variant="h5" 
              align="center" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                mb: 7,
                textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
                fontWeight: 300,
                lineHeight: 1.5,
                maxWidth: '800px',
                mx: 'auto',
              }}
              paragraph
            >
              Experience the ultimate space travel adventure with Dubai's first commercial space travel service. 
              Journey to orbital stations, lunar bases, and beyond into the cosmos!
            </Typography>
          </motion.div>
          
          <Box
  component={motion.div}
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
  sx={{ 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 3, sm: 3 },
    width: '100%',
    maxWidth: 'fit-content',
    mx: 'auto',
    my: 2
  }}
>
  <motion.div variants={staggerItem}>
    <Button 
      variant="contained" 
      component={Link} 
      to="/booking"
      size="large"
      startIcon={<RocketLaunchIcon />}
      sx={{ 
        background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
        px: 5,
        py: 1.7,
        borderRadius: 28,
        fontSize: '1rem',
        textTransform: 'none',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(105, 121, 248, 0.5)',
        minWidth: '220px',
        '&:hover': {
          boxShadow: '0 0 30px rgba(105, 121, 248, 0.8)',
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
        },
      }}
    >
      Book Your Journey
    </Button>
  </motion.div>
  
  <motion.div variants={staggerItem}>
    <Button 
      variant="outlined" 
      component={Link} 
      to="/destinations"
      size="large"
      startIcon={<ExploreIcon />}
      sx={{ 
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        color: 'white',
        px: 5,
        py: 1.6,
        borderRadius: 28,
        fontSize: '1rem',
        textTransform: 'none',
        backdropFilter: 'blur(5px)',
        background: 'rgba(255, 255, 255, 0.05)',
        minWidth: '220px',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 2,
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
        }
      }}
    >
      Explore Destinations
    </Button>
  </motion.div>
</Box>
        </Container>
        
        {/* Enhanced scroll indicator */}
        <Box
          component={motion.div}
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop"
          }}
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            zIndex: 5,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, textShadow: '0 0 5px rgba(0, 0, 0, 0.7)' }}>
            Scroll to Explore
          </Typography>
          <Box sx={{ 
            padding: '10px', 
            borderRadius: '50%', 
            background: 'rgba(140, 158, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(140, 158, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(140, 158, 255, 0.2)',
          }}>
            <KeyboardArrowDownIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
          </Box>
        </Box>
      </Box>

      {/* Enhanced Featured Destinations */}
      <Container 
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        sx={{ py: 12 }} 
        maxWidth="lg"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)',
              mb: 5,
            }}
          >
            Featured Destinations
            <Box 
              component={motion.div}
              initial={glowPulse.initial}
              animate={glowPulse.animate}
              sx={{
                position: 'absolute',
                bottom: '-10px',
                left: '25%',
                width: '50%',
                height: '2px',
                background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 50%, rgba(140, 158, 255, 0) 100%)',
              }}
            />
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography 
            variant="body1" 
            align="center" 
            color="rgba(255, 255, 255, 0.8)" 
            paragraph 
            sx={{ 
              mb: 8,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}
          >
            Discover the most exciting space travel experiences launching from Dubai.
            Our cutting-edge spacecraft will take you beyond Earth's atmosphere to explore
            the wonders of our solar system.
          </Typography>
        </motion.div>
        
        <Grid container spacing={4}>
          {featuredDestinations.map((destination, index) => (
            <Grid 
              item 
              key={destination.id} 
              xs={12} 
              sm={6} 
              md={4}
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: 'rgba(16, 20, 42, 0.5)',
                  backdropFilter: 'blur(20px)',
                  border: hoveredCard === destination.id 
                    ? '1px solid rgba(140, 158, 255, 0.6)' 
                    : '1px solid rgba(140, 158, 255, 0.15)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: hoveredCard === destination.id 
                    ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(140, 158, 255, 0.6)' 
                    : '0 8px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === destination.id ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                }}
                onMouseEnter={() => setHoveredCard(destination.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <CardMedia
                    component="img"
                    image={destination.imageUrl}
                    alt={destination.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.7s ease',
                      transform: hoveredCard === destination.id ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(0deg, rgba(16,20,42,1) 0%, rgba(16,20,42,0.7) 50%, rgba(16,20,42,0.3) 100%)',
                  }} />
                  
                  {/* Glowing destination marker */}
                  <Box 
                    component={motion.div}
                    animate={{ 
                      boxShadow: hoveredCard === destination.id 
                        ? ['0 0 15px rgba(140, 158, 255, 0.7)', '0 0 30px rgba(140, 158, 255, 0.9)', '0 0 15px rgba(140, 158, 255, 0.7)']
                        : ['0 0 10px rgba(140, 158, 255, 0.5)', '0 0 20px rgba(140, 158, 255, 0.7)', '0 0 10px rgba(140, 158, 255, 0.5)']
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    sx={{
                      position: 'absolute',
                      top: hoveredCard === destination.id ? '20%' : '30%',
                      right: hoveredCard === destination.id ? '20%' : '25%',
                      width: hoveredCard === destination.id ? '12px' : '8px',
                      height: hoveredCard === destination.id ? '12px' : '8px',
                      borderRadius: '50%',
                      background: '#8C9EFF',
                      transition: 'all 0.5s ease',
                    }}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h3"
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: hoveredCard === destination.id ? '#8C9EFF' : 'white',
                      transition: 'color 0.3s ease',
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    {destination.name}
                    {hoveredCard === destination.id && (
                      <Box 
                        component={motion.div}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.5 }}
                        sx={{
                          position: 'absolute',
                          bottom: '-5px',
                          left: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, #8C9EFF 0%, rgba(140, 158, 255, 0) 100%)',
                        }}
                      />
                    )}
                  </Typography>
                  
                  <Typography 
                    color="rgba(255, 255, 255, 0.8)" 
                    paragraph 
                    sx={{ 
                      mb: 2,
                      lineHeight: 1.6,
                      fontSize: '0.95rem',
                    }}
                  >
                    {destination.description}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#FF9E80',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      mt: 'auto',
                    }}
                  >
                    <Box 
                      component={motion.div}
                      initial={{ opacity: 0, scale: 0, x: -20 }}
                      animate={hoveredCard === destination.id ? 
                        { opacity: 1, scale: 1, x: 0 } : 
                        { opacity: 0, scale: 0, x: -20 }
                      }
                      transition={{ duration: 0.3 }}
                      sx={{ mr: 1, display: 'flex' }}
                    >
                      <RocketLaunchIcon />
                    </Box>
                    {`From $${destination.price.toLocaleString()}`}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    size="medium" 
                    component={Link} 
                    to="/booking"
                    variant={hoveredCard === destination.id ? "contained" : "outlined"}
                    sx={{
                      borderRadius: 28,
                      transition: 'all 0.3s ease',
                      bgcolor: hoveredCard === destination.id ? 'primary.main' : 'transparent',
                      borderColor: 'rgba(140, 158, 255, 0.5)',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: hoveredCard === destination.id ? 'primary.dark' : 'rgba(140, 158, 255, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 5px 15px rgba(140, 158, 255, 0.3)',
                      }
                    }}
                  >
                    Book Now
                  </Button>
                  
                  <Button 
                    size="medium" 
                    component={Link} 
                    to="/destinations"
                    sx={{
                      color: 'white',
                      borderRadius: 28,
                      ml: 2,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </CardActions>
                
                {/* Interactive glow effect on hover */}
                {hoveredCard === destination.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      borderRadius: 4,
                      boxShadow: 'inset 0 0 0 1px rgba(140, 158, 255, 0.5)',
                      zIndex: 10,
                    }} />
                  </motion.div>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Enhanced call to action section */}
      <Container 
        maxWidth="md" 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 15 }}
      >
        <Box
          sx={{
            background: 'rgba(16, 20, 42, 0.4)',
            backdropFilter: 'blur(20px)',
            borderRadius: 6,
            border: '1px solid rgba(140, 158, 255, 0.4)',
            p: { xs: 4, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center'
          }}
        >
          {/* Advanced background glow effect */}
          <Box
            component={motion.div}
            animate={{ 
              background: [
                'radial-gradient(ellipse at center, rgba(140, 158, 255, 0.15) 0%, rgba(140, 158, 255, 0) 70%)',
                'radial-gradient(ellipse at center, rgba(187, 134, 252, 0.15) 0%, rgba(187, 134, 252, 0) 70%)',
                'radial-gradient(ellipse at center, rgba(255, 158, 128, 0.15) 0%, rgba(255, 158, 128, 0) 70%)',
                'radial-gradient(ellipse at center, rgba(140, 158, 255, 0.15) 0%, rgba(140, 158, 255, 0) 70%)',
              ]
            }}
            transition={{ 
              background: { duration: 8, repeat: Infinity }
            }}
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: -1,
            }}
          />
          
          {/* Animated star particles */}
          {[...Array(10)].map((_, i) => (
            <Box 
              key={`cta-star-${i}`}
              component={motion.div}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 3 + (i % 3), 
                repeat: Infinity,
                repeatType: 'loop',
                ease: "easeInOut",
                delay: i * 0.3
              }}
              sx={{
                position: 'absolute',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'white',
                top: `${20 + (i * 5)}%`,
                left: `${10 + (i * 8)}%`,
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
              }}
            />
          ))}
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                position: 'relative',
                mb: 4,
                background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Ready to Travel to Space?
              <Box 
                component={motion.div}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.3, duration: 0.8 }}
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 50%, rgba(140, 158, 255, 0) 100%)',
                  boxShadow: '0 0 5px rgba(140, 158, 255, 0.7)',
                }}
              />
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 6, 
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 500,
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              Begin your journey beyond Earth and explore the wonders of our solar system.
              Book your space adventure today.
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link} 
              to="/booking"
              sx={{
                background: 'linear-gradient(90deg, #FF9E80 0%, #FF80AB 100%)',
                px: 6,
                py: 1.5,
                borderRadius: 28,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 0 20px rgba(255, 158, 128, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 0 30px rgba(255, 158, 128, 0.7)',
                  background: 'linear-gradient(90deg, #FF9E80 0%, #FF80AB 100%)',
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                  animation: 'shimmer 3s infinite',
                  '@keyframes shimmer': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' }
                  }
                }
              }}
            >
              Begin Your Space Journey
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;