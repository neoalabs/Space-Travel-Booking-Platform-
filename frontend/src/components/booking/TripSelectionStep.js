// src/components/booking/TripSelectionStep.js
import React from 'react';
import { 
  Grid, Typography, Card, CardMedia, CardContent, 
  CardActionArea, Box, Chip, Divider, TextField, 
  InputAdornment, Stack 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

const TripSelectionStep = ({ bookingData, availableDestinations, onBookingDataChange }) => {
  // Handle date changes
  const handleDepartureDateChange = (newDate) => {
    onBookingDataChange('departureDate', newDate);
    
    // Ensure return date is after departure date
    if (newDate >= bookingData.returnDate) {
      onBookingDataChange('returnDate', addDays(newDate, 30));
    }
  };
  
  const handleReturnDateChange = (newDate) => {
    onBookingDataChange('returnDate', newDate);
  };
  
  // Handle destination selection
  const handleDestinationSelect = (destination) => {
    onBookingDataChange('destination', destination);
  };
  
  // Handle passenger count change
  const handlePassengerCountChange = (event) => {
    const count = parseInt(event.target.value);
    if (!isNaN(count) && count >= 1 && count <= 10) {
      onBookingDataChange('passengers', count);
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Select Your Journey Details
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                label="Departure Date"
                value={bookingData.departureDate}
                onChange={handleDepartureDateChange}
                disablePast
                minDate={addDays(new Date(), 14)} // Earliest booking is 2 weeks from now
                sx={{ width: '100%' }}
              />
              
              <DatePicker
                label="Return Date"
                value={bookingData.returnDate}
                onChange={handleReturnDateChange}
                disablePast
                minDate={addDays(bookingData.departureDate, 1)} // Return must be after departure
                sx={{ width: '100%' }}
              />
              
              <TextField
                label="Number of Passengers"
                type="number"
                value={bookingData.passengers}
                onChange={handlePassengerCountChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmojiPeopleIcon />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, max: 10 }
                }}
              />
            </Stack>
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Travel Duration: {
              bookingData.departureDate && bookingData.returnDate ? 
              Math.ceil((bookingData.returnDate - bookingData.departureDate) / (1000 * 60 * 60 * 24)) : 
              0
            } days
          </Typography>
          
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: 'background.paper',
            border: '1px dashed rgba(255, 255, 255, 0.2)'
          }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              All trips include:
            </Typography>
            
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Pre-flight training (3 days)</li>
              <li>Medical check-up</li>
              <li>Space suit fitting</li>
              <li>Zero-gravity preparation</li>
              <li>Emergency protocols training</li>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Typography variant="h5" component="h2" sx={{ mt: 6, mb: 3 }}>
        Select Your Destination
      </Typography>
      
      <Grid container spacing={3}>
        {availableDestinations.map((destination) => (
          <Grid item xs={12} sm={6} md={4} key={destination.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transform: bookingData.destination?.id === destination.id ? 'scale(1.03)' : 'scale(1)',
                boxShadow: bookingData.destination?.id === destination.id ? '0 0 20px rgba(140, 158, 255, 0.5)' : 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: bookingData.destination?.id === destination.id ? '2px solid #8C9EFF' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <CardActionArea 
                onClick={() => handleDestinationSelect(destination)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={destination.imageUrl}
                  alt={destination.name}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {destination.name}
                  </Typography>
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Chip 
                      icon={<RocketLaunchIcon />} 
                      label={`${destination.travelTime} journey`}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    
                    <Chip 
                      icon={<PublicIcon />} 
                      label={destination.type}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {destination.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <AccessTimeIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Next launch: {destination.nextLaunch}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    Starting from ${destination.basePrice.toLocaleString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TripSelectionStep;