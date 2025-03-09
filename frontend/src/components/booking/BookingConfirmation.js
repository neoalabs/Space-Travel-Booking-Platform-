// src/components/booking/BookingConfirmation.js
import React from 'react';
import { 
  Box, Typography, Paper, Button, Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Import from icons package
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const BookingConfirmation = ({ bookingData }) => {
  const bookingId = Math.floor(100000 + Math.random() * 900000);
  const bookingDate = new Date();
  
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      
      <Typography variant="h4" component="h2" gutterBottom>
        Booking Confirmed!
      </Typography>
      
      <Typography variant="body1" paragraph>
        Your space journey to {bookingData.destination?.name} has been successfully booked.
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 3, maxWidth: 600, mx: 'auto', mb: 4, textAlign: 'left' }}>
        <Typography variant="subtitle2" color="text.secondary">
          Booking ID
        </Typography>
        <Typography variant="h6" gutterBottom>
          DST-{bookingId}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary">
          Booking Date
        </Typography>
        <Typography variant="body1" gutterBottom>
          {format(bookingDate, 'MMMM dd, yyyy')}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" color="text.secondary">
          Journey
        </Typography>
        <Typography variant="body1" gutterBottom>
          {bookingData.destination?.name} - {bookingData.seatClass?.name}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary">
          Departure Date
        </Typography>
        <Typography variant="body1" gutterBottom>
          {format(bookingData.departureDate, 'MMMM dd, yyyy')}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary">
          Return Date
        </Typography>
        <Typography variant="body1" gutterBottom>
          {format(bookingData.returnDate, 'MMMM dd, yyyy')}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary">
          Accommodation
        </Typography>
        <Typography variant="body1" gutterBottom>
          {bookingData.accommodation?.name}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary">
          Passengers
        </Typography>
        <Typography variant="body1" gutterBottom>
          {bookingData.passengers}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary">
          Total Price
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          ${bookingData.totalPrice.toLocaleString()}
        </Typography>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          component={Link} 
          to="/dashboard"
        >
          View My Dashboard
        </Button>
        <Button 
          variant="outlined"
          component={Link} 
          to="/"
        >
          Return to Home
        </Button>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;