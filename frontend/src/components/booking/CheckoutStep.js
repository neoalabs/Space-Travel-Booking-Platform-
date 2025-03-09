// src/components/booking/CheckoutStep.js
import React from 'react';
import { 
  Grid, Typography, Box, Divider, Paper, 
  List, ListItem, ListItemText 
} from '@mui/material';
import { format } from 'date-fns';

const CheckoutStep = ({ bookingData }) => {
  // Calculate stay duration
  const calculateDuration = () => {
    if (!bookingData.departureDate || !bookingData.returnDate) return 0;
    return Math.ceil((bookingData.returnDate - bookingData.departureDate) / (1000 * 60 * 60 * 24));
  };
  
  const duration = calculateDuration();
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Review & Confirm Your Booking
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>Booking Summary</Typography>
          
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Destination
            </Typography>
            <Typography variant="h6" gutterBottom>
              {bookingData.destination?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {bookingData.destination?.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Departure</Typography>
                <Typography variant="body1">
                  {format(bookingData.departureDate, 'MMM dd, yyyy')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Return</Typography>
                <Typography variant="body1">
                  {format(bookingData.returnDate, 'MMM dd, yyyy')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                <Typography variant="body1">{duration} days</Typography>
              </Box>
            </Box>
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Seat Class
            </Typography>
            <Typography variant="h6" gutterBottom>
              {bookingData.seatClass?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {bookingData.seatClass?.description}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Features:
            </Typography>
            <List dense disablePadding>
              {bookingData.seatClass?.features.map((feature, index) => (
                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Accommodation
            </Typography>
            <Typography variant="h6" gutterBottom>
              {bookingData.accommodation?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {bookingData.accommodation?.description}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Amenities:
            </Typography>
            <List dense disablePadding>
              {bookingData.accommodation?.features.map((feature, index) => (
                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom>Order Details</Typography>
          
          <Paper variant="outlined" sx={{ p: 3 }}>
            <List disablePadding>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemText 
                  primary={`${bookingData.seatClass?.name} (${bookingData.passengers} passenger${bookingData.passengers > 1 ? 's' : ''})`} 
                  secondary={`$${bookingData.seatClass?.price.toLocaleString()} per passenger`} 
                />
                <Typography variant="body2">
                  ${(bookingData.seatClass?.price * bookingData.passengers).toLocaleString()}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1.5 }}>
                <ListItemText 
                  primary={`${bookingData.accommodation?.name}`} 
                  secondary={`$${bookingData.accommodation?.pricePerNight.toLocaleString()} × ${duration} nights`} 
                />
                <Typography variant="body2">
                  ${(bookingData.accommodation?.pricePerNight * duration).toLocaleString()}
                </Typography>
              </ListItem>
              
              <Divider />
              
              <ListItem sx={{ py: 1.5 }}>
                <ListItemText primary="Space Travel Insurance" />
                <Typography variant="body2">Included</Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1.5 }}>
                <ListItemText primary="Pre-flight Training" />
                <Typography variant="body2">Included</Typography>
              </ListItem>
              
              <Divider />
              
              <ListItem sx={{ py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  ${bookingData.totalPrice.toLocaleString()}
                </Typography>
              </ListItem>
            </List>
            
            <Box sx={{ 
              p: 2, 
              mt: 2, 
              borderRadius: 2, 
              bgcolor: 'rgba(140, 158, 255, 0.1)',
              border: '1px dashed rgba(140, 158, 255, 0.5)',
            }}>
              <Typography variant="body2" color="primary" align="center">
                Click "Confirm Booking" to secure your space journey.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutStep;