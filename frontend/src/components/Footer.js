// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Link, Grid, 
  TextField, Button, IconButton, Divider, InputAdornment
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SendIcon from '@mui/icons-material/Send';
import GavelIcon from '@mui/icons-material/Gavel';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(0deg, rgba(11, 13, 27, 0.95) 0%, rgba(22, 27, 51, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(140, 158, 255, 0.15)',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 0.5) 50%, rgba(140, 158, 255, 0) 100%)',
    opacity: 0.7,
    zIndex: 2
  }
}));

const GradientHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  display: 'inline-block',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#8C9EFF',
    transform: 'translateX(3px)'
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  backgroundColor: 'rgba(140, 158, 255, 0.1)',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(140, 158, 255, 0.3)',
    transform: 'translateY(-3px)',
    boxShadow: '0 5px 15px rgba(140, 158, 255, 0.3)'
  }
}));

const NewsletterInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 28,
    color: 'white',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover, &.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 0 15px rgba(140, 158, 255, 0.2)'
    },
    '&::before, &::after': {
      display: 'none',
    }
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
  },
  '& .MuiInputAdornment-root': {
    marginRight: 0,
  }
}));

const SendButton = styled(Button)(({ theme }) => ({
  minWidth: 50,
  height: '100%',
  borderRadius: '0 28px 28px 0',
  padding: theme.spacing(0, 2),
  background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(90deg, #6979F8 0%, #5566F6 100%)',
  }
}));

const Footer = () => {
  const [stars, setStars] = useState([]);
  const [email, setEmail] = useState('');
  
  // Generate stars for footer background
  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, []);
  
  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Implementation would go here
    setEmail('');
    // Show success message or snackbar
  };
  
  return (
    <FooterContainer>
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
      
      {/* Decorative planet */}
      <Box 
        component={motion.div}
        animate={{ 
          y: [0, -10, 0],
          rotate: 360,
        }}
        transition={{
          y: { 
            duration: 8, 
            repeat: Infinity,
            repeatType: 'loop'
          },
          rotate: {
            duration: 120,
            repeat: Infinity,
            ease: 'linear'
          }
        }}
        sx={{
          position: 'absolute',
          right: { xs: -50, md: 100 },
          top: { xs: -20, md: -50 },
          width: { xs: 100, md: 150 },
          height: { xs: 100, md: 150 },
          borderRadius: '50%',
          background: 'radial-gradient(circle at 70% 30%, #1A237E 0%, #0D1B63 60%, #050A30 100%)',
          filter: 'blur(1px)',
          opacity: 0.4,
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)',
          }
        }}
      />
      
      {/* Shooting star animation */}
      <Box 
        component={motion.div}
        animate={{
          left: ['-5%', '110%'],
          top: ['10%', '50%'],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 6,
          times: [0, 0.1, 0.9, 1],
          repeat: Infinity,
          repeatDelay: 15
        }}
        sx={{
          position: 'absolute',
          width: 100,
          height: 1,
          background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 100%)',
          boxShadow: '0 0 10px rgba(140, 158, 255, 0.8), 0 0 20px rgba(140, 158, 255, 0.5)',
          borderRadius: 4,
          zIndex: 0,
          transform: 'rotate(-30deg)'
        }}
      />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: 10, 
          pb: 6, 
          position: 'relative',
          zIndex: 1 
        }}
      >
        <Grid container spacing={6} justifyContent="space-between">
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', mb: 3 }}>
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <RocketLaunchIcon 
                  sx={{ 
                    mr: 1.5,
                    fontSize: 35,
                    color: '#8C9EFF',
                    filter: 'drop-shadow(0 0 8px rgba(140, 158, 255, 0.8))'
                  }} 
                />
              </motion.div>
              
              <Typography 
                variant="h5"
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                Dubai Space Travel
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              color="rgba(255, 255, 255, 0.7)" 
              paragraph
              sx={{ 
                mb: 3,
                maxWidth: 380,
                lineHeight: 1.7
              }}
            >
              Experience the ultimate space travel adventure with Dubai's first commercial space travel service.
              Journey to orbital stations, lunar bases, and beyond into the cosmos!
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <FooterLink href="#" underline="none">
                <LocationOnIcon fontSize="small" />
                Dubai Spaceport, UAE
              </FooterLink>
              
              <FooterLink href="mailto:info@dubaispacetravel.com" underline="none">
                <EmailIcon fontSize="small" />
                info@dubaispacetravel.com
              </FooterLink>
              
              <FooterLink href="tel:+97141234567" underline="none">
                <PhoneIcon fontSize="small" />
                +971 4 123 4567
              </FooterLink>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.9)" sx={{ mb: 1.5 }}>
                Follow Our Cosmic Journey
              </Typography>
              
              <Box sx={{ display: 'flex' }}>
                <SocialButton size="small" component="a" href="#" aria-label="Facebook">
                  <FacebookIcon fontSize="small" />
                </SocialButton>
                
                <SocialButton size="small" component="a" href="#" aria-label="Twitter">
                  <TwitterIcon fontSize="small" />
                </SocialButton>
                
                <SocialButton size="small" component="a" href="#" aria-label="Instagram">
                  <InstagramIcon fontSize="small" />
                </SocialButton>
                
                <SocialButton size="small" component="a" href="#" aria-label="LinkedIn">
                  <LinkedInIcon fontSize="small" />
                </SocialButton>
              </Box>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <GradientHeading variant="h6">
              Explore
            </GradientHeading>
            
            <Box 
              component={motion.div}
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 1, delay: 0.3 }}
              sx={{
                height: 2,
                background: 'linear-gradient(90deg, #8C9EFF 0%, rgba(140, 158, 255, 0) 100%)',
                mb: 3,
                borderRadius: 1,
                boxShadow: '0 0 5px rgba(140, 158, 255, 0.5)',
              }}
            />
            
            <FooterLink component={RouterLink} to="/" underline="none">
              Home
            </FooterLink>
            
            <FooterLink component={RouterLink} to="/destinations" underline="none">
              Destinations
            </FooterLink>
            
            <FooterLink component={RouterLink} to="/booking" underline="none">
              Book a Journey
            </FooterLink>
            
            <FooterLink component={RouterLink} to="/accommodations" underline="none">
              Space Accommodations
            </FooterLink>
            
            <FooterLink href="#" underline="none">
              About Us
            </FooterLink>
            
            <FooterLink href="#" underline="none">
              Contact
            </FooterLink>
          </Grid>
          
          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <GradientHeading variant="h6">
              Legal
            </GradientHeading>
            
            <Box 
              component={motion.div}
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 1, delay: 0.3 }}
              sx={{
                height: 2,
                background: 'linear-gradient(90deg, #8C9EFF 0%, rgba(140, 158, 255, 0) 100%)',
                mb: 3,
                borderRadius: 1,
                boxShadow: '0 0 5px rgba(140, 158, 255, 0.5)',
              }}
            />
            
            <FooterLink href="#" underline="none">
              <GavelIcon fontSize="small" />
              Terms of Service
            </FooterLink>
            
            <FooterLink href="#" underline="none">
              <PrivacyTipIcon fontSize="small" />
              Privacy Policy
            </FooterLink>
            
            <FooterLink href="#" underline="none">
              <HealthAndSafetyIcon fontSize="small" />
              Safety Protocols
            </FooterLink>
          </Grid>
          
          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Box 
              sx={{ 
                background: 'rgba(11, 13, 27, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: 3,
                border: '1px solid rgba(140, 158, 255, 0.2)',
                p: 3,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: 'radial-gradient(circle at top right, rgba(140, 158, 255, 0.2) 0%, rgba(140, 158, 255, 0) 70%)',
                  filter: 'blur(20px)',
                  zIndex: 0
                }}
              />
              
              <GradientHeading variant="h6">
                Mission Updates
              </GradientHeading>
              
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" paragraph>
                Subscribe to our newsletter for the latest space travel news and exclusive offers.
              </Typography>
              
              <Box component="form" onSubmit={handleSubscribe} sx={{ mt: 3 }}>
                <NewsletterInput
                  fullWidth
                  variant="filled"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SendButton type="submit">
                          <SendIcon />
                        </SendButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider 
          sx={{ 
            my: 5, 
            borderColor: 'rgba(140, 158, 255, 0.2)',
            opacity: 0.5
          }} 
        />
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 0 }
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" align="center">
            © {new Date().getFullYear()} Dubai Space Travel. All rights reserved.
          </Typography>
          
          <Box
            component={motion.div}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 100, opacity: 1 }}
            transition={{ duration: 1 }}
            sx={{
              display: { xs: 'none', md: 'block' },
              height: 2,
              background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 0.3) 50%, rgba(140, 158, 255, 0) 100%)',
              borderRadius: 1,
              mx: 4
            }}
          />
          
          <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" align="center">
            Launching dreams beyond Earth's boundaries
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;