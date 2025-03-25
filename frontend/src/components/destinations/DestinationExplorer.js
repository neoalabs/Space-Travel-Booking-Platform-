// src/components/destinations/DestinationExplorer.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Button, useTheme, IconButton, 
  Paper, Grid, Tooltip, Chip, alpha, Divider,
  Container, useMediaQuery, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PublicIcon from '@mui/icons-material/Public';
import TerrainIcon from '@mui/icons-material/Terrain';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import ExploreIcon from '@mui/icons-material/Explore';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShieldIcon from '@mui/icons-material/Shield';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const DestinationExplorer = ({ destinations, onBookingSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Refs
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // States
  const [activeDestination, setActiveDestination] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [planetRotations, setPlanetRotations] = useState({});
  const [showOrbits, setShowOrbits] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentScale, setCurrentScale] = useState(1);

  // Canvas animation controls
  const controls = useAnimation();
  
  // Initialize planet rotation speeds
  useEffect(() => {
    const rotations = {};
    destinations.forEach((dest, index) => {
      rotations[dest.id] = (0.2 + Math.random() * 0.3) * (index % 2 === 0 ? 1 : -1);
    });
    setPlanetRotations(rotations);
  }, [destinations]);
  
  // Solar system canvas setup
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Adjust for device pixel ratio for sharper rendering
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(pixelRatio, pixelRatio);
    
    // Center of the solar system
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Orbit radii
    const orbitRadii = destinations.map((_, index) => {
      // Calculate orbit radius based on index
      return 60 + (index * 60); // Increasing orbit radius for each planet
    });
    
    // Planet positions
    const planetPositions = {};
    destinations.forEach((dest, index) => {
      // Initial angle for each planet (distribute evenly around the sun)
      const angle = (index / destinations.length) * 2 * Math.PI;
      
      // Calculate initial positions
      const x = centerX + orbitRadii[index] * Math.cos(angle);
      const y = centerY + orbitRadii[index] * Math.sin(angle);
      
      planetPositions[dest.id] = { x, y, angle, orbitRadius: orbitRadii[index] };
    });
    
    // Clear loading state
    setTimeout(() => setLoading(false), 1000);
    
    // Animation loop
    let animationFrameId;
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw sun at the center
      drawSun(ctx, centerX, centerY);
      
      // Draw orbits
      if (showOrbits) {
        destinations.forEach((_, index) => {
          drawOrbit(ctx, centerX, centerY, orbitRadii[index]);
        });
      }
      
      // Update planet positions and draw planets
      destinations.forEach((dest, index) => {
        const position = planetPositions[dest.id];
        
        // Update angle based on rotation speed
        position.angle += 0.002 * planetRotations[dest.id];
        
        // Calculate new position
        position.x = centerX + position.orbitRadius * Math.cos(position.angle);
        position.y = centerY + position.orbitRadius * Math.sin(position.angle);
        
        // Draw planet
        drawPlanet(
          ctx, 
          position.x, 
          position.y, 
          12 + Math.min(20, index * 4),  // Size increases slightly for outer planets
          dest, 
          dest.id === (activeDestination?.id || 0)
        );
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [destinations, activeDestination, showOrbits, planetRotations]);
  
  // Helper functions for drawing
  const drawSun = (ctx, x, y) => {
    // Sun glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
    gradient.addColorStop(0, 'rgba(255, 200, 64, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 160, 64, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 140, 64, 0)');
    
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Sun core
    const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
    coreGradient.addColorStop(0, '#FFEB3B');
    coreGradient.addColorStop(1, '#FF9800');
    
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();
    
    // Sun surface details (small eruptions)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const eruption = Math.random() * 5 + 2;
      
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle) * (25 + eruption), 
        y + Math.sin(angle) * (25 + eruption), 
        eruption, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 235, 59, 0.8)';
      ctx.fill();
    }
  };
  
  const drawOrbit = (ctx, centerX, centerY, radius) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.setLineDash([5, 15]);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
  };
  
  const drawPlanet = (ctx, x, y, radius, destination, isActive) => {
    // Draw planet glow for active planet
    if (isActive) {
      ctx.beginPath();
      ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140, 158, 255, 0.2)';
      ctx.fill();
    }
    
    // Planet base
    let planetColor;
    switch (destination.type) {
      case 'Space Station':
        planetColor = '#8C9EFF'; // Blue for space stations
        break;
      case 'Planetary Base':
        planetColor = '#FF9E80'; // Orange/red for Mars
        break;
      default:
        planetColor = '#81C784'; // Green for other types
    }
    
    // Planet gradient
    const planetGradient = ctx.createRadialGradient(x - radius / 3, y - radius / 3, 0, x, y, radius);
    planetGradient.addColorStop(0, lightenColor(planetColor, 20));
    planetGradient.addColorStop(0.5, planetColor);
    planetGradient.addColorStop(1, darkenColor(planetColor, 20));
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = planetGradient;
    ctx.fill();
    
    // Add some detail to planets
    if (destination.type === 'Planetary Base') {
      // Mars-like surface details
      for (let i = 0; i < 5; i++) {
        const craterRadius = radius * (Math.random() * 0.2 + 0.1);
        const craterX = x + (Math.random() * radius * 0.8 - radius * 0.4);
        const craterY = y + (Math.random() * radius * 0.8 - radius * 0.4);
        
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150, 80, 50, 0.7)';
        ctx.fill();
      }
    } else if (destination.type === 'Space Station') {
      // Space station details (ring)
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 1.2, radius * 0.3, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw planet name if active
    if (isActive) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(destination.name.split(' ')[0], x, y - radius - 15);
    }
  };
  
  // Color helper functions
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(
      0x1000000 + 
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
  };
  
  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return `#${(
      0x1000000 + 
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
  };
  
  // Handlers
  const handlePlanetClick = (destination) => {
    setActiveDestination(destination);
    setDetailsOpen(true);
    
    // Run animation to zoom in slightly
    controls.start({
      scale: 1.05,
      transition: { duration: 0.5, ease: "easeInOut" }
    });
    setCurrentScale(1.05);
  };
  
  const handleDetailsClose = () => {
    setDetailsOpen(false);
    
    // Run animation to zoom back out
    controls.start({
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" }
    });
    setCurrentScale(1);
  };
  
  const handleBookNow = (destination) => {
    if (onBookingSelect) {
      onBookingSelect(destination);
    }
  };
  
  const handleNextDestination = () => {
    if (!activeDestination) return;
    
    const currentIndex = destinations.findIndex(d => d.id === activeDestination.id);
    const nextIndex = (currentIndex + 1) % destinations.length;
    setActiveDestination(destinations[nextIndex]);
  };
  
  const handlePrevDestination = () => {
    if (!activeDestination) return;
    
    const currentIndex = destinations.findIndex(d => d.id === activeDestination.id);
    const prevIndex = (currentIndex - 1 + destinations.length) % destinations.length;
    setActiveDestination(destinations[prevIndex]);
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const slideIn = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  const zoomIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Planet name display handler
  const displayPlanetType = (type) => {
    switch (type) {
      case 'Space Station':
        return (
          <Chip 
            icon={<PublicIcon />} 
            label="Orbital Station" 
            size="small"
            sx={{ 
              bgcolor: alpha('#8C9EFF', 0.2),
              color: '#8C9EFF',
              border: '1px solid rgba(140, 158, 255, 0.3)',
            }}
          />
        );
      case 'Planetary Base':
        return (
          <Chip 
            icon={<TerrainIcon />} 
            label="Planetary Base" 
            size="small"
            sx={{ 
              bgcolor: alpha('#FF9E80', 0.2),
              color: '#FF9E80',
              border: '1px solid rgba(255, 158, 128, 0.3)',
            }}
          />
        );
      default:
        return (
          <Chip 
            icon={<ViewInArIcon />} 
            label={type} 
            size="small"
            sx={{ 
              bgcolor: alpha('#81C784', 0.2),
              color: '#81C784',
              border: '1px solid rgba(129, 199, 132, 0.3)',
            }}
          />
        );
    }
  };
  
  return (
    <Box 
      ref={containerRef}
      sx={{ 
        position: 'relative',
        width: '100%',
        height: { xs: 500, md: 600, lg: 700 },
        background: 'linear-gradient(180deg, rgba(11, 13, 27, 0.9) 0%, rgba(16, 20, 42, 0.8) 100%)',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 100px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(140, 158, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background stars */}
      {Array.from({ length: 100 }).map((_, i) => (
        <Box
          key={`star-${i}`}
          sx={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            borderRadius: '50%',
            backgroundColor: 'white',
            opacity: Math.random() * 0.7 + 0.3,
            animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate ${Math.random() * 5}s`,
            '@keyframes twinkle': {
              '0%': { opacity: Math.random() * 0.7 + 0.3, boxShadow: '0 0 0 rgba(255, 255, 255, 0)' },
              '100%': { opacity: Math.random() * 0.3 + 0.1, boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)' }
            },
          }}
        />
      ))}
      
      {/* Loading indicator */}
      {loading && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(11, 13, 27, 0.8)',
            zIndex: 10,
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
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#8C9EFF',
              borderBottomColor: 'rgba(140, 158, 255, 0.3)',
              mb: 2
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
                width: 40,
                height: 40,
                top: '50%',
                left: '50%',
                marginTop: -20,
                marginLeft: -20,
                borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: 'rgba(255, 158, 128, 0.7)',
                borderBottomColor: 'rgba(255, 158, 128, 0.2)',
              }}
            />
          </Box>
        </Box>
      )}
      
      {/* Title and instructions */}
      <Box
        component={motion.div}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        sx={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 5,
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'white',
            fontWeight: 600,
            mb: 1,
            textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }}
        >
          Cosmic Destinations Explorer
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: 500,
            mx: 'auto',
            px: 2,
            textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }}
        >
          Journey through our solar system and discover exciting space travel destinations. 
          Click on a destination to learn more.
        </Typography>
      </Box>
      
      {/* Canvas container with zoom animation */}
      <Box 
        component={motion.div}
        animate={controls}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onClick={(e) => {
            // Convert click position to canvas coordinates
            const rect = e.target.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (e.target.width / rect.width);
            const y = (e.clientY - rect.top) * (e.target.height / rect.height);
            
            // Find the closest planet to the click position
            const centerX = e.target.width / 2;
            const centerY = e.target.height / 2;
            
            // Check if clicked on sun (center)
            const distToCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            if (distToCenter < 30) {
              // Clicked on sun - deselect
              setActiveDestination(null);
              setDetailsOpen(false);
              return;
            }
            
            // Find closest planet
            let closestDest = null;
            let minDist = Infinity;
            
            destinations.forEach((dest, index) => {
              const angle = (index / destinations.length) * 2 * Math.PI;
              const orbitRadius = 60 + (index * 60);
              const planetX = centerX + orbitRadius * Math.cos(angle);
              const planetY = centerY + orbitRadius * Math.sin(angle);
              
              const dist = Math.sqrt(Math.pow(x - planetX, 2) + Math.pow(y - planetY, 2));
              if (dist < 30 && dist < minDist) {
                minDist = dist;
                closestDest = dest;
              }
            });
            
            if (closestDest) {
              handlePlanetClick(closestDest);
            }
          }}
          style={{
            cursor: 'pointer',
          }}
        />
        
        {/* Planet mouseover tooltips would go here */}
      </Box>
      
      {/* Controls */}
      <Box
        component={motion.div}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          zIndex: 5,
        }}
      >
        <Tooltip title="Toggle Orbit Paths">
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowOrbits(!showOrbits)}
            sx={{
              borderRadius: 5,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            {showOrbits ? 'Hide Orbits' : 'Show Orbits'}
          </Button>
        </Tooltip>
        
        <Tooltip title="Reset View">
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setActiveDestination(null);
              setDetailsOpen(false);
              controls.start({
                scale: 1,
                transition: { duration: 0.5, ease: "easeInOut" }
              });
              setCurrentScale(1);
            }}
            sx={{
              borderRadius: 5,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            Reset View
          </Button>
        </Tooltip>
      </Box>
      
      {/* Planet Details Panel - slides in from right */}
      <AnimatePresence>
        {detailsOpen && activeDestination && (
          <motion.div
            key="details"
            variants={slideIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: isMobile ? '100%' : isTablet ? '350px' : '400px',
              zIndex: 20,
              display: 'flex',
            }}
          >
            <Box 
              sx={{ 
                flex: 1,
                background: 'rgba(16, 20, 42, 0.9)',
                backdropFilter: 'blur(10px)',
                borderLeft: '1px solid rgba(140, 158, 255, 0.2)',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              {/* Close button */}
              <IconButton
                onClick={handleDetailsClose}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
              
              {/* Navigation buttons */}
              <Box sx={{ 
                position: 'absolute',
                top: '50%',
                left: -40,
                transform: 'translateY(-50%)',
                display: { xs: 'none', md: 'block' }
              }}>
                <IconButton
                  onClick={handlePrevDestination}
                  sx={{
                    color: 'white',
                    background: 'rgba(16, 20, 42, 0.7)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(140, 158, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(140, 158, 255, 0.2)',
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ 
                position: 'absolute',
                top: 15,
                left: 15,
                display: { xs: 'block', md: 'none' }
              }}>
                <IconButton
                  onClick={handlePrevDestination}
                  size="small"
                  sx={{
                    color: 'white',
                    background: 'rgba(16, 20, 42, 0.7)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(140, 158, 255, 0.2)',
                    mr: 1,
                    '&:hover': {
                      background: 'rgba(140, 158, 255, 0.2)',
                    }
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
                
                <IconButton
                  onClick={handleNextDestination}
                  size="small"
                  sx={{
                    color: 'white',
                    background: 'rgba(16, 20, 42, 0.7)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(140, 158, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(140, 158, 255, 0.2)',
                    }
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>
              
              {/* Destination details */}
              <Box 
                component={motion.div}
                variants={zoomIn}
                sx={{ mt: 3 }}
              >
                {/* Destination type */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {displayPlanetType(activeDestination.type)}
                </Box>
                
                {/* Destination name */}
                <Typography 
                  variant="h4" 
                  component="h2" 
                  align="center"
                  sx={{ 
                    color: 'white',
                    fontWeight: 700,
                    mb: 1,
                    background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                  }}
                >
                  {activeDestination.name}
                </Typography>
                
                {/* Next launch */}
                <Typography 
                  variant="subtitle2" 
                  align="center"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    mb: 3
                  }}
                >
                  <RocketLaunchIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  Next Launch: {activeDestination.nextLaunch}
                </Typography>
                
                {/* Destination image */}
                <Box 
                  sx={{ 
                    height: 200,
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 3,
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(140, 158, 255, 0.2)',
                  }}
                >
                  <Box
                    component="img"
                    src={activeDestination.imageUrl}
                    alt={activeDestination.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  
                  {/* Price badge */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      background: 'rgba(11, 13, 27, 0.8)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      border: '1px solid rgba(140, 158, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <AttachMoneyIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                      {activeDestination.basePrice.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Description */}
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.7,
                    mb: 3
                  }}
                >
                  {activeDestination.description}
                </Typography>
                
                {/* Key details */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Paper 
                      sx={{ 
                        p: 2,
                        background: 'rgba(140, 158, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(140, 158, 255, 0.2)',
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AccessTimeIcon sx={{ color: theme.palette.primary.main, mb: 1 }} />
                      <Typography variant="subtitle2" sx={{ color: 'white' }}>
                        Travel Time
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {activeDestination.travelTime}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper 
                      sx={{ 
                        p: 2,
                        background: 'rgba(255, 158, 128, 0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 158, 128, 0.2)',
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <StarIcon sx={{ color: '#FF9E80', mb: 1 }} />
                      <Typography variant="subtitle2" sx={{ color: 'white' }}>
                        Experience
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {activeDestination.type === 'Space Station' ? 'Zero-G' : (
                          activeDestination.type === 'Planetary Base' ? 'Low Gravity' : 'Variable'
                        )}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                {/* Destination highlights */}
                <Box 
                  sx={{ 
                    p: 2,
                    background: 'rgba(16, 20, 42, 0.7)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(140, 158, 255, 0.2)',
                    borderRadius: 2,
                    mb: 3
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <InfoIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    Destination Highlights
                  </Typography>
                  
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {activeDestination.type === 'Space Station' ? (
                      <>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}
                        >
                          Experience weightlessness in our dedicated zero-gravity recreation area
                        </Typography>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}
                        >
                          Panoramic observation deck with breathtaking views of Earth
                        </Typography>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          Gourmet dining with ingredients grown in our hydroponic gardens
                        </Typography>
                      </>
                    ) : activeDestination.type === 'Planetary Base' ? (
                      <>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}
                        >
                          Guided excursions on the Martian surface in pressurized rovers
                        </Typography>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}
                        >
                          Experience 0.38g gravity - just 38% of Earth's gravity
                        </Typography>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          Visit the Mars Science Laboratory and contribute to ongoing research
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}
                        >
                          Experience lunar gravity - just 1/6th of Earth's gravity
                        </Typography>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}
                        >
                          Witness breathtaking Earthrise from the lunar surface
                        </Typography>
                        <Typography 
                          component="li" 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          Explore lunar craters and historic landing sites
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                
                {/* Safety rating */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mb: 3
                  }}
                >
                  <ShieldIcon sx={{ color: '#81C784' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Safety Rating: Excellent
                  </Typography>
                  <MilitaryTechIcon sx={{ color: '#FFD700' }} />
                </Box>
                
                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/booking"
                    onClick={() => handleBookNow(activeDestination)}
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 28,
                      py: 1.2,
                      background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                      boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
                      textTransform: 'none',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Book This Journey
                  </Button>
                  
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/destinations`}
                    startIcon={<ExploreIcon />}
                    sx={{
                      borderRadius: 28,
                      py: 1.2,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        background: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    Explore
                  </Button>
                </Box>
              </Box>
            </Box>
            
            {/* Right side navigation button */}
            <Box sx={{ 
              position: 'absolute',
              top: '50%',
              right: -40,
              transform: 'translateY(-50%)',
              display: { xs: 'none', md: 'block' }
            }}>
              <IconButton
                onClick={handleNextDestination}
                sx={{
                  color: 'white',
                  background: 'rgba(16, 20, 42, 0.7)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(140, 158, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(140, 158, 255, 0.2)',
                  }
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default DestinationExplorer;