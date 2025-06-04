// src/components/booking/AccommodationStep.js
import React, { useState, useEffect } from 'react';
import { 
  Grid, Typography, Box, Card, CardContent, CardActionArea, 
  Divider, Rating, Chip, useTheme, alpha, Collapse,
  Tooltip, Paper, LinearProgress, Badge, CardMedia
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import HotelIcon from '@mui/icons-material/Hotel';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShowerIcon from '@mui/icons-material/Shower';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import WindowIcon from '@mui/icons-material/Window';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SpaIcon from '@mui/icons-material/Spa';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AirIcon from '@mui/icons-material/Air';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

// Styled Components
const GlowingCard = styled(Card)(({ theme, isSelected }) => ({
  height: '100%',
  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
  boxShadow: isSelected 
    ? `0 0 30px ${alpha(theme.palette.primary.main, 0.7)}` 
    : '0 8px 25px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: isSelected 
    ? `2px solid ${theme.palette.primary.main}` 
    : '1px solid rgba(140, 158, 255, 0.25)',
  background: 'rgba(22, 27, 51, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'rgba(140, 158, 255, 0.15)',
  border: '1px solid rgba(140, 158, 255, 0.3)',
  color: 'white',
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  }
}));

const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'rgba(11, 13, 27, 0.9)',
  backdropFilter: 'blur(8px)',
  padding: theme.spacing(1, 2),
  borderRadius: 16,
  border: '1px solid rgba(140, 158, 255, 0.3)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  zIndex: 2,
}));

const AccentDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  borderColor: 'rgba(140, 158, 255, 0.2)',
  '&::before, &::after': {
    borderColor: 'rgba(140, 158, 255, 0.1)',
  },
}));

const ValueBar = styled(LinearProgress)(({ theme, value }) => {
  let barColor;
  if (value < 40) barColor = '#FF9E80';
  else if (value < 70) barColor = '#FFD54F';
  else barColor = '#66BB6A';
  
  return {
    height: 4,
    borderRadius: 2,
    backgroundColor: alpha(barColor, 0.2),
    marginTop: 4,
    marginBottom: 8,
    '& .MuiLinearProgress-bar': {
      backgroundColor: barColor,
      borderRadius: 2,
    }
  };
});

// Helper function to get icons for features
const getFeatureIcon = (feature) => {
  const iconMap = {
    'Private Bathroom': <ShowerIcon fontSize="small" />,
    'Shared Bathroom': <ShowerIcon fontSize="small" />,
    'Basic Amenities': <HotelIcon fontSize="small" />,
    'Enhanced Amenities': <HotelIcon fontSize="small" />,
    'Premium Amenities': <HotelIcon fontSize="small" />,
    'Luxury Bathroom': <ShowerIcon fontSize="small" />,
    'Daily Cleaning': <SanitizerIcon fontSize="small" />,
    'Room Service': <RestaurantIcon fontSize="small" />,
    'Communal Dining': <RestaurantIcon fontSize="small" />,
    'Entertainment System': <LiveTvIcon fontSize="small" />,
    'Small Viewport': <WindowIcon fontSize="small" />,
    'Large Viewport': <WindowIcon fontSize="small" />,
    'Private Excursions': <ViewInArIcon fontSize="small" />,
    'Zero-G Area': <AirIcon fontSize="small" />,
    'Luxury Suite': <HotelIcon fontSize="small" />,
    'Gourmet Dining': <RestaurantIcon fontSize="small" />,
    'Climate Control': <WbSunnyIcon fontSize="small" />,
    'Private Quarters': <BedtimeIcon fontSize="small" />,
    'Enhanced Security': <EnhancedEncryptionIcon fontSize="small" />,
    'Wi-Fi': <WifiIcon fontSize="small" />,
    'Bar': <LocalBarIcon fontSize="small" />,
    'Fitness Area': <FitnessCenterIcon fontSize="small" />,
    'Spa Access': <SpaIcon fontSize="small" />,
    // Add more mappings as needed
  };
  
  // Default return a hotel icon if no mapping found
  return iconMap[feature] || <HotelIcon fontSize="small" />;
};

// Calculate a comparative value score (1-100) for an accommodation
const calculateValueScore = (price, features) => {
  // Basic algorithm: more features, better value relative to price
  const baseValue = 40; // Base value score
  const featureValue = features.length * 5; // Each feature adds 5 points
  const priceAdjustment = Math.min(price / 10000, 20); // Higher price reduces value (max 20 point reduction)
  
  return Math.min(100, Math.max(10, baseValue + featureValue - priceAdjustment));
};

const AccommodationStep = ({ bookingData, availableAccommodations, onBookingDataChange }) => {
  const theme = useTheme();
  const [expandedCard, setExpandedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  
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

  // Toggle expanded state for a card
  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };
  
  // Animation variants
  const cardVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  // Content container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Mock feature images for accommodations (placeholder URLs)
  const featureImages = {
    "Private Bathroom": "/images/features/private-bathroom.jpg",
    "Gourmet Dining": "/images/features/gourmet-dining.jpg",
    "Large Viewport": "/images/features/large-viewport.jpg",
    "Entertainment System": "/images/features/entertainment.jpg",
  };
  
  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            pl: 2,
            py: 1
          }}
        >
          <HotelIcon 
            sx={{ 
              color: theme.palette.primary.main,
              filter: 'drop-shadow(0 0 5px rgba(140, 158, 255, 0.5))'
            }} 
          />
          Select Your Space Accommodation
        </Typography>
      </motion.div>
      
      <AccentDivider />
      
      <Box 
        sx={{ 
          mb: 4,
          p: 3,
          background: 'rgba(140, 158, 255, 0.1)',
          backdropFilter: 'blur(5px)',
          borderRadius: 2,
          border: '1px dashed rgba(140, 158, 255, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated accent glow */}
        <Box
          component={motion.div}
          animate={{
            opacity: [0.3, 0.6, 0.3],
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
            width: 150,
            height: 150,
            background: 'radial-gradient(circle, rgba(140, 158, 255, 0.2) 0%, rgba(140, 158, 255, 0) 70%)',
            filter: 'blur(30px)',
            zIndex: 0
          }}
        />
        
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            color: 'white',
            position: 'relative',
            zIndex: 1,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          Choose where you'll stay during your {duration}-day journey to{' '}
          <Box component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {bookingData.destination?.name}
          </Box>. 
          Each accommodation option offers a unique space experience with varying amenities and views.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, position: 'relative', zIndex: 1 }}>
          <FeatureChip icon={<BedtimeIcon />} label="Private Quarters" />
          <FeatureChip icon={<WindowIcon />} label="Space Views" />
          <FeatureChip icon={<AirIcon />} label="Gravity Control" />
          <FeatureChip icon={<RestaurantIcon />} label="Space Cuisine" />
        </Box>
      </Box>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {availableAccommodations.map((accommodation) => {
            const isSelected = bookingData.accommodation?.id === accommodation.id;
            const isHovered = hoveredCard === accommodation.id;
            const valueScore = calculateValueScore(accommodation.pricePerNight, accommodation.features);
            
            return (
              <Grid 
                item 
                xs={12} 
                md={4} 
                key={accommodation.id}
                component={motion.div}
                variants={itemVariants}
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredCard(accommodation.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <GlowingCard isSelected={isSelected}>
                    <CardActionArea 
                      onClick={() => handleAccommodationSelect(accommodation)}
                      sx={{ 
                        height: '100%',
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'stretch',
                        '&:hover': {
                          '& .MuiCardActionArea-focusHighlight': {
                            opacity: isSelected ? 0 : 0.1
                          }
                        }
                      }}
                    >
                      {/* Accommodation image */}
                      <Box sx={{ position: 'relative', height: 160 }}>
                        {/* This would be a real image in production */}
                        <Box 
                          sx={{ 
                            height: '100%',
                            background: `linear-gradient(45deg, 
                              ${accommodation.id % 3 === 0 ? '#1A237E' : accommodation.id % 3 === 1 ? '#311B92' : '#4A148C'} 0%, 
                              ${accommodation.id % 3 === 0 ? '#3949AB' : accommodation.id % 3 === 1 ? '#5E35B1' : '#7B1FA2'} 100%)`,
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Simulate stars in the space scene */}
                          {Array.from({ length: 30 }).map((_, i) => (
                            <Box
                              key={`star-${accommodation.id}-${i}`}
                              sx={{
                                position: 'absolute',
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 2 + 1}px`,
                                height: `${Math.random() * 2 + 1}px`,
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                opacity: Math.random() * 0.7 + 0.3,
                              }}
                            />
                          ))}
                          
                          {/* Earth/Moon/Mars in the background based on ID */}
                          <Box 
                            component={motion.div}
                            animate={{ 
                              y: [0, -5, 0],
                              rotate: 360
                            }}
                            transition={{
                              y: { 
                                duration: 5, 
                                repeat: Infinity,
                                repeatType: 'loop'
                              },
                              rotate: {
                                duration: 30,
                                repeat: Infinity,
                                ease: 'linear'
                              }
                            }}
                            sx={{
                              position: 'absolute',
                              right: '10%',
                              top: '20%',
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              background: accommodation.id % 3 === 0 
                                ? 'radial-gradient(circle at 70% 30%, #2196F3 0%, #0D47A1 100%)' // Earth 
                                : accommodation.id % 3 === 1
                                  ? 'radial-gradient(circle at 70% 30%, #F5F5F5 0%, #9E9E9E 100%)' // Moon
                                  : 'radial-gradient(circle at 70% 30%, #FF5722 0%, #BF360C 100%)', // Mars
                              boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                              opacity: 0.7,
                            }}
                          />
                          
                          {/* Accommodation pod visualization */}
                          <Box 
                            sx={{
                              position: 'absolute',
                              left: '15%',
                              bottom: '10%',
                              width: 90,
                              height: 40,
                              borderRadius: 2,
                              background: 'rgba(255, 255, 255, 0.15)',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: '40%',
                                top: '25%',
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                        </Box>
                        
                        {/* Gradient overlay */}
                        <Box 
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '60%',
                            background: 'linear-gradient(to top, rgba(22, 27, 51, 1) 0%, rgba(22, 27, 51, 0) 100%)',
                          }}
                        />
                        
                        {/* Accommodation name overlay */}
                        <Typography 
                          variant="h6"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            padding: 2,
                            color: 'white',
                            fontWeight: 600,
                            zIndex: 1,
                            textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          {accommodation.name}
                        </Typography>
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <Box
                            component={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            sx={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              bgcolor: 'rgba(11, 13, 27, 0.8)',
                              backdropFilter: 'blur(4px)',
                              color: theme.palette.primary.main,
                              borderRadius: '50%',
                              width: 36,
                              height: 36,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `2px solid ${theme.palette.primary.main}`,
                              zIndex: 2,
                            }}
                          >
                            <CheckCircleIcon />
                          </Box>
                        )}
                        
                        {/* Price tag */}
                        <PriceTag>
                          <Typography 
                            variant="h6" 
                            component="div" 
                            color={theme.palette.primary.main} 
                            sx={{ fontWeight: 700 }}
                          >
                            {`$${accommodation.pricePerNight.toLocaleString()}`}
                          </Typography>
                          <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                            per night
                          </Typography>
                        </PriceTag>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating 
                                value={accommodation.rating} 
                                precision={0.5} 
                                readOnly 
                                sx={{
                                  '& .MuiRating-iconFilled': {
                                    color: theme.palette.primary.main,
                                  }
                                }}
                              />
                              <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                                {accommodation.rating.toFixed(1)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Tooltip 
                            title="Shows the value of this accommodation based on price and amenities"
                            placement="top"
                          >
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  gap: 0.5
                                }}
                              >
                                <PriceChangeIcon sx={{ fontSize: 14 }} />
                                Value:
                              </Typography>
                              <ValueBar variant="determinate" value={valueScore} />
                            </Box>
                          </Tooltip>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Tooltip title="Accommodation size">
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                color: 'rgba(255, 255, 255, 0.7)',
                                gap: 0.5
                              }}
                            >
                              <SquareFootIcon sx={{ fontSize: 16 }} />
                              {accommodation.id * 5 + 20} m²
                            </Typography>
                          </Tooltip>
                          
                          <Tooltip title="Maximum capacity">
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                color: 'rgba(255, 255, 255, 0.7)',
                                gap: 0.5
                              }}
                            >
                              <PersonIcon sx={{ fontSize: 16 }} />
                              {accommodation.id + 1} person{accommodation.id > 0 ? 's' : ''}
                            </Typography>
                          </Tooltip>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="rgba(255, 255, 255, 0.8)" 
                          sx={{ 
                            minHeight: { xs: 'auto', md: '75px' },
                            mb: 2
                          }}
                        >
                          {accommodation.description}
                        </Typography>
                        
                        <AccentDivider />
                        
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'white' }}>
                          Key Features:
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                          {accommodation.features.slice(0, 4).map((feature, index) => (
                            <FeatureChip 
                              key={index} 
                              label={feature} 
                              size="small"
                              icon={getFeatureIcon(feature)}
                            />
                          ))}
                          
                          {accommodation.features.length > 4 && (
                            <Tooltip 
                              title={accommodation.features.slice(4).join(', ')}
                              placement="top"
                            >
                              <Chip 
                                size="small"
                                label={`+${accommodation.features.length - 4} more`}
                                sx={{ 
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  color: 'white',
                                  borderColor: 'rgba(255, 255, 255, 0.2)',
                                  border: '1px solid'
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                        
                        <Box 
                          sx={{ 
                            mt: 2,
                            p: 1,
                            textAlign: 'center',
                            borderRadius: 1,
                            background: isSelected ? 'rgba(140, 158, 255, 0.15)' : 'transparent',
                            border: isSelected ? '1px dashed rgba(140, 158, 255, 0.4)' : 'none',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Typography 
                            variant="subtitle2" 
                            color={isSelected ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.6)'}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                Selected
                              </>
                            ) : (
                              'Click to select'
                            )}
                          </Typography>
                        </Box>
                        
                        {/* Expanded details section */}
                        <Collapse in={expandedCard === accommodation.id}>
                          <Box sx={{ mt: 2 }}>
                            <Typography 
                              variant="subtitle2" 
                              gutterBottom
                              sx={{ color: 'white' }}
                            >
                              All Features:
                            </Typography>
                            
                            <Grid container spacing={1}>
                              {accommodation.features.map((feature, index) => (
                                <Grid item xs={6} key={index}>
                                  <Box 
                                    sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      gap: 1,
                                      py: 0.5
                                    }}
                                  >
                                    <Box sx={{ color: theme.palette.primary.main }}>
                                      {getFeatureIcon(feature)}
                                    </Box>
                                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                                      {feature}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                            
                            <AccentDivider />
                            
                            <Typography 
                              variant="subtitle2" 
                              gutterBottom
                              sx={{ color: 'white', mt: 1 }}
                            >
                              Price Breakdown:
                            </Typography>
                            
                            <Box 
                              sx={{ 
                                p: 1.5, 
                                border: '1px solid rgba(140, 158, 255, 0.2)',
                                borderRadius: 1,
                                mb: 2
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                  {`$${accommodation.pricePerNight.toLocaleString()} × ${duration} nights`}
                                </Typography>
                                <Typography variant="body2" color="white" fontWeight={500}>
                                  {`$${(accommodation.pricePerNight * duration).toLocaleString()}`}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                  Space amenities fee
                                </Typography>
                                <Typography variant="body2" color="white" fontWeight={500}>
                                  ${(accommodation.pricePerNight * 0.1).toLocaleString()}
                                </Typography>
                              </Box>
                              
                              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" color="white">
                                  Total
                                </Typography>
                                <Typography variant="subtitle2" color={theme.palette.primary.main} fontWeight={600}>
                                  ${(accommodation.pricePerNight * duration * 1.1).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Collapse>
                        
                        {/* Expand/collapse toggle */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mt: 1,
                            cursor: 'pointer',
                            color: theme.palette.primary.light,
                            opacity: 0.7,
                            '&:hover': {
                              opacity: 1
                            },
                            transition: 'opacity 0.3s ease'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleExpand(accommodation.id);
                          }}
                        >
                          <Typography variant="caption">
                            {expandedCard === accommodation.id ? 'Show less' : 'Show more details'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </GlowingCard>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </motion.div>
      
      {/* Total price summary */}
      {bookingData.accommodation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            sx={{ 
              mt: 4, 
              p: 3,
              background: 'rgba(140, 158, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(140, 158, 255, 0.2)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Your Selection Summary:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <HotelIcon sx={{ color: theme.palette.primary.main, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      {bookingData.accommodation.name}
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      {`${duration} nights at $${bookingData.accommodation.pricePerNight.toLocaleString()} per night`}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: { xs: 'flex-start', md: 'flex-end' },
                    gap: 0.5
                  }}
                >
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Accommodation Total:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontWeight: 700
                    }}
                  >
                    ${(bookingData.accommodation.pricePerNight * duration).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default AccommodationStep;