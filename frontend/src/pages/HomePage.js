// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';

const HomePage = () => {
  // State for animated stars background
  const [stars, setStars] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Generate random stars for background
  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
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

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Animated Starfield Background */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: -1,
        background: 'linear-gradient(to bottom, #020518 0%, #0a1028 50%, #200933 100%)',
        overflow: 'hidden'
      }}>
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
              }
            }}
          />
        ))}
        
        {/* Animated nebula */}
        <Box 
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '40vw',
            height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, rgba(123, 31, 162, 0.1) 50%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(30px)',
            opacity: 0.7,
            animation: 'pulse 15s infinite alternate',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 0.7 },
              '50%': { transform: 'scale(1.1)', opacity: 0.5 },
              '100%': { transform: 'scale(1)', opacity: 0.7 }
            }
          }}
        />
      </Box>

      {/* Hero Section */}
      <Box 
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.8 }}
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated planet in background */}
        <Box 
          component={motion.div}
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 300, 
            ease: "linear", 
            repeat: Infinity 
          }}
          sx={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #263238 0%, #102027 100%)',
            boxShadow: 'inset 10px -10px 20px rgba(0,0,0,0.5), 0 0 50px rgba(38, 50, 56, 0.7)',
            zIndex: 0,
            display: { xs: 'none', md: 'block' },
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <Typography
              component="h1"
              variant="h1"
              align="center"
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 50%, #FF9E80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                textShadow: '0 0 30px rgba(140, 158, 255, 0.5)',
                mb: 2,
              }}
            >
              DUBAI TO THE STARS
            </Typography>
          </motion.div>
          
          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Typography 
              variant="h5" 
              align="center" 
              sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 6 }}
              paragraph
            >
              Experience the ultimate space travel adventure with Dubai's first commercial space travel service. 
              Journey to orbital stations, lunar bases, and beyond!
            </Typography>
          </motion.div>
          
          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.6 }}
            sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}
          >
            <Button 
              variant="contained" 
              component={Link} 
              to="/booking"
              size="large"
              startIcon={<RocketLaunchIcon />}
              sx={{ 
                background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                px: 4,
                py: 1.5,
                borderRadius: 28,
                fontSize: '1rem',
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
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
                },
                mr: 2  // Added margin-right for spacing
              }}
            >
              Book Your Journey
            </Button>
            
            <Button 
              variant="outlined" 
              component={Link} 
              to="/destinations"
              size="large"
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 28,
                fontSize: '1rem',
                textTransform: 'none',
                backdropFilter: 'blur(5px)',
                background: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                }
              }}
            >
              Explore Destinations
            </Button>
          </motion.div>
        </Container>
        
        {/* Scroll indicator */}
        <Box
          component={motion.div}
          animate={{ 
            y: [0, 10, 0],
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
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            Scroll to Explore
          </Typography>
          <KeyboardArrowDownIcon />
        </Box>
      </Box>

      {/* Featured Destinations */}
      <Container 
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        sx={{ py: 8 }} 
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
            }}
          >
            Featured Destinations
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="body1" align="center" color="rgba(255, 255, 255, 0.7)" paragraph sx={{ mb: 6 }}>
            Discover the most exciting space travel experiences launching from Dubai
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
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: 'rgba(16, 20, 42, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: hoveredCard === destination.id 
                    ? '1px solid rgba(140, 158, 255, 0.4)' 
                    : '1px solid rgba(140, 158, 255, 0.15)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: hoveredCard === destination.id 
                    ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(140, 158, 255, 0.4)' 
                    : '0 8px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === destination.id ? 'translateY(-8px)' : 'translateY(0)',
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
                      transition: 'transform 0.5s ease',
                      transform: hoveredCard === destination.id ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(0deg, rgba(16,20,42,1) 0%, rgba(16,20,42,0) 70%)',
                  }} />
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
                    }}
                  >
                    {destination.name}
                  </Typography>
                  
                  <Typography color="rgba(255, 255, 255, 0.7)" paragraph sx={{ mb: 2 }}>
                    {destination.description}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#FF9E80',
                      fontWeight: 600
                    }}
                  >
                    From ${destination.price.toLocaleString()}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    component={Link} 
                    to="/booking"
                    variant={hoveredCard === destination.id ? "contained" : "text"}
                    sx={{
                      borderRadius: 28,
                      transition: 'all 0.3s ease',
                      bgcolor: hoveredCard === destination.id ? 'primary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: hoveredCard === destination.id ? 'primary.dark' : 'rgba(140, 158, 255, 0.1)',
                      }
                    }}
                  >
                    Book Now
                  </Button>
                  
                  <Button 
                    size="small" 
                    component={Link} 
                    to="/destinations"
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Call to action section */}
      <Container 
        maxWidth="md" 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 12 }}
      >
        <Box
          sx={{
            background: 'rgba(16, 20, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: 6,
            border: '1px solid rgba(140, 158, 255, 0.3)',
            p: 4,
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center'
          }}
        >
          {/* Animated glow effect */}
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(ellipse at center, rgba(140, 158, 255, 0.15) 0%, rgba(140, 158, 255, 0) 70%)',
              animation: 'rotate 15s linear infinite',
              '@keyframes rotate': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              position: 'relative',
              mb: 4
            }}
          >
            Ready to Travel to Space?
          </Typography>
          
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
            Begin Your Journey
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;