// src/pages/AccommodationsPage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AccommodationsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Space Accommodations
      </Typography>
      
      <Box sx={{ my: 4 }}>
        <Typography variant="body1" paragraph>
          Our various space destinations offer a range of accommodation options to suit every traveler's preferences.
          From efficient standard pods to luxurious habitats with panoramic views of space, there's something for everyone.
        </Typography>
        
        <Typography variant="body1">
          To explore accommodation options, please select a destination when booking your journey.
        </Typography>
      </Box>
    </Container>
  );
};

export default AccommodationsPage;