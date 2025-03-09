// src/components/booking/AccommodationStep.js
import React from 'react';
import { Grid, Typography, Box, Card, CardContent, CardActionArea, Divider, Rating, Chip } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';

const AccommodationStep = ({ bookingData, availableAccommodations, onBookingDataChange }) => {
  // Handle accommodation selection
  const handleAccommodationSelect = (accommodation) => {
    onBookingDataChange('accommodation', accommodation);
  };
  
  // Calculate stay duration
  const calculateDuration = () => {
    if (!bookingData.departureDate || !bookingData.returnDate) return 0;
    return Math.ceil((bookingData.returnDate - bookingData.departureDate) / (1000 * 60 * 60 * 24));
  };
  
  const duration = calculateDuration();
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Select Your Accommodation
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="body1" paragraph>
        Choose where you'll stay during your {duration}-day journey to {bookingData.destination?.name}.
      </Typography>
      
      <Grid container spacing={3}>
        {availableAccommodations.map((accommodation) => (
          <Grid item xs={12} md={4} key={accommodation.id}>
            <Card 
              sx={{ 
                height: '100%',
                transform: bookingData.accommodation?.id === accommodation.id ? 'scale(1.03)' : 'scale(1)',
                boxShadow: bookingData.accommodation?.id === accommodation.id ? '0 0 20px rgba(140, 158, 255, 0.5)' : 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: bookingData.accommodation?.id === accommodation.id ? '2px solid #8C9EFF' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <CardActionArea 
                onClick={() => handleAccommodationSelect(accommodation)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <HotelIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      {accommodation.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={accommodation.rating} precision={0.5} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {accommodation.rating.toFixed(1)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${accommodation.pricePerNight.toLocaleString()} / night
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">
                    Total for {duration} nights: ${(accommodation.pricePerNight * duration).toLocaleString()}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                    {accommodation.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Amenities:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {accommodation.features.map((feature, index) => (
                      <Chip key={index} label={feature} size="small" />
                    ))}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AccommodationStep;