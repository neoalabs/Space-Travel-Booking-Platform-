// src/components/booking/SeatClassStep.js
import React, { useState, useEffect } from 'react';
import { 
  Grid, Typography, Box, Card, CardContent, CardActionArea, 
  Divider, Chip, Rating, Button, Tooltip, IconButton,
  useTheme, alpha, Collapse, LinearProgress, Switch, FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SpaIcon from '@mui/icons-material/Spa';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import KingBedIcon from '@mui/icons-material/KingBed';
import SecurityIcon from '@mui/icons-material/Security';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BiotechIcon from '@mui/icons-material/Biotech';

// Styled components
const GlowingCard = styled(Card)(({ theme, selected }) => ({
  background: 'rgba(22, 27, 51, 0.75)',
  backdropFilter: 'blur(10px)',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(140, 158, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  transform: selected ? 'scale(1.03)' : 'scale(1)',
  boxShadow: selected 
    ? '0 0 30px rgba(140, 158, 255, 0.5)' 
    : '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: 20,
  padding: theme.spacing(1, 3),
  '&:hover': {
    background: 'linear-gradient(90deg, #6979F8 0%, #5566F6 100%)',
    boxShadow: '0 6px 20px rgba(105, 121, 248, 0.3)',
  },
}));

const FeatureItem = styled(Box)(({ theme, included = true }) => ({
  display: 'flex',
  alignItems: 'center',
  color: included ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
  padding: theme.spacing(0.75, 1),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    background: included ? 'rgba(140, 158, 255, 0.1)' : 'transparent',
  },
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
  background: 'rgba(11, 13, 27, 0.85)',
  color: 'white',
  padding: theme.spacing(0.75, 2),
  borderRadius: theme.shape.borderRadius * 2,
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(140, 158, 255, 0.3)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  zIndex: 5,
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => {
  let color = theme.palette.primary.main;
  if (value < 40) color = '#FF9E80';
  else if (value < 70) color = '#FFCC80';
  
  return {
    height: 8,
    borderRadius: 4,
    backgroundColor: alpha(color, 0.2),
    '& .MuiLinearProgress-bar': {
      borderRadius: 4,
      backgroundColor: color,
    }
  };
});

// Helper function to map features to icons
const getFeatureIcon = (feature) => {
  const featureMap = {
    'Enhanced life support': <SecurityIcon />,
    'Premium life support': <SecurityIcon color="secondary" />,
    'Basic life support': <SecurityIcon />,
    'Private cabin': <KingBedIcon />,
    'Luxury suite': <KingBedIcon color="secondary" />,
    'Shared quarters': <KingBedIcon />,
    'Gourmet meals': <RestaurantIcon color="secondary" />,
    'Standard meals': <RestaurantIcon />,
    'Premium meals': <RestaurantIcon />,
    'Limited storage': <ViewInArIcon />,
    'Increased storage': <ViewInArIcon />,
    'Entertainment system': <LiveTvIcon />,
    'Zero-G recreation': <FitnessCenterIcon color="secondary" />,
    'Fitness facilities': <FitnessCenterIcon />,
    'Wi-Fi access': <WifiIcon />,
    'Personal chef': <RestaurantIcon color="secondary" />,
    'Exclusive excursions': <ViewInArIcon color="secondary" />,
    'Medical support': <MedicalServicesIcon />,
    'Full medical support': <MedicalServicesIcon color="secondary" />,
    'Priority scheduling': <SpeedIcon color="secondary" />,
    'Research access': <BiotechIcon />,
    'Spa services': <SpaIcon color="secondary" />,
    'Private lounge': <LocalBarIcon color="secondary" />,
  };
  
  // Default icon if not found in map
  return featureMap[feature] || <CheckCircleIcon />;
};

const SeatClassStep = ({ bookingData, availableSeatClasses, onBookingDataChange }) => {
  const theme = useTheme();
  
  // States
  const [expandedId, setExpandedId] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Handle seat class selection
  const handleSeatClassSelect = (seatClass) => {
    onBookingDataChange('seatClass', seatClass);
  };

  // Toggle expanded view for a seat class
  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Feature rating calculation (for visualization)
  const calculateFeatureRating = (seatClass) => {
    const baseRating = 20; // Base rating points
    const featuresCount = seatClass.features.length;
    
    // Calculate additional rating based on class and features
    let additionalRating = 0;
    
    if (seatClass.name.includes('VIP') || seatClass.name.includes('Luxury')) {
      additionalRating += 60;
    } else if (seatClass.name.includes('Comfort') || seatClass.name.includes('Business')) {
      additionalRating += 40;
    } else {
      additionalRating += 20;
    }
    
    // Add points for each feature beyond the basic set
    const extraFeatures = Math.max(0, featuresCount - 4);
    additionalRating += extraFeatures * 5;
    
    return Math.min(100, baseRating + additionalRating);
  };

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
    })
  };

  const selectedAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 0.5 }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AirplaneTicketIcon sx={{ color: theme.palette.primary.main }} />
          Choose Your Space Travel Experience
        </Typography>
        
        <FormControlLabel
          control={
            <Switch 
              checked={comparing}
              onChange={(e) => setComparing(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: theme.palette.primary.main,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CompareArrowsIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">Compare</Typography>
            </Box>
          }
          sx={{
            '& .MuiFormControlLabel-label': {
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
            }
          }}
        />
      </Box>
      
      <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Typography 
        variant="body1" 
        paragraph
        color="rgba(255, 255, 255, 0.8)"
        sx={{ mb: 4 }}
      >
        Select the perfect seat class for your journey to{' '}
        <Box 
          component="span" 
          sx={{ 
            color: 'white',
            fontWeight: 600 
          }}
        >
          {bookingData.destination?.name}
        </Box>.
        Each class offers a unique space experience tailored to your preferences.
      </Typography>
      
      {/* Enhanced seat class comparison - shown when comparison mode is on */}
      {comparing && (
        <Box 
          component={motion.div}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            mb: 4,
            p: 3, 
            background: 'rgba(22, 27, 51, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: theme.shape.borderRadius * 2,
            border: '1px solid rgba(140, 158, 255, 0.2)',
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              color: 'white',
              fontWeight: 600,
              mb: 3
            }}
          >
            Class Comparison
          </Typography>
          
          <Grid container spacing={2}>
            {/* Feature names column */}
            <Grid item xs={4}>
              <Box sx={{ p: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    mb: 2,
                    visibility: 'hidden'
                  }}
                >
                  Class
                </Typography>
                
                <Box sx={{ p: 1, pt: 5 }}>
                  {['Experience Level', 'Privacy', 'Food Quality', 'Entertainment', 'Medical Support', 'Recreation', 'Storage Space'].map((feature, idx) => (
                    <Typography 
                      key={idx}
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 500,
                        py: 2.2,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Grid>
            
            {/* Class comparison columns */}
            {availableSeatClasses.map((seatClass, index) => (
              <Grid item xs={2.67} key={seatClass.id}>
                <Box 
                  sx={{ 
                    p: 1,
                    border: bookingData.seatClass?.id === seatClass.id ? `1px solid ${theme.palette.primary.main}` : 'none',
                    borderRadius: 2,
                    background: bookingData.seatClass?.id === seatClass.id ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    align="center"
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    {seatClass.name}
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    align="center"
                    color="primary"
                    sx={{ 
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    ${seatClass.price.toLocaleString()}
                  </Typography>
                  
                  <GradientButton
                    fullWidth
                    size="small"
                    variant={bookingData.seatClass?.id === seatClass.id ? "contained" : "outlined"}
                    onClick={() => handleSeatClassSelect(seatClass)}
                    sx={{ 
                      mb: 2,
                      background: bookingData.seatClass?.id === seatClass.id 
                        ? 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)'
                        : 'transparent',
                      border: bookingData.seatClass?.id === seatClass.id 
                        ? 'none'
                        : '1px solid rgba(140, 158, 255, 0.5)',
                    }}
                  >
                    {bookingData.seatClass?.id === seatClass.id ? 'Selected' : 'Select'}
                  </GradientButton>
                  
                  <Box sx={{ pt: 1 }}>
                    {/* Experience Level */}
                    <Box sx={{ py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <ProgressBar 
                        variant="determinate" 
                        value={index === 0 ? 40 : (index === 1 ? 75 : 100)} 
                      />
                    </Box>
                    
                    {/* Privacy */}
                    <Box sx={{ py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <ProgressBar 
                        variant="determinate" 
                        value={index === 0 ? 30 : (index === 1 ? 70 : 95)} 
                      />
                    </Box>
                    
                    {/* Food Quality */}
                    <Box sx={{ py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <ProgressBar 
                        variant="determinate" 
                        value={index === 0 ? 45 : (index === 1 ? 80 : 100)} 
                      />
                    </Box>
                    
                    {/* Entertainment */}
                    <Box sx={{ py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <ProgressBar 
                        variant="determinate" 
                        value={index === 0 ? 35 : (index === 1 ? 85 : 95)} 
                      />
                    </Box>
                    
                    {/* Medical Support */}
                    <Box sx={{ py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <ProgressBar 
                        variant="determinate" 
                        value={index === 0 ? 50 : (index === 1 ? 70 : 90)} 
                      />
                    </Box>
                    
                    {/* Recreation */}
                    <Box sx={{ py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <ProgressBar 
                        variant="determinate" 
                        value={index === 0 ? 20 : (index === 1 ? 60 : 100)} 
                      />
                    </Box>
                    
                    {/* Storage Space */}
                    <Box sx={{ py: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <ProgressBar 
                        variant="determinate" 
                        value={index === 0 ? 35 : (index === 1 ? 65 : 85)} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControlLabel
          control={
            <Switch 
              checked={showDetails}
              onChange={(e) => setShowDetails(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: theme.palette.primary.main,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">Show All Details</Typography>
            </Box>
          }
          sx={{
            '& .MuiFormControlLabel-label': {
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
            }
          }}
        />
      </Box>
      
      <Grid container spacing={3}>
        {availableSeatClasses.map((seatClass, index) => (
          <Grid 
            item 
            xs={12} 
            md={4} 
            key={seatClass.id}
            component={motion.div}
            variants={cardVariants}
            custom={index}
            initial="hidden"
            animate="visible"
          >
            <GlowingCard 
              selected={bookingData.seatClass?.id === seatClass.id}
              component={motion.div}
              animate={bookingData.seatClass?.id === seatClass.id ? selectedAnimation : {}}
            >
              <CardActionArea 
                onClick={() => handleSeatClassSelect(seatClass)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                {/* Class illustration - different for each class */}
                <Box sx={{ height: 120, position: 'relative', overflow: 'hidden' }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      inset: 0,
                      background: index === 0 
                        ? 'linear-gradient(135deg, rgba(140, 158, 255, 0.2) 0%, rgba(11, 13, 27, 0.9) 100%)'
                        : index === 1
                          ? 'linear-gradient(135deg, rgba(187, 134, 252, 0.2) 0%, rgba(11, 13, 27, 0.9) 100%)' 
                          : 'linear-gradient(135deg, rgba(255, 158, 128, 0.2) 0%, rgba(11, 13, 27, 0.9) 100%)',
                    }}
                  />
                  
                  {/* Animated stars/particles in the background */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Box 
                      key={`star-${i}`}
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
                        delay: i * 0.3
                      }}
                      sx={{
                        position: 'absolute',
                        width: 2 + (i % 3),
                        height: 2 + (i % 3),
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        top: 10 + (i * 10),
                        left: 10 + (i * 20),
                        boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
                      }}
                    />
                  ))}
                  
                  {/* Visual representation of seat class */}
                  <Box 
                    component={motion.div}
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: index === 0 
                        ? theme.palette.primary.main
                        : index === 1
                          ? '#BB86FC'
                          : '#FF9E80',
                      fontSize: 50,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      filter: `drop-shadow(0 0 10px ${
                        index === 0 
                          ? theme.palette.primary.main
                          : index === 1
                            ? '#BB86FC'
                            : '#FF9E80'
                      })`
                    }}
                  >
                    {index === 0 ? <ViewInArIcon fontSize="inherit" /> : 
                     index === 1 ? <KingBedIcon fontSize="inherit" /> : 
                     <SpaIcon fontSize="inherit" />}
                  </Box>
                </Box>
                
                <PriceTag>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    ${seatClass.price.toLocaleString()}
                  </Typography>
                </PriceTag>
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                    {seatClass.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating 
                      value={index === 0 ? 3 : (index === 1 ? 4 : 5)} 
                      readOnly 
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: theme.palette.primary.main,
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                      {index === 0 ? 'Standard' : (index === 1 ? 'Premium' : 'Luxury')}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="rgba(255, 255, 255, 0.8)" 
                    sx={{ 
                      mb: 2,
                      minHeight: showDetails ? 'auto' : 60
                    }}
                  >
                    {seatClass.description}
                  </Typography>
                  
                  <Box sx={{ my: 3 }}>
                    <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.9)" gutterBottom>
                      Space Class Quality
                    </Typography>
                    <ProgressBar 
                      variant="determinate" 
                      value={calculateFeatureRating(seatClass)} 
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                        Essential
                      </Typography>
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                        Luxury
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
                    Key Features:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {seatClass.features.slice(0, showDetails ? seatClass.features.length : 5).map((feature, idx) => (
                      <FeatureChip 
                        key={idx} 
                        label={feature}
                        icon={getFeatureIcon(feature)}
                        size="small"
                      />
                    ))}
                    
                    {!showDetails && seatClass.features.length > 5 && (
                      <Chip 
                        label={`+${seatClass.features.length - 5} more`}
                        size="small"
                        sx={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
              
              {/* Expandable details section */}
              <Collapse in={expandedId === seatClass.id || showDetails}>
                <Box 
                  sx={{ 
                    p: 3, 
                    pt: 0,
                    borderTop: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                    Complete Feature List:
                  </Typography>
                  
                  <Grid container spacing={1}>
                    {seatClass.features.map((feature, idx) => (
                      <Grid item xs={6} key={idx}>
                        <FeatureItem>
                          <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
                            {getFeatureIcon(feature)}
                          </Box>
                          <Typography variant="body2">
                            {feature}
                          </Typography>
                        </FeatureItem>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Box 
                    sx={{ 
                      mt: 3, 
                      p: 2, 
                      borderRadius: 2,
                      border: '1px solid rgba(140, 158, 255, 0.2)',
                      background: 'rgba(140, 158, 255, 0.05)'
                    }}
                  >
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.9)">
                      <Box component="span" sx={{ fontWeight: 600, color: 'white' }}>Traveler Note:</Box>{' '}
                      {index === 0 ? 
                        'Essential comfort for budget-conscious space travelers. Functional and safe.' : 
                      index === 1 ? 
                        'Enhanced comfort with private space and premium amenities for a quality cosmic journey.' : 
                        'The ultimate space luxury experience with personalized service and exclusive access to all facilities.'}
                    </Typography>
                  </Box>
                </Box>
              </Collapse>
              
              {/* Expand/collapse toggle button */}
              {!showDetails && (
                <Box 
                  sx={{ 
                    p: 1.5, 
                    display: 'flex',
                    justifyContent: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleExpand(seatClass.id);
                    }}
                    endIcon={expandedId === seatClass.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ 
                      color: theme.palette.primary.main,
                      textTransform: 'none'
                    }}
                  >
                    {expandedId === seatClass.id ? 'Show Less' : 'Show More'}
                  </Button>
                </Box>
              )}
            </GlowingCard>
          </Grid>
        ))}
      </Grid>
      
      {/* Context information about seat classes */}
      <Box 
        sx={{ 
          mt: 4,
          p: 3,
          borderRadius: theme.shape.borderRadius * 2,
          background: 'rgba(22, 27, 51, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(140, 158, 255, 0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2
        }}
      >
        <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, mt: 0.5 }} />
        <Box>
          <Typography variant="subtitle2" color="white" gutterBottom>
            About Space Travel Classes
          </Typography>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            Your seat class determines your entire space journey experience, from the comfort of your quarters to the quality of amenities and services available. Higher classes offer enhanced privacy, better views, premium dining options, and exclusive access to recreational activities in space.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SeatClassStep;