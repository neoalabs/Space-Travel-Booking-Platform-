// src/pages/HomePage.js
import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const HomePage = () => {
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

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper', 
          pt: 12, 
          pb: 20, 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/images/space-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="white"
            gutterBottom
            fontWeight="bold"
          >
            Dubai to the Stars
          </Typography>
          <Typography variant="h5" align="center" color="white" paragraph>
            Experience the ultimate space travel adventure with Dubai's first commercial space travel service. 
            Journey to orbital stations, lunar bases, and beyond!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/booking"
              size="large"
              startIcon={<RocketLaunchIcon />}
            >
              Book Your Journey
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/destinations"
              size="large"
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Explore Destinations
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Destinations */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Featured Destinations
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Discover the most exciting space travel experiences launching from Dubai
        </Typography>
        
        <Grid container spacing={4}>
          {featuredDestinations.map((destination) => (
            <Grid item key={destination.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={destination.imageUrl}
                  alt={destination.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {destination.name}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {destination.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    From ${destination.price.toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/booking`}
                  >
                    Book Now
                  </Button>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/destinations`}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;