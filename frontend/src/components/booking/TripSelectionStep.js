// src/components/booking/TripSelectionStep.js
import React, { useState, useEffect } from 'react';
import { 
  Grid, Typography, Card, CardMedia, CardContent, 
  CardActionArea, Box, Chip, Divider, TextField, 
  InputAdornment, Stack, Slider, Tooltip, IconButton,
  alpha, useTheme, Badge, ToggleButtonGroup, ToggleButton,
  Paper, Zoom
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, differenceInDays, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import ScienceIcon from '@mui/icons-material/Science';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StarIcon from '@mui/icons-material/Star';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

// Styled components
const GlowingCard = styled(Card)(({ theme, selected }) => ({
  background: 'rgba(22, 27, 51, 0.7)',
  backdropFilter: 'blur(10px)',
  border: selected 
    ? `2px solid ${theme.palette.primary.main}` 
    : '1px solid rgba(140, 158, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: selected 
    ? '0 0 20px rgba(105, 121, 248, 0.5)' 
    : '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: selected ? 'scale(1.03)' : 'scale(1)',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  '&:hover': {
    borderColor: 'rgba(140, 158, 255, 0.5)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 15px rgba(140, 158, 255, 0.2)',
    transform: 'translateY(-5px) scale(1.02)',
  }
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: 'rgba(16, 20, 42, 0.5)',
    backdropFilter: 'blur(5px)',
    borderRadius: 10,
    border: '1px solid rgba(140, 158, 255, 0.2)',
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover, &.Mui-focused': {
      border: '1px solid rgba(140, 158, 255, 0.5)',
      boxShadow: '0 0 15px rgba(140, 158, 255, 0.2)'
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(2),
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: 'rgba(16, 20, 42, 0.5)',
  backdropFilter: 'blur(5px)',
  borderRadius: 10,
  border: '1px solid rgba(140, 158, 255, 0.2)',
  overflow: 'hidden',
  '& .MuiToggleButtonGroup-grouped': {
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      color: theme.palette.primary.main,
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    }
  }
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  '& .MuiSlider-thumb': {
    boxShadow: '0 0 10px rgba(140, 158, 255, 0.5)',
    '&:hover, &.Mui-active': {
      boxShadow: '0 0 15px rgba(140, 158, 255, 0.7)',
    }
  },
  '& .MuiSlider-rail': {
    opacity: 0.3,
  }
}));

const GradientBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
    color: 'white',
    boxShadow: '0 0 8px rgba(140, 158, 255, 0.5)',
    fontWeight: 600
  }
}));

const TripSelectionStep = ({ bookingData, availableDestinations, onBookingDataChange }) => {
  const theme = useTheme();
  
  // State for UI enhancements
  const [favoriteDestinations, setFavoriteDestinations] = useState([]);
  const [expandedDestinationId, setExpandedDestinationId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterSort, setFilterSort] = useState('recommended');
  const [hoverDestinationId, setHoverDestinationId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  
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
    
    // Reset expanded state
    setExpandedDestinationId(null);
  };
  
  // Handle passenger count change
  const handlePassengerCountChange = (passengers) => {
    if (passengers >= 1 && passengers <= 10) {
      onBookingDataChange('passengers', passengers);
    }
  };
  
  // Toggle expand destination details
  const handleExpandDestination = (id) => {
    setExpandedDestinationId(expandedDestinationId === id ? null : id);
  };
  
  // Toggle favorite destination
  const handleToggleFavorite = (event, id) => {
    event.stopPropagation();
    
    if (favoriteDestinations.includes(id)) {
      setFavoriteDestinations(favoriteDestinations.filter(fav => fav !== id));
    } else {
      setFavoriteDestinations([...favoriteDestinations, id]);
    }
  };
  
  // Handle sort/filter change
  const handleSortFilterChange = (event, newValue) => {
    if (newValue !== null) {
      setFilterSort(newValue);
    }
  };
  
  // Toggle showing filters
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Calculate total days
  const travelDuration = bookingData.departureDate && bookingData.returnDate 
    ? Math.ceil((bookingData.returnDate - bookingData.departureDate) / (1000 * 60 * 60 * 24)) 
    : 0;

  // Sort destinations based on selected filter
  const sortedDestinations = [...availableDestinations].sort((a, b) => {
    switch (filterSort) {
      case 'priceAsc':
        return a.basePrice - b.basePrice;
      case 'priceDesc':
        return b.basePrice - a.basePrice;
      case 'nearest':
        // Sort by travel time (assuming it's in a format we can extract number from)
        const aTime = parseInt(a.travelTime.match(/\d+/)[0]);
        const bTime = parseInt(b.travelTime.match(/\d+/)[0]);
        return aTime - bTime;
      default: // 'recommended'
        return favoriteDestinations.includes(b.id) - favoriteDestinations.includes(a.id);
    }
  });
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    expanded: { 
      scale: 1.02, 
      zIndex: 2,
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3), 0 0 20px rgba(140, 158, 255, 0.3)' 
    }
  };
  
  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: {
          duration: 0.4
        },
        opacity: {
          duration: 0.25,
          delay: 0.15
        }
      }
    }
  };
  
  return (
    <Box>
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          display: 'inline-block'
        }}
      >
        Select Your Journey Details
      </Typography>
      
      <Box 
        component={motion.div}
        initial={{ width: 0 }}
        animate={{ width: '100px' }}
        transition={{ duration: 0.8 }}
        sx={{
          height: '3px',
          background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 50%, rgba(140, 158, 255, 0) 100%)',
          mb: 4,
          borderRadius: 1,
          boxShadow: '0 0 8px rgba(140, 158, 255, 0.5)',
        }}
      />
      
      <Grid container spacing={4}>
        {/* Left Section - Journey Details */}
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600, 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1.5
                  }}
                >
                  <CalendarMonthIcon sx={{ color: theme.palette.primary.main }} />
                  Your Travel Timeline
                </Typography>
                
                <Paper 
                  sx={{ 
                    p: 3, 
                    background: 'rgba(16, 20, 42, 0.5)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 3,
                    border: '1px solid rgba(140, 158, 255, 0.2)',
                    mb: 3
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <StyledDatePicker
                        label="Departure Date"
                        value={bookingData.departureDate}
                        onChange={handleDepartureDateChange}
                        disablePast
                        minDate={addDays(new Date(), 14)} // Earliest booking is 2 weeks from now
                        sx={{ width: '100%' }}
                        components={{
                          OpenPickerIcon: CalendarMonthIcon
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <RocketLaunchIcon sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <StyledDatePicker
                        label="Return Date"
                        value={bookingData.returnDate}
                        onChange={handleReturnDateChange}
                        disablePast
                        minDate={addDays(bookingData.departureDate, 1)} // Return must be after departure
                        sx={{ width: '100%' }}
                        components={{
                          OpenPickerIcon: CalendarMonthIcon
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventAvailableIcon sx={{ color: theme.palette.primary.light }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  {/* Date visualization */}
                  <Box sx={{ mt: 3, position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                        {format(bookingData.departureDate, 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                        {format(bookingData.returnDate, 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      height: 6, 
                      borderRadius: 3, 
                      bgcolor: 'rgba(140, 158, 255, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        component={motion.div}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8 }}
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                          boxShadow: '0 0 10px rgba(140, 158, 255, 0.5)',
                          borderRadius: 3
                        }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="h4" 
                      align="center" 
                      sx={{ 
                        mt: 2, 
                        fontWeight: 700, 
                        color: 'white'
                      }}
                      component={motion.div}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {travelDuration} {travelDuration === 1 ? 'Day' : 'Days'}
                    </Typography>
                    
                    <Typography variant="body2" align="center" color="rgba(255, 255, 255, 0.7)">
                      Total Journey Duration
                    </Typography>
                  </Box>
                </Paper>
                
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600, 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1.5
                  }}
                >
                  <GroupsIcon sx={{ color: theme.palette.primary.main }} />
                  Passenger Information
                </Typography>
                
                <Paper 
                  sx={{ 
                    p: 3, 
                    background: 'rgba(16, 20, 42, 0.5)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 3,
                    border: '1px solid rgba(140, 158, 255, 0.2)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <IconButton 
                      onClick={() => handlePassengerCountChange(bookingData.passengers - 1)}
                      disabled={bookingData.passengers <= 1}
                      sx={{ 
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-disabled': {
                          color: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    
                    <Box 
                      sx={{ 
                        mx: 3, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center'
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                        {bookingData.passengers}
                      </Typography>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        {bookingData.passengers === 1 ? 'Passenger' : 'Passengers'}
                      </Typography>
                    </Box>
                    
                    <IconButton 
                      onClick={() => handlePassengerCountChange(bookingData.passengers + 1)}
                      disabled={bookingData.passengers >= 10}
                      sx={{ 
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-disabled': {
                          color: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ px: 3 }}>
                    <StyledSlider
                      value={bookingData.passengers}
                      onChange={(e, newValue) => handlePassengerCountChange(newValue)}
                      step={1}
                      marks
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                    />
                    
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      <Grid item xs={4} sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                          1 traveler
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                          5 travelers
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                          10 travelers
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Box>
            </Stack>
          </LocalizationProvider>
          
          {/* Additional information section */}
          <Box 
            sx={{ 
              mt: 3,
              p: 2.5, 
              borderRadius: 2, 
              bgcolor: 'rgba(22, 27, 51, 0.6)',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              component={motion.div}
              animate={{
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(140, 158, 255, 0.15) 0%, rgba(140, 158, 255, 0) 70%)',
                filter: 'blur(20px)',
                zIndex: 0
              }}
            />
            
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                position: 'relative',
                zIndex: 1
              }}
            >
              Included in All Space Journeys:
            </Typography>
            
            <Grid container spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    Pre-flight Training (3 days)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    Medical Check-up
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    Custom Space Suit Fitting
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    Zero-G Preparation
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    Emergency Protocols Training
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    Space Travel Insurance
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        
        {/* Right Section - Destination Selection */}
        <Grid item xs={12} md={6}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              mt: { xs: 2, md: 0 },
              mb: 3,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            Select Your Destination
          </Typography>
          
          {/* Filters and sorting */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2
            }}
          >
            <StyledToggleButtonGroup
              value={filterSort}
              exclusive
              onChange={handleSortFilterChange}
              aria-label="sort options"
              size="small"
            >
              <ToggleButton value="recommended" aria-label="recommended">
                <StarIcon fontSize="small" sx={{ mr: 0.5 }} />
                Best
              </ToggleButton>
              <ToggleButton value="priceAsc" aria-label="price ascending">
                <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                Low-High
              </ToggleButton>
              <ToggleButton value="nearest" aria-label="nearest">
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                Quickest
              </ToggleButton>
            </StyledToggleButtonGroup>
            
            <IconButton 
              onClick={handleToggleFilters}
              sx={{ 
                color: 'white',
                background: showFilters ? 'rgba(140, 158, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(140, 158, 255, 0.2)',
                }
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
          
          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    background: 'rgba(16, 20, 42, 0.5)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2,
                    border: '1px solid rgba(140, 158, 255, 0.2)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                    Quick Filters
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label="Family Friendly" 
                      onClick={() => {}}
                      sx={{ 
                        bgcolor: 'rgba(140, 158, 255, 0.15)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(140, 158, 255, 0.25)',
                        }
                      }}
                    />
                    <Chip 
                      label="Zero-G Experience" 
                      onClick={() => {}}
                      sx={{ 
                        bgcolor: 'rgba(255, 158, 128, 0.15)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255, 158, 128, 0.25)',
                        }
                      }}
                    />
                    <Chip 
                      label="Surface Excursions" 
                      onClick={() => {}}
                      sx={{ 
                        bgcolor: 'rgba(187, 134, 252, 0.15)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(187, 134, 252, 0.25)',
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Destination Cards */}
          <Box sx={{ mt: 3 }}>
            <AnimatePresence>
              {sortedDestinations.map((destination, index) => (
                <Box key={destination.id} sx={{ mb: 3 }}>
                  <motion.div
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate={expandedDestinationId === destination.id ? "expanded" : "visible"}
                    whileHover={{ y: -5 }}
                    onHoverStart={() => setHoverDestinationId(destination.id)}
                    onHoverEnd={() => setHoverDestinationId(null)}
                  >
                    <GlowingCard selected={bookingData.destination?.id === destination.id}>
                      <CardActionArea 
                        onClick={() => handleDestinationSelect(destination)}
                        sx={{ height: '100%' }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="170"
                            image={destination.imageUrl}
                            alt={destination.name}
                            sx={{
                              filter: 'brightness(0.8) contrast(1.2)',
                            }}
                          />
                          
                          {/* Overlay gradient */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '50%',
                            background: 'linear-gradient(to top, rgba(22, 27, 51, 1) 0%, rgba(22, 27, 51, 0) 100%)',
                          }} />
                          
                          {/* Badge for quick travel */}
                          {destination.travelTime.includes('day') && (
                            <GradientBadge 
                              badgeContent="Quick Trip" 
                              sx={{ 
                                position: 'absolute', 
                                top: 16, 
                                left: 16 
                              }}
                            />
                          )}
                          
                          {/* Favorite button */}
                          <IconButton
                            onClick={(e) => handleToggleFavorite(e, destination.id)}
                            sx={{ 
                              position: 'absolute', 
                              top: 10, 
                              right: 10,
                              color: favoriteDestinations.includes(destination.id) ? '#FF9E80' : 'white',
                              background: 'rgba(0, 0, 0, 0.3)',
                              backdropFilter: 'blur(5px)',
                              '&:hover': {
                                background: 'rgba(0, 0, 0, 0.5)',
                              }
                            }}
                          >
                            {favoriteDestinations.includes(destination.id) ? 
                              <FavoriteIcon /> : <FavoriteBorderIcon />}
                          </IconButton>
                          
                          {/* Launch date */}
                          <Box 
                            sx={{
                              position: 'absolute', 
                              bottom: 10, 
                              right: 10,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              background: 'rgba(0, 0, 0, 0.5)',
                              backdropFilter: 'blur(5px)',
                              borderRadius: 10,
                              px: 1.5,
                              py: 0.5
                            }}
                          >
                            <EventAvailableIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                              {destination.nextLaunch}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <CardContent sx={{ position: 'relative' }}>
                          <Box sx={{ mb: 1.5 }}>
                            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                              {destination.name}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                              <Chip 
                                icon={<RocketLaunchIcon fontSize="small" />} 
                                label={`${destination.travelTime} journey`}
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(140, 158, 255, 0.15)',
                                  color: 'white',
                                  '& .MuiChip-icon': {
                                    color: theme.palette.primary.main
                                  }
                                }}
                              />
                              
                              <Chip 
                                icon={<PublicIcon fontSize="small" />} 
                                label={destination.type}
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(140, 158, 255, 0.15)',
                                  color: 'white',
                                  '& .MuiChip-icon': {
                                    color: theme.palette.primary.main
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            color="rgba(255, 255, 255, 0.8)" 
                            paragraph
                            sx={{ 
                              height: expandedDestinationId === destination.id ? 'auto' : '2.5em',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: expandedDestinationId === destination.id ? 'unset' : 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {destination.description}
                          </Typography>
                          
                          {/* Price and expand button */}
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-end'
                            }}
                          >
                            <Box>
                              <Typography variant="overline" display="block" color="rgba(255, 255, 255, 0.6)">
                                Starting from
                              </Typography>
                              <Typography 
                                variant="h6" 
                                color="primary"
                                sx={{ 
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}
                              >
                                <AttachMoneyIcon fontSize="small" />
                                {destination.basePrice.toLocaleString()}
                              </Typography>
                            </Box>
                            
                            <Tooltip 
                              title="Show more details" 
                              placement="top"
                              open={hoverDestinationId === destination.id && showTooltip}
                              onOpen={() => setShowTooltip(true)}
                              onClose={() => setShowTooltip(false)}
                              TransitionComponent={Zoom}
                              arrow
                            >
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExpandDestination(destination.id);
                                }}
                                sx={{ 
                                  color: theme.palette.primary.main,
                                  background: 'rgba(140, 158, 255, 0.1)',
                                  '&:hover': {
                                    background: 'rgba(140, 158, 255, 0.2)',
                                  }
                                }}
                              >
                                <InfoOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                      
                      {/* Expandable details section */}
                      <AnimatePresence>
                        {expandedDestinationId === destination.id && (
                          <motion.div
                            variants={expandVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                          >
                            <Divider sx={{ mx: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            
                            <Box sx={{ p: 2 }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                                Destination Highlights
                              </Typography>
                              
                              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SettingsSuggestIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                                      Advanced {destination.type} Technology
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SecurityIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                                      Enhanced Safety Protocols
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <HealthAndSafetyIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                                      Medical Support Team
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ScienceIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                                      Research Opportunities
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                              
                              <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                                Launch Information
                              </Typography>
                              
                              <Box sx={{ mb: 1.5 }}>
                                <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" display="block">
                                  Next available launch:
                                </Typography>
                                <Typography variant="body2" color="white">
                                  {destination.nextLaunch} (Capacity available)
                                </Typography>
                              </Box>
                              
                              <Box sx={{ mb: 1.5 }}>
                                <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" display="block">
                                  Journey time:
                                </Typography>
                                <Typography variant="body2" color="white">
                                  {destination.travelTime} each way
                                </Typography>
                              </Box>
                              
                              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" display="block" sx={{ mt: 2 }}>
                                * Select this destination to continue booking
                              </Typography>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Selected indicator */}
                      {bookingData.destination?.id === destination.id && (
                        <Box
                          component={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: 4,
                            boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </GlowingCard>
                  </motion.div>
                </Box>
              ))}
            </AnimatePresence>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TripSelectionStep;