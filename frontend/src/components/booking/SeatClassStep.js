// src/components/booking/SeatClassStep.js
import React from 'react';
import { Grid, Typography, Box, Card, CardContent, CardActionArea, Divider, Chip } from '@mui/material';

const SeatClassStep = ({ bookingData, availableSeatClasses, onBookingDataChange }) => {
  // Handle seat class selection
  const handleSeatClassSelect = (seatClass) => {
    onBookingDataChange('seatClass', seatClass);
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Choose Your Seat Class
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="body1" paragraph>
        Select the perfect seat class for your journey to {bookingData.destination?.name}.
      </Typography>
      
      <Grid container spacing={3}>
        {availableSeatClasses.map((seatClass) => (
          <Grid item xs={12} md={4} key={seatClass.id}>
            <Card 
              sx={{ 
                height: '100%',
                transform: bookingData.seatClass?.id === seatClass.id ? 'scale(1.03)' : 'scale(1)',
                boxShadow: bookingData.seatClass?.id === seatClass.id ? '0 0 20px rgba(140, 158, 255, 0.5)' : 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: bookingData.seatClass?.id === seatClass.id ? '2px solid #8C9EFF' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <CardActionArea 
                onClick={() => handleSeatClassSelect(seatClass)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {seatClass.name}
                  </Typography>
                  
                  <Typography variant="h4" color="primary" gutterBottom>
                    ${seatClass.price.toLocaleString()}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {seatClass.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Features:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {seatClass.features.map((feature, index) => (
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

export default SeatClassStep;