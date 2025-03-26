// src/components/common/SpaceDestinationCard.js
import React, { useState } from 'react';
import { 
  Card, CardMedia, CardContent, Typography, Button, Box, 
  Chip, Rating, Divider, IconButton, Collapse, Tooltip, 
  alpha, useTheme, Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExploreIcon from '@mui/icons-material/Explore';
import StarIcon from '@mui/icons-material/Star';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PublicIcon from '@mui/icons-material/Public';
import TerrainIcon from '@mui/icons-material/Terrain';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import ShieldIcon from '@mui/icons-material/Shield';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const GlowingCard = styled(Card)(({ theme, isHovered, featured }) => ({
  background: 'rgba(22, 27, 51, 0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isHovered ? 'rgba(140, 158, 255, 0.4)' : 'rgba(140, 158, 255, 0.15)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
  boxShadow: isHovered 
    ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(140, 158, 255, 0.4)' 
    : featured
      ? '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 10px rgba(140, 158, 255, 0.2)'
      : '0 8px 20px rgba(0, 0, 0, 0.3)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
}));

const FeatureChip = styled(Chip)(({ theme, color = 'primary' }) => {
  const colors = {
    primary: {
      bg: alpha(theme.palette.primary.main, 0.15),
      color: theme.palette.primary.main,
      border: alpha(theme.palette.primary.main, 0.3),
    },
    secondary: {
      bg: alpha(theme.palette.secondary.main, 0.15),
      color: theme.palette.secondary.main,
      border: alpha(theme.palette.secondary.main, 0.3),
    },
    success: {
      bg: alpha('#4caf50', 0.15),
      color: '#4caf50',
      border: alpha('#4caf50', 0.3),
    },
    warning: {
      bg: alpha('#ff9800', 0.15),
      color: '#ff9800',
      border: alpha('#ff9800', 0.3),
    },
    error: {
      bg: alpha('#f44336', 0.15),
      color: '#f44336',
      border: alpha('#f44336', 0.3),
    },
    info: {
      bg: alpha('#2196f3', 0.15),
      color: '#2196f3',
      border: alpha('#2196f3', 0.3),
    },
  };

  return {
    backgroundColor: colors[color].bg,
    color: colors[color].color,
    border: `1px solid ${colors[color].border}`,
    '& .MuiChip-icon': {
      color: colors[color].color,
    },
  };
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  transition: 'all 0.3s ease',
}));

const BookmarkButton = styled(IconButton)(({ theme, bookmarked }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(4px)',
  color: bookmarked ? theme.palette.secondary.main : 'white',
  zIndex: 10,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}));

const FeaturedBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 0,
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  padding: theme.spacing(0.5, 2),
  borderTopRightRadius: 16,
  borderBottomRightRadius: 16,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
}));

const AvailabilityBadge = styled(Box)(({ theme, status }) => {
  let color = '#4caf50'; // available by default
  
  if (status === 'limited') {
    color = '#ff9800';
  } else if (status === 'waitlist') {
    color = '#f44336';
  }
  
  return {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    color: 'white',
    fontWeight: 500,
    fontSize: '0.75rem',
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 12,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    '& .status-dot': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: color,
    },
  };
});

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.secondary.main,
  },
  '& .MuiRating-iconEmpty': {
    color: alpha(theme.palette.secondary.main, 0.3),
  },
}));

const DestinationTypeChip = ({ type }) => {
  const theme = useTheme();
  
  switch(type) {
    case 'Orbital Station':
    case 'Space Station':
      return (
        <FeatureChip 
          icon={<PublicIcon />} 
          label={type} 
          size="small" 
          color="primary"
        />
      );
    case 'Planetary Base':
    case 'Mars Base':
      return (
        <FeatureChip 
          icon={<TerrainIcon />} 
          label={type} 
          size="small" 
          color="secondary"
        />
      );
    case 'Lunar Base':
    case 'Moon Base':
      return (
        <FeatureChip 
          icon={<ViewInArIcon />} 
          label={type} 
          size="small" 
          color="info"
        />
      );
    default:
      return (
        <FeatureChip 
          icon={<ExploreIcon />} 
          label={type} 
          size="small" 
          color="primary"
        />
      );
  }
};

const SpaceDestinationCard = ({ 
  destination, 
  onBookNow,
  variant = 'standard', // standard, compact, featured
  showDetails = true,
  showRating = true,
  horizontal = false,
  actionButtons = true
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  // Extract destination properties with defaults for missing data
  const {
    id,
    name = 'Space Destination',
    description = 'Experience an amazing journey through space.',
    imageUrl = '/images/default-destination.jpg',
    basePrice = 100000,
    type = 'Space Destination',
    travelTime = '3 days',
    nextLaunch = 'Coming Soon',
    rating = 4.5,
    reviewCount = 24,
    availability = 'available', // available, limited, waitlist
    features = [],
    isFeatured = false,
    gravity = '0G',
    temperature = 'Controlled',
    connectivity = 'Limited',
    safety = 'High',
    capacity = '120 travelers',
  } = destination;
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const toggleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };
  
  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow(destination);
    }
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Format price display
  const formatPrice = (price) => {
    return price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : `$${(price / 1000).toFixed(0)}K`;
  };
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <GlowingCard 
        isHovered={isHovered}
        featured={isFeatured}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ 
          flexDirection: 'row',
          height: 120
        }}
      >
        <CardMedia
          component="img"
          sx={{ 
            width: 120,
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          image={imageUrl}
          alt={name}
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'white', mb: 0.5 }}>
              {name}
            </Typography>
            <DestinationTypeChip type={type} />
          </Box>
          
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
              {formatPrice(basePrice)}
            </Typography>
            
            <ActionButton
              size="small"
              variant="contained"
              color="primary"
              onClick={handleBookNow}
              startIcon={<RocketLaunchIcon />}
            >
              Book
            </ActionButton>
          </Box>
        </Box>
      </GlowingCard>
    );
  }
  
  // Horizontal variant (for featured sections)
  if (horizontal) {
    return (
      <GlowingCard 
        isHovered={isHovered}
        featured={isFeatured}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ 
          flexDirection: { xs: 'column', md: 'row' },
          height: { xs: 'auto', md: 280 }
        }}
      >
        {isFeatured && (
          <FeaturedBadge>
            <StarIcon fontSize="small" />
            Featured
          </FeaturedBadge>
        )}
        
        <BookmarkButton 
          bookmarked={bookmarked} 
          onClick={toggleBookmark}
          size="small"
        >
          {bookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
        </BookmarkButton>
        
        <Box sx={{ position: 'relative', width: { xs: '100%', md: 300 } }}>
          <CardMedia
            component="img"
            sx={{ 
              height: { xs: 200, md: '100%' },
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            }}
            image={imageUrl}
            alt={name}
          />
          
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
          }} />
          
          <AvailabilityBadge status={availability}>
            <span className="status-dot" />
            {availability === 'available' 
              ? 'Spaces Available'
              : availability === 'limited'
                ? 'Limited Availability'
                : 'Join Waitlist'
            }
          </AvailabilityBadge>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <DestinationTypeChip type={type} />
            
            {showRating && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledRating 
                  value={rating} 
                  precision={0.5} 
                  readOnly 
                  icon={<StarIcon fontSize="small" />}
                  emptyIcon={<StarIcon fontSize="small" />}
                  size="small"
                />
                <Typography variant="caption" sx={{ ml: 0.5, color: 'rgba(255,255,255,0.7)' }}>
                  ({reviewCount})
                </Typography>
              </Box>
            )}
          </Box>
          
          <Typography variant="h5" sx={{ fontWeight: 600, color: isHovered ? theme.palette.primary.main : 'white', mb: 1 }}>
            {name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="rgba(255,255,255,0.7)" 
            sx={{ 
              mb: 2,
              maxHeight: 80,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon 
                fontSize="small" 
                sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
              />
              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                {travelTime}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RocketLaunchIcon 
                fontSize="small" 
                sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
              />
              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                {nextLaunch}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            mt: 'auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Box>
              <Typography variant="caption" color="rgba(255,255,255,0.5)">
                Starting from
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.secondary.main,
                  lineHeight: 1.2
                }}
              >
                {formatPrice(basePrice)}
              </Typography>
            </Box>
            
            {actionButtons && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Explore details">
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    size="small"
                    component={Link}
                    to={`/destinations/${id}`}
                    sx={{
                      borderColor: 'rgba(140, 158, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(140, 158, 255, 0.8)',
                        background: 'rgba(140, 158, 255, 0.08)',
                      }
                    }}
                  >
                    <InfoIcon fontSize="small" />
                  </ActionButton>
                </Tooltip>
                
                <ActionButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleBookNow}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                    boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
                    }
                  }}
                >
                  Book Now
                </ActionButton>
              </Box>
            )}
          </Box>
        </Box>
      </GlowingCard>
    );
  }
  
  // Default (standard) card
  return (
    <GlowingCard 
      isHovered={isHovered}
      featured={isFeatured}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isFeatured && (
        <FeaturedBadge>
          <StarIcon fontSize="small" />
          Featured
        </FeaturedBadge>
      )}
      
      <BookmarkButton 
        bookmarked={bookmarked} 
        onClick={toggleBookmark}
        size="small"
      >
        {bookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
      </BookmarkButton>
      
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: 'transform 0.6s ease',
            transform: isHovered || expanded ? 'scale(1.08)' : 'scale(1)',
          }}
        />
        
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(0deg, rgba(22,27,51,1) 0%, rgba(22,27,51,0.7) 50%, rgba(22,27,51,0.3) 100%)',
        }} />
        
        <AvailabilityBadge status={availability}>
          <span className="status-dot" />
          {availability === 'available' 
            ? 'Spaces Available'
            : availability === 'limited'
              ? 'Limited Availability'
              : 'Join Waitlist'
          }
        </AvailabilityBadge>
      </Box>
      
      <CardContent 
        component={motion.div}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <DestinationTypeChip type={type} />
          
          {showRating && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StyledRating 
                value={rating} 
                precision={0.5} 
                readOnly 
                icon={<StarIcon fontSize="small" />}
                emptyIcon={<StarIcon fontSize="small" />}
                size="small"
              />
              <Typography variant="caption" sx={{ ml: 0.5, color: 'rgba(255,255,255,0.7)' }}>
                ({reviewCount})
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography variant="h5" component="h2" 
          sx={{ 
            mb: 1, 
            fontWeight: 600,
            color: isHovered ? theme.palette.primary.main : 'white',
            transition: 'color 0.3s ease',
          }}
        >
          {name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="rgba(255,255,255,0.7)" 
          sx={{ 
            mb: 2,
            maxHeight: 60,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon 
              fontSize="small" 
              sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
            />
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              {travelTime}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon 
              fontSize="small" 
              sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
            />
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              {capacity}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalOfferIcon 
              fontSize="small" 
              sx={{ color: theme.palette.secondary.main, mr: 0.5 }} 
            />
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              Next: {nextLaunch}
            </Typography>
          </Box>
        </Box>
        
        {showDetails && (
          <>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
              
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1.5 }}>
                Destination Highlights
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {features.map((feature, index) => (
                  <FeatureChip 
                    key={index}
                    label={feature}
                    size="small"
                    color={index % 5 === 0 ? 'secondary' : 'primary'}
                    sx={{ borderRadius: 10 }}
                  />
                ))}
                
                {features.length === 0 && (
                  <>
                    <FeatureChip 
                      label="Space Views"
                      size="small"
                      color="primary"
                      sx={{ borderRadius: 10 }}
                    />
                    <FeatureChip 
                      label="Life Support"
                      size="small"
                      color="success"
                      sx={{ borderRadius: 10 }}
                    />
                    <FeatureChip 
                      label="Dining"
                      size="small"
                      color="secondary"
                      sx={{ borderRadius: 10 }}
                    />
                  </>
                )}
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 2,
                mb: 1 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ThermostatIcon 
                    fontSize="small" 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      mr: 1, 
                      opacity: 0.8 
                    }} 
                  />
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" display="block">
                      Temperature
                    </Typography>
                    <Typography variant="body2" color="white">
                      {temperature}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShieldIcon 
                    fontSize="small" 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      mr: 1, 
                      opacity: 0.8 
                    }} 
                  />
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" display="block">
                      Safety Rating
                    </Typography>
                    <Typography variant="body2" color="white">
                      {safety}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ViewInArIcon 
                    fontSize="small" 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      mr: 1, 
                      opacity: 0.8 
                    }} 
                  />
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" display="block">
                      Gravity
                    </Typography>
                    <Typography variant="body2" color="white">
                      {gravity}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SignalWifiStatusbar4BarIcon 
                    fontSize="small" 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      mr: 1, 
                      opacity: 0.8 
                    }} 
                  />
                  <Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)" display="block">
                      Connectivity
                    </Typography>
                    <Typography variant="body2" color="white">
                      {connectivity}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Collapse>
            
            <Button 
              onClick={toggleExpanded}
              sx={{ 
                color: theme.palette.primary.main,
                fontSize: '0.8rem',
                py: 0,
                px: 1,
                minWidth: 'auto',
                alignSelf: 'flex-start',
                mb: 1,
                '&:hover': {
                  backgroundColor: 'rgba(140, 158, 255, 0.08)',
                }
              }}
              startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {expanded ? 'Less info' : 'More info'}
            </Button>
          </>
        )}
        
        <Box sx={{
          mt: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="caption" color="rgba(255,255,255,0.5)">
              Starting from
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.secondary.main,
                lineHeight: 1.2
              }}
            >
              {formatPrice(basePrice)}
            </Typography>
          </Box>
          
          {actionButtons && (
            <Box>
              <ActionButton
                variant="contained"
                color="primary"
                onClick={handleBookNow}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                  boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
                  }
                }}
              >
                Book Now
              </ActionButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </GlowingCard>
  );
};

export default SpaceDestinationCard;