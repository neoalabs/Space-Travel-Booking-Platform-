// src/pages/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Tabs, Tab, Paper, Card, CardContent,
  CardActions, Button, Divider, Avatar, Chip, LinearProgress, List,
  ListItem, ListItemIcon, ListItemText, CircularProgress
} from '@mui/material';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import { 
  fetchUserBookings, 
  fetchUserProfile, 
  fetchSpaceTravelTips 
} from '../api/userApi';

const UserDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [travelTips, setTravelTips] = useState([]);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile, bookings and travel tips in parallel
        const [userProfileData, userBookingsData, spaceTravelTipsData] = await Promise.all([
          fetchUserProfile(),
          fetchUserBookings(),
          fetchSpaceTravelTips()
        ]);
        
        setProfile(userProfileData);
        setBookings(userBookingsData);
        setTravelTips(spaceTravelTipsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Calculate countdown
  const calculateCountdown = (departureDate) => {
    const now = new Date();
    const departure = new Date(departureDate);
    const daysRemaining = differenceInDays(departure, now);
    
    if (daysRemaining > 0) {
      const hoursRemaining = differenceInHours(departure, now) % 24;
      return `${daysRemaining}d ${hoursRemaining}h`;
    } else {
      return 'Launch imminent!';
    }
  };
  
  // Calculate preparation progress
  const calculatePreparationProgress = (departureDate) => {
    const now = new Date();
    const departure = new Date(departureDate);
    const totalDays = 90; // Assuming 90 days of preparation time
    const daysRemaining = differenceInDays(departure, now);
    
    // Calculate percentage completed
    const progress = Math.min(100, Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100));
    return Math.round(progress);
  };
  
  // If loading, show spinner
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your space journey data...
        </Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                src={profile?.avatarUrl}
                alt={profile?.name}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  margin: '0 auto 16px',
                  border: '4px solid rgba(140, 158, 255, 0.5)'
                }}
              />
              
              <Typography variant="h5" component="div" gutterBottom>
                {profile?.name}
              </Typography>
              
              <Chip 
                icon={<RocketLaunchIcon />} 
                label={`Space Traveler Level ${profile?.travelerLevel}`} 
                color="primary"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {profile?.bio}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{profile?.totalMiles.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Space Miles</Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6">{profile?.completedTrips}</Typography>
                  <Typography variant="body2" color="text.secondary">Trips</Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6">{profile?.destinations}</Typography>
                  <Typography variant="body2" color="text.secondary">Destinations</Typography>
                </Box>
              </Box>
            </CardContent>
            
            <CardActions>
              <Button size="small" startIcon={<PersonIcon />} sx={{ mr: 'auto' }}>
                Edit Profile
              </Button>
              <Button size="small" startIcon={<NotificationsIcon />}>
                Alerts
              </Button>
              <Button size="small" startIcon={<SettingsIcon />}>
                Settings
              </Button>
            </CardActions>
          </Card>
          
          {/* Travel Tips Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TipsAndUpdatesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI Space Travel Tips
              </Typography>
              
              <List dense>
                {travelTips.map((tip, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <TipsAndUpdatesIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Main Dashboard Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%', mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              centered
            >
              <Tab label="Upcoming Trips" icon={<RocketLaunchIcon />} iconPosition="start" />
              <Tab label="Past Journeys" icon={<CalendarTodayIcon />} iconPosition="start" />
              <Tab label="My Tickets" icon={<ConfirmationNumberIcon />} iconPosition="start" />
            </Tabs>
          </Paper>
          
          {/* Upcoming Trips */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Your Upcoming Space Journeys
              </Typography>
              
              {bookings.filter(booking => new Date(booking.departureDate) > new Date()).length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
                  <Typography variant="h6" paragraph>
                    No upcoming trips scheduled
                  </Typography>
                  <Button variant="contained" href="/booking">
                    Book Your First Space Journey
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {bookings
                    .filter(booking => new Date(booking.departureDate) > new Date())
                    .map((booking) => (
                      <Grid item xs={12} key={booking.id}>
                        <Card sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          overflow: 'hidden'
                        }}>
                          <Box 
                            sx={{ 
                              width: { xs: '100%', sm: 200 }, 
                              height: { xs: 140, sm: 'auto' }, 
                              position: 'relative' 
                            }}
                          >
                            <Box 
                              component="img"
                              src={booking.destination.imageUrl}
                              alt={booking.destination.name}
                              sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                            />
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                width: '100%', 
                                bgcolor: 'rgba(0,0,0,0.6)', 
                                p: 1 
                              }}
                            >
                              <Typography variant="subtitle2" color="white">
                                {booking.destination.name}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={8}>
                                <Typography variant="h6" gutterBottom>
                                  {booking.destination.name} Adventure
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <RocketLaunchIcon fontSize="small" sx={{ mr: 1 }} />
                                  <Typography variant="body2">
                                    Departure: {format(new Date(booking.departureDate), 'MMM dd, yyyy - HH:mm')}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <HotelIcon fontSize="small" sx={{ mr: 1 }} />
                                  <Typography variant="body2">
                                    {booking.accommodation.name}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ mt: 2 }}>
                                  <Chip 
                                    label={booking.seatClass.name} 
                                    size="small" 
                                    color="secondary"
                                    sx={{ mr: 1 }}
                                  />
                                  <Chip 
                                    label={`${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}`} 
                                    size="small" 
                                  />
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                                <Box sx={{ 
                                  p: 1, 
                                  borderRadius: 2, 
                                  bgcolor: 'background.paper',
                                  border: '1px solid rgba(140, 158, 255, 0.5)',
                                  mb: 2
                                }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Launch Countdown
                                  </Typography>
                                  <Typography variant="h6" color="primary">
                                    {calculateCountdown(booking.departureDate)}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Preparation Progress
                                  </Typography>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={calculatePreparationProgress(booking.departureDate)} 
                                    sx={{ height: 8, borderRadius: 4 }}
                                  />
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    {calculatePreparationProgress(booking.departureDate)}% Complete
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                          
                          <CardActions sx={{ alignSelf: 'center', p: 2 }}>
                            <Button variant="outlined" size="small">
                              View Details
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              )}
            </Box>
          )}
          
          {/* Past Journeys */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Your Space Travel History
              </Typography>
              
              {bookings.filter(booking => new Date(booking.departureDate) <= new Date()).length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
                  <Typography variant="h6">
                    No past journeys
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {/* Past bookings would go here */}
                </Grid>
              )}
            </Box>
          )}
          
          {/* My Tickets */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Your Space Travel Tickets
              </Typography>
              
              {/* Tickets would go here */}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard;