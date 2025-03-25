// src/components/booking/CheckoutStep.js
import React, { useState } from 'react';
import { 
  Grid, Typography, Box, Divider, Paper, 
  List, ListItem, ListItemText, Stepper, Step, StepLabel,
  IconButton, Tooltip, Button, Collapse, Chip, Fade, useTheme, alpha,
  TextField, InputAdornment, Alert, Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as MuiLink } from '@mui/material';


// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PublicIcon from '@mui/icons-material/Public';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HotelIcon from '@mui/icons-material/Hotel';
import VerifiedIcon from '@mui/icons-material/Verified';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// Styled components
const GlowingSection = styled(Paper)(({ theme }) => ({
  background: 'rgba(22, 27, 51, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(140, 158, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(140, 158, 255, 0.1)',
    borderColor: 'rgba(140, 158, 255, 0.3)',
  }
}));

const HighlightedBox = styled(Box)(({ theme }) => ({
  background: 'rgba(140, 158, 255, 0.1)',
  border: '1px solid rgba(140, 158, 255, 0.3)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  position: 'relative',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  fontWeight: 700,
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

const StyledTextField = styled(TextField)(({ theme }) => ({
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
    padding: theme.spacing(1.5, 2),
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

const CheckoutStep = ({ bookingData }) => {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  
  // Calculate stay duration
  const calculateDuration = () => {
    if (!bookingData.departureDate || !bookingData.returnDate) return 0;
    return Math.ceil((bookingData.returnDate - bookingData.departureDate) / (1000 * 60 * 60 * 24));
  };
  
  const duration = calculateDuration();
  
  const toggleExpand = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'space10') {
      setPromoApplied(true);
    }
  };

  // Journey timeline steps
  const journeySteps = [
    { 
      label: 'Pre-flight Training', 
      date: format(addDays(bookingData.departureDate, -10), 'MMM dd, yyyy'),
      description: 'Prepare for your journey with essential training'
    },
    { 
      label: 'Launch Day', 
      date: format(bookingData.departureDate, 'MMM dd, yyyy'),
      description: 'Begin your cosmic adventure into space'
    },
    { 
      label: 'Space Experience', 
      date: '→',
      description: `Experience ${duration - 2} days in ${bookingData.destination?.name}`
    },
    { 
      label: 'Return to Earth', 
      date: format(bookingData.returnDate, 'MMM dd, yyyy'),
      description: 'Safely return with incredible memories'
    },
  ];

  // Calculate prices
  const accommodationTotal = bookingData.accommodation?.pricePerNight * duration;
  const seatClassTotal = bookingData.seatClass?.price * bookingData.passengers;
  const subtotal = accommodationTotal + seatClassTotal;
  const serviceFee = Math.round(subtotal * 0.05);
  const spaceInsurance = Math.round(subtotal * 0.03);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + serviceFee + spaceInsurance - discount;
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop'
      }
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box 
        component={motion.div}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        sx={{ mb: 4 }}
      >
        <GradientText variant="h4" component="h2" gutterBottom>
          Review & Confirm Your Journey
        </GradientText>
        
        <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 3, maxWidth: 800 }}>
          You're about to embark on an incredible space adventure! Please review your journey details and complete your booking.
        </Typography>
        
        <Box 
          sx={{ 
            p: 2, 
            mb: 5, 
            background: 'rgba(255, 158, 128, 0.1)',
            border: '1px solid rgba(255, 158, 128, 0.3)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <InfoOutlinedIcon sx={{ color: '#FF9E80' }} />
          <Typography variant="body2" color="rgba(255, 255, 255, 0.9)">
            Once confirmed, your space journey will be secured. Our team will contact you shortly with pre-flight training details.
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={4}>
        {/* Left column - Journey Details */}
        <Grid item xs={12} md={7}>
          {/* Destination Information Section */}
          <GlowingSection 
            component={motion.div}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            sx={{ 
              position: 'relative',
              overflow: 'visible' 
            }}
          >
            {/* Decorative elements */}
            <Box 
              component={motion.div}
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              sx={{
                position: 'absolute',
                top: -15,
                right: 20,
                zIndex: 2
              }}
            >
              <RocketLaunchIcon 
                sx={{ 
                  fontSize: 30, 
                  color: '#FF9E80',
                  filter: 'drop-shadow(0 0 5px rgba(255, 158, 128, 0.7))'
                }}
              />
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon sx={{ color: theme.palette.primary.main }} />
              Destination Details
            </Typography>
            
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Destination
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {bookingData.destination?.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 0.5 }}>
                    {bookingData.destination?.type} • {bookingData.destination?.travelTime} journey
                  </Typography>
                </Box>
              
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Journey Duration
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {duration} days
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 0.5 }}>
                    Including travel time and stay
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Departure Date
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {format(bookingData.departureDate, 'MMMM dd, yyyy')}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.6)" gutterBottom>
                    Return Date
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {format(bookingData.returnDate, 'MMMM dd, yyyy')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Box 
              sx={{ 
                mt: 3, 
                p: 2, 
                background: 'rgba(140, 158, 255, 0.1)',
                borderRadius: 2,
                borderLeft: `4px solid ${theme.palette.primary.main}`
              }}
            >
              <Typography variant="body2" color="rgba(255, 255, 255, 0.9)">
                {bookingData.destination?.description}
              </Typography>
            </Box>
          </GlowingSection>
          
          {/* Journey Timeline Section */}
          <GlowingSection 
            component={motion.div}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlightTakeoffIcon sx={{ color: theme.palette.primary.main }} />
              Journey Timeline
            </Typography>
            
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Stepper 
              orientation="vertical" 
              sx={{ 
                '.MuiStepConnector-line': { 
                  minHeight: 40,
                  borderLeftWidth: 2,
                  borderColor: 'rgba(140, 158, 255, 0.3)'
                },
                mb: 2
              }}
            >
              {journeySteps.map((step, index) => (
                <Step key={index} active={true}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        color: theme.palette.primary.main,
                      }
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        {step.label}
                      </Typography>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                        {step.date}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </GlowingSection>
          
          {/* Seat Class Section */}
          <GlowingSection 
            component={motion.div}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FlightTakeoffIcon sx={{ color: theme.palette.primary.main }} />
                Seat Class & Passengers
              </Typography>
              
              <IconButton 
                onClick={() => toggleExpand('seatClass')}
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {expandedSection === 'seatClass' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box 
                sx={{ 
                  p: 1.5, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255, 158, 128, 0.2)'
                }}
              >
                <EmojiPeopleIcon sx={{ color: '#FF9E80' }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {bookingData.seatClass?.name}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  {bookingData.passengers} {bookingData.passengers > 1 ? 'Passengers' : 'Passenger'}
                </Typography>
              </Box>
              <Typography variant="h6" color={theme.palette.primary.main} sx={{ fontWeight: 600 }}>
                ${(bookingData.seatClass?.price).toLocaleString()} <Typography component="span" variant="body2" color="rgba(255, 255, 255, 0.6)">/ person</Typography>
              </Typography>
            </Box>
            
            <Collapse in={expandedSection === 'seatClass'}>
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" paragraph>
                  {bookingData.seatClass?.description}
                </Typography>
                
                <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.8)" gutterBottom sx={{ mt: 2 }}>
                  Included Features:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {bookingData.seatClass?.features.map((feature, index) => (
                    <FeatureChip 
                      key={index} 
                      label={feature} 
                      icon={<VerifiedIcon />} 
                      size="small" 
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </GlowingSection>
          
          {/* Accommodation Section */}
          <GlowingSection 
            component={motion.div}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HotelIcon sx={{ color: theme.palette.primary.main }} />
                Accommodation
              </Typography>
              
              <IconButton 
                onClick={() => toggleExpand('accommodation')}
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {expandedSection === 'accommodation' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box 
                sx={{ 
                  p: 1.5, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(140, 158, 255, 0.2)'
                }}
              >
                <HotelIcon sx={{ color: theme.palette.primary.main }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {bookingData.accommodation?.name}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  {duration} nights stay
                </Typography>
              </Box>
              <Typography variant="h6" color={theme.palette.primary.main} sx={{ fontWeight: 600 }}>
                ${(bookingData.accommodation?.pricePerNight).toLocaleString()} <Typography component="span" variant="body2" color="rgba(255, 255, 255, 0.6)">/ night</Typography>
              </Typography>
            </Box>
            
            <Collapse in={expandedSection === 'accommodation'}>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" paragraph>
                  {bookingData.accommodation?.description}
                </Typography>
                
                <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.8)" gutterBottom sx={{ mt: 2 }}>
                  Amenities:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {bookingData.accommodation?.features.map((feature, index) => (
                    <FeatureChip 
                      key={index} 
                      label={feature} 
                      icon={<VerifiedIcon />} 
                      size="small" 
                    />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </GlowingSection>
        </Grid>
        
        {/* Right column - Order Summary and Payment */}
        <Grid item xs={12} md={5}>
          {/* Order Summary Section */}
          <GlowingSection 
            component={motion.div}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            sx={{ 
              mb: 4,
              background: 'rgba(16, 20, 42, 0.7)',
              border: '1px solid rgba(140, 158, 255, 0.3)',
              position: 'sticky',
              top: 90
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AccountBalanceWalletIcon sx={{ color: theme.palette.primary.main }} />
              Order Summary
            </Typography>
            
            <HighlightedBox
              component={motion.div}
              variants={pulseAnimation}
              animate="animate"
              sx={{ mb: 3 }}
            >
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                <strong>Space Journey Ready to Book</strong>
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 1 }}>
                Complete your payment to secure your place in space
              </Typography>
            </HighlightedBox>
            
            <List disablePadding>
              <ListItem sx={{ py: 1.5, px: 0 }}>
                <ListItemText 
                  primary={`${bookingData.seatClass?.name} (${bookingData.passengers} passenger${bookingData.passengers > 1 ? 's' : ''})`} 
                  secondary={`$${bookingData.seatClass?.price.toLocaleString()} per passenger`} 
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Typography variant="body1" color="white">
                  ${seatClassTotal.toLocaleString()}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1.5, px: 0 }}>
                <ListItemText 
                  primary={`${bookingData.accommodation?.name}`} 
                  secondary={`$${bookingData.accommodation?.pricePerNight.toLocaleString()} × ${duration} nights`} 
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Typography variant="body1" color="white">
                  ${accommodationTotal.toLocaleString()}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1.5, px: 0 }}>
                <ListItemText 
                  primary="Service Fee" 
                  secondary="Processing and administration"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Typography variant="body1" color="white">
                  ${serviceFee.toLocaleString()}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1.5, px: 0 }}>
                <ListItemText 
                  primary="Space Travel Insurance" 
                  secondary="Comprehensive coverage"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                />
                <Typography variant="body1" color="white">
                  ${spaceInsurance.toLocaleString()}
                </Typography>
              </ListItem>
              
              {promoApplied && (
                <ListItem sx={{ py: 1.5, px: 0 }}>
                  <ListItemText 
                    primary="Discount (SPACE10)" 
                    secondary="10% promo discount applied"
                    primaryTypographyProps={{ color: '#81c784' }}
                    secondaryTypographyProps={{ color: 'rgba(129, 199, 132, 0.7)' }}
                  />
                  <Typography variant="body1" color="#81c784">
                    -${discount.toLocaleString()}
                  </Typography>
                </ListItem>
              )}
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <ListItem sx={{ py: 2, px: 0 }}>
                <ListItemText 
                  primary="Total" 
                  primaryTypographyProps={{ variant: 'h6', color: 'white', fontWeight: 600 }}
                />
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}>
                  ${total.toLocaleString()}
                </Typography>
              </ListItem>
            </List>
            
            {/* Promo code section */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.8)" gutterBottom>
                Promo Code
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <StyledTextField
                  size="small"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalOfferIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button 
                  variant="contained" 
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                  sx={{
                    bgcolor: promoApplied ? 'success.main' : 'primary.main',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: promoApplied ? 'success.dark' : 'primary.dark',
                    }
                  }}
                >
                  {promoApplied ? <CheckCircleIcon /> : 'Apply'}
                </Button>
              </Box>
              
              {promoApplied && (
                <Typography variant="caption" color="#81c784" sx={{ mt: 1, display: 'block' }}>
                  10% discount applied successfully!
                </Typography>
              )}
            </Box>
            
            {/* Payment section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentIcon sx={{ color: theme.palette.primary.main }} />
                Payment Method
              </Typography>
              
              <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              {showPaymentSuccess ? (
                <Zoom in={showPaymentSuccess}>
                  <Alert 
                    severity="success" 
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(129, 199, 132, 0.2)',
                      color: '#81c784',
                      '& .MuiAlert-icon': {
                        color: '#81c784'
                      }
                    }}
                  >
                    Payment details saved successfully!
                  </Alert>
                </Zoom>
              ) : (
                <Box>
                  <StyledTextField
                    fullWidth
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCardIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <StyledTextField
                    fullWidth
                    label="Cardholder Name"
                    placeholder="John Smith"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <StyledTextField
                        fullWidth
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <StyledTextField
                        fullWidth
                        label="CVV"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      mt: 1, 
                      mb: 2, 
                      py: 1.2,
                      background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                      boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
                      borderRadius: 28,
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
                      }
                    }}
                    onClick={() => setShowPaymentSuccess(true)}
                  >
                    Save Payment Details
                  </Button>
                </Box>
              )}
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(140, 158, 255, 0.1)',
                }}
              >
                <SecurityIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="caption" color="rgba(255, 255, 255, 0.8)">
                  Your payment information is encrypted and securely stored. We use industry-standard security protocols.
                </Typography>
              </Box>
            </Box>
          </GlowingSection>
          
          {/* Support info */}
          <GlowingSection 
            component={motion.div}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SupportAgentIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                  Need Help?
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Our space travel specialists are available 24/7
                </Typography>
                <MuiLink 
                  href="tel:+97141234567" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    display: 'block',
                    mt: 0.5,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  +971 4 123 4567
                </MuiLink>
              </Box>
            </Box>
          </GlowingSection>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutStep;