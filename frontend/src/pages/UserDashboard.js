// src/pages/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Tabs, Tab, Paper, Card, CardContent,
  CardActions, Button, Divider, Avatar, Chip, LinearProgress, List,
  ListItem, ListItemIcon, ListItemText, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PublicIcon from '@mui/icons-material/Public';

import { 
  fetchUserBookings, 
  fetchUserProfile, 
  fetchSpaceTravelTips 
} from '../api/userApi';

// Custom styled components
const GlowingCard = styled(Card)(({ theme }) => ({
  background: 'rgba(22, 27, 51, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(140, 158, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(140, 158, 255, 0.2)',
    border: '1px solid rgba(140, 158, 255, 0.3)',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 60,
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  opacity: 0.7,
  '&.Mui-selected': {
    opacity: 1,
    fontWeight: 600,
  }
}));

const GlowingProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  '& .MuiLinearProgress-bar': {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    boxShadow: `0 0 10px ${theme.palette.primary.main}`,
  },
  '& .MuiLinearProgress-dashed': {
    backgroundImage: 'none',
  }
}));

// Animated countdown component
const LaunchCountdown = ({ departureDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const departure = new Date(departureDate);
      const difference = departure - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [departureDate]);
  
  return (
    <Box sx={{ 
      p: 2, 
      borderRadius: 2, 
      background: 'rgba(22, 27, 51, 0.9)',
      border: '1px solid rgba(140, 158, 255, 0.3)',
      mb: 2,
      boxShadow: 'inset 0 0 20px rgba(140, 158, 255, 0.1)'
    }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
        Launch Countdown
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            width: 50, 
            height: 50, 
            borderRadius: '50%', 
            border: '3px solid rgba(140, 158, 255, 0.2)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box component={motion.div} 
              animate={{ 
                background: ['rgba(140, 158, 255, 0.1)', 'rgba(140, 158, 255, 0.3)', 'rgba(140, 158, 255, 0.1)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              sx={{ 
                position: 'absolute',
                inset: -3,
                borderRadius: '50%',
                zIndex: -1
              }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              {timeLeft.days}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Days
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            width: 50, 
            height: 50, 
            borderRadius: '50%', 
            border: '3px solid rgba(140, 158, 255, 0.2)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              {timeLeft.hours}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Hours
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            width: 50, 
            height: 50, 
            borderRadius: '50%', 
            border: '3px solid rgba(140, 158, 255, 0.2)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              {timeLeft.minutes}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Mins
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ 
            width: 50, 
            height: 50, 
            borderRadius: '50%', 
            border: '3px solid rgba(140, 158, 255, 0.2)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              {timeLeft.seconds}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Secs
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Journey Progress Indicator
const TravelProgressIndicator = ({ booking }) => {
  const departureDate = new Date(booking.departureDate);
  const returnDate = new Date(booking.returnDate);
  const now = new Date();
  
  // Calculate progress percentage
  const totalJourneyDuration = returnDate - departureDate;
  const elapsedTime = now - departureDate;
  const progress = Math.max(0, Math.min(100, (elapsedTime / totalJourneyDuration) * 100));

  // Journey status
  let status = "Upcoming";
  if (now > returnDate) {
    status = "Completed";
  } else if (now > departureDate) {
    status = "In Progress";
  }
  
  // Colors based on status
  const statusColors = {
    "Upcoming": "#8C9EFF", // Blue
    "In Progress": "#FF9E80", // Orange
    "Completed": "#81C784" // Green
  };

  return (
    <Box sx={{ my: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Journey Progress
        </Typography>
        <Typography 
          variant="body2" 
          fontWeight={600} 
          sx={{ color: statusColors[status] }}
        >
          {status}
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ 
          height: 12, 
          bgcolor: 'rgba(140, 158, 255, 0.1)', 
          borderRadius: 6,
          overflow: 'hidden',
        }}>
          <Box 
            component={motion.div}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            sx={{
              height: '100%',
              background: `linear-gradient(90deg, ${statusColors[status]} 0%, ${statusColors[status]}80 100%)`,
              borderRadius: 6,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                animation: 'shimmer 2s infinite',
                '@keyframes shimmer': {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(100%)' }
                }
              }
            }}
          />
        </Box>
        
        {/* Journey milestones */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Box sx={{ position: 'relative' }}>
            <Box 
              sx={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                bgcolor: now > departureDate ? statusColors[status] : 'rgba(140, 158, 255, 0.3)',
                position: 'absolute',
                top: -22,
                left: 0,
                transform: 'translateX(-50%)',
                boxShadow: now > departureDate ? `0 0 10px ${statusColors[status]}` : 'none',
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              Departure
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <Box 
              sx={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                bgcolor: now > returnDate ? statusColors['Completed'] : 'rgba(140, 158, 255, 0.3)',
                position: 'absolute',
                top: -22,
                right: 0,
                transform: 'translateX(50%)',
                boxShadow: now > returnDate ? `0 0 10px ${statusColors['Completed']}` : 'none',
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              Return
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const UserDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [travelTips, setTravelTips] = useState([]);
  const [stars, setStars] = useState([]);
  
  // Generate stars for background
  useEffect(() => {
    const generatedStars = Array.from({ length: 70 }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, []);
  
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
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // If loading, show spinner
  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          background: 'linear-gradient(to bottom, #0B0D1B 0%, #161B33 100%)',
        }}
      >
        <CircularProgress 
          size={70} 
          sx={{ 
            color: '#8C9EFF',
            mb: 3,
            filter: 'drop-shadow(0 0 10px rgba(140, 158, 255, 0.8))'
          }} 
        />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading your space journey data...
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 1 }}>
          Preparing your cosmic dashboard
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0B0D1B 0%, #161B33 100%)',
      pt: 8,
      pb: 12
    }}>
      {/* Stars background */}
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
            },
            zIndex: 0
          }}
        />
      ))}
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 8, 
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Space Traveler Dashboard
        </Typography>
        
        <Grid container spacing={4}>
          {/* User Profile Card */}
          <Grid 
            item 
            xs={12} 
            md={4}
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <GlowingCard sx={{ mb: 4 }}>
              {/* Profile header background */}
              <Box sx={{ 
                height: 80, 
                background: 'linear-gradient(135deg, rgba(140, 158, 255, 0.2) 0%, rgba(140, 158, 255, 0.1) 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Animated particles */}
                {[...Array(5)].map((_, i) => (
                  <Box 
                    key={i}
                    component={motion.div}
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      duration: 3 + i, 
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'easeInOut',
                      delay: i * 0.5
                    }}
                    sx={{
                      position: 'absolute',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'white',
                      filter: 'blur(1px)',
                      top: 20 + (i * 10),
                      left: 20 + (i * 30),
                    }}
                  />
                ))}
              </Box>
              
              <CardContent sx={{ textAlign: 'center', position: 'relative', mt: -6 }}>
                <Avatar
                  src={profile?.avatarUrl}
                  alt={profile?.fullName}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    margin: '0 auto 16px',
                    border: '4px solid rgba(140, 158, 255, 0.5)',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                  }}
                />
                
                <Typography variant="h5" component="div" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                  {profile?.fullName}
                </Typography>
                
                <Chip 
                  icon={<RocketLaunchIcon />} 
                  label={`Space Traveler Level ${profile?.travelerLevel}`} 
                  sx={{ 
                    mb: 2, 
                    background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                    color: 'white',
                    fontWeight: 500,
                    boxShadow: '0 2px 10px rgba(105, 121, 248, 0.5)',
                  }}
                />
                
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" paragraph>
                  {profile?.bio}
                </Typography>
                
                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    background: 'rgba(10, 15, 30, 0.3)',
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  <Box 
                    component={motion.div}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 700, 
                          color: 'white',
                          textShadow: '0 0 10px rgba(140, 158, 255, 0.3)'
                        }}
                      >
                        {profile?.totalMiles.toLocaleString()}
                      </Typography>
                    </motion.div>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">Space Miles</Typography>
                  </Box>
                  
                  <Box 
                    component={motion.div}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 700, 
                          color: 'white',
                          textShadow: '0 0 10px rgba(140, 158, 255, 0.3)'
                        }}
                      >
                        {profile?.completedTrips}
                      </Typography>
                    </motion.div>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">Trips</Typography>
                  </Box>
                  
                  <Box 
                    component={motion.div}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 700, 
                          color: 'white',
                          textShadow: '0 0 10px rgba(140, 158, 255, 0.3)'
                        }}
                      >
                        {profile?.destinations}
                      </Typography>
                    </motion.div>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">Destinations</Typography>
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions sx={{ px: 3, pb: 3 }}>
                <Button 
                  size="small" 
                  startIcon={<PersonIcon />} 
                  sx={{ 
                    mr: 'auto',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  Edit Profile
                </Button>
                <Button 
                  size="small" 
                  startIcon={<NotificationsIcon />}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  Alerts
                </Button>
                <Button 
                  size="small" 
                  startIcon={<SettingsIcon />}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  Settings
                </Button>
              </CardActions>
            </GlowingCard>
            
            {/* Travel Tips Card */}
            <GlowingCard
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TipsAndUpdatesIcon sx={{ 
                    mr: 1.5, 
                    color: '#FF9E80',
                    animation: 'glow 2s infinite alternate',
                    '@keyframes glow': {
                      '0%': { filter: 'drop-shadow(0 0 2px rgba(255, 158, 128, 0.4))' },
                      '100%': { filter: 'drop-shadow(0 0 8px rgba(255, 158, 128, 0.7))' }
                    }
                  }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    AI Space Travel Tips
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                <List 
                  sx={{ 
                    background: 'rgba(10, 15, 30, 0.3)',
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  {travelTips.map((tip, index) => (
                    <ListItem 
                      key={index} 
                      disablePadding 
                      sx={{ mb: 2 }}
                      component={motion.div}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 36,
                        color: '#FF9E80',
                      }}>
                        <TipsAndUpdatesIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={tip} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </GlowingCard>
          </Grid>
          
          {/* Main Dashboard Content */}
          <Grid 
            item 
            xs={12} 
            md={8}
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper 
              sx={{ 
                width: '100%', 
                mb: 4,
                background: 'rgba(16, 20, 42, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(140, 158, 255, 0.2)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                centered
                sx={{ 
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 1.5,
                    background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                    boxShadow: '0 0 10px rgba(140, 158, 255, 0.7)',
                  }
                }}
              >
                <StyledTab 
                  label="Upcoming Trips" 
                  icon={<RocketLaunchIcon />} 
                  iconPosition="start" 
                />
                <StyledTab 
                  label="Past Journeys" 
                  icon={<CalendarTodayIcon />} 
                  iconPosition="start" 
                />
                <StyledTab 
                  label="My Tickets" 
                  icon={<ConfirmationNumberIcon />} 
                  iconPosition="start" 
                />
              </Tabs>
            </Paper>
            
            {/* Tab panels with animated transitions */}
            <AnimatePresence mode="wait">
              {/* Upcoming Trips */}
              {tabValue === 0 && (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      <TravelExploreIcon sx={{ color: '#8C9EFF' }} />
                      Your Upcoming Space Journeys
                    </Typography>
                    
                    {bookings.filter(booking => new Date(booking.departureDate) > new Date()).length === 0 ? (
                      <GlowingCard 
                        sx={{ 
                          p: 4, 
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <PublicIcon 
                          sx={{ 
                            fontSize: 60, 
                            color: 'rgba(140, 158, 255, 0.7)',
                            animation: 'float 3s ease-in-out infinite',
                            '@keyframes float': {
                              '0%': { transform: 'translateY(0px)' },
                              '50%': { transform: 'translateY(-10px)' },
                              '100%': { transform: 'translateY(0px)' }
                            }
                          }} 
                        />
                        
                        <Typography variant="h6" paragraph sx={{ color: 'white' }}>
                          No upcoming trips scheduled
                        </Typography>
                        
                        <Button 
                          variant="contained" 
                          component={Link} 
                          to="/booking"
                          sx={{ 
                            background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                            px: 4,
                            py: 1,
                            borderRadius: 28,
                            textTransform: 'none',
                            boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
                            }
                          }}
                        >
                          Book Your First Space Journey
                        </Button>
                      </GlowingCard>
                    ) : (
                      <Box component={motion.div} layout>
                        {bookings
                          .filter(booking => new Date(booking.departureDate) > new Date())
                          .map((booking, index) => (
                            <GlowingCard 
                              key={booking.id}
                              sx={{ mb: 3 }}
                              component={motion.div}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
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
                                      objectFit: 'cover',
                                      filter: 'brightness(0.8) contrast(1.2)'
                                    }}
                                  />
                                  <Box 
                                    sx={{ 
                                      position: 'absolute', 
                                      bottom: 0, 
                                      width: '100%', 
                                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)', 
                                      p: 1.5
                                    }}
                                  >
                                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                                      {booking.destination.name}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={7}>
                                      <Typography 
                                        variant="h6" 
                                        gutterBottom
                                        sx={{ 
                                          color: 'white',
                                          fontWeight: 600,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1
                                        }}
                                      >
                                        <RocketLaunchIcon 
                                          sx={{ 
                                            color: '#8C9EFF',
                                            animation: 'pulse 2s infinite alternate',
                                            '@keyframes pulse': {
                                              '0%': { opacity: 0.7 },
                                              '100%': { opacity: 1 }
                                            }
                                          }} 
                                        />
                                        {booking.destination.name} Adventure
                                      </Typography>
                                      
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 1.5,
                                        color: 'rgba(255, 255, 255, 0.8)'
                                      }}>
                                        <RocketLaunchIcon 
                                          fontSize="small" 
                                          sx={{ mr: 1, color: 'rgba(140, 158, 255, 0.8)' }} 
                                        />
                                        <Typography variant="body2">
                                          Departure: {format(new Date(booking.departureDate), 'MMM dd, yyyy - HH:mm')}
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 1.5,
                                        color: 'rgba(255, 255, 255, 0.8)'
                                      }}>
                                        <HotelIcon 
                                          fontSize="small" 
                                          sx={{ mr: 1, color: 'rgba(140, 158, 255, 0.8)' }} 
                                        />
                                        <Typography variant="body2">
                                          {booking.accommodation.name}
                                        </Typography>
                                      </Box>
                                      
                                      <Box sx={{ mt: 2 }}>
                                        <Chip 
                                          label={booking.seatClass.name} 
                                          size="small" 
                                          sx={{ 
                                            mr: 1,
                                            background: 'linear-gradient(90deg, #FF9E80 0%, #FF8A65 100%)',
                                            color: 'white',
                                            fontWeight: 500
                                          }}
                                        />
                                        <Chip 
                                          label={`${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}`} 
                                          size="small"
                                          sx={{ 
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            color: 'white',
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid'
                                          }}
                                        />
                                      </Box>
                                      
                                      {/* Journey progress */}
                                      <TravelProgressIndicator booking={booking} />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={5} sx={{ textAlign: 'center' }}>
                                      {/* Enhanced countdown */}
                                      <LaunchCountdown departureDate={booking.departureDate} />
                                      
                                      <Box>
                                        <Typography 
                                          variant="subtitle2" 
                                          color="rgba(255, 255, 255, 0.7)" 
                                          gutterBottom
                                        >
                                          Preparation Progress
                                        </Typography>
                                        <GlowingProgress 
                                          variant="determinate" 
                                          value={calculatePreparationProgress(booking.departureDate)} 
                                        />
                                        <Typography 
                                          variant="body2" 
                                          sx={{ 
                                            mt: 1,
                                            color: 'white',
                                            fontWeight: 500
                                          }}
                                        >
                                          {calculatePreparationProgress(booking.departureDate)}% Complete
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Box>
                              
                              <Divider sx={{ mx: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                              
                              <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  sx={{ 
                                    borderColor: 'rgba(140, 158, 255, 0.5)',
                                    color: '#8C9EFF',
                                    borderRadius: 28,
                                    px: 3,
                                    '&:hover': {
                                      borderColor: '#8C9EFF',
                                      background: 'rgba(140, 158, 255, 0.05)',
                                    }
                                  }}
                                >
                                  View Details
                                </Button>
                              </CardActions>
                            </GlowingCard>
                          ))}
                      </Box>
                    )}
                  </Box>
                </motion.div>
              )}
              
              {/* Past Journeys */}
              {tabValue === 1 && (
                <motion.div
                  key="past"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      <CalendarTodayIcon sx={{ color: '#8C9EFF' }} />
                      Your Space Travel History
                    </Typography>
                    
                    {bookings.filter(booking => new Date(booking.departureDate) <= new Date()).length === 0 ? (
                      <GlowingCard 
                        sx={{ 
                          p: 4, 
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <CalendarTodayIcon 
                          sx={{ 
                            fontSize: 60, 
                            color: 'rgba(140, 158, 255, 0.7)',
                            opacity: 0.7
                          }} 
                        />
                        
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          No past journeys
                        </Typography>
                        
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                          Your completed space travels will appear here
                        </Typography>
                      </GlowingCard>
                    ) : (
                      <Grid container spacing={3}>
                        {/* Past bookings would go here */}
                      </Grid>
                    )}
                  </Box>
                </motion.div>
              )}
              
              {/* My Tickets */}
              {tabValue === 2 && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      <ConfirmationNumberIcon sx={{ color: '#8C9EFF' }} />
                      Your Space Travel Tickets
                    </Typography>
                    
                    <GlowingCard 
                      sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <ConfirmationNumberIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: 'rgba(140, 158, 255, 0.7)',
                          opacity: 0.7
                        }} 
                      />
                      
                      <Typography variant="h6" sx={{ color: 'white' }}>
                        Coming Soon
                      </Typography>
                      
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        Digital tickets and boarding passes will be available here
                      </Typography>
                    </GlowingCard>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;