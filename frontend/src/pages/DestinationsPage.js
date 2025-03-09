// src/pages/DestinationsPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardMedia, 
  CardContent, CardActions, Button, Box, Chip 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchAvailableDestinations } from '../api/bookingApi';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await fetchAvailableDestinations();
        setDestinations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setLoading(false);
      }
    };
    
    fetchDestinations();
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Space Destinations
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Explore our available space destinations and prepare for the journey of a lifetime.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {destinations.map((destination) => (
          <Grid item key={destination.id} xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardMedia
                component="img"
                height="240"
                image={destination.imageUrl}
                alt={destination.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {destination.name}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip label={destination.type} color="primary" size="small" />
                  <Chip label={`${destination.travelTime} journey`} size="small" />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {destination.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    From ${destination.basePrice.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next launch: {destination.nextLaunch}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/booking"
                  fullWidth
                >
                  Book This Destination
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DestinationsPage;