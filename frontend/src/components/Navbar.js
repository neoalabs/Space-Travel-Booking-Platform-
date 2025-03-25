// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  IconButton, useScrollTrigger, Slide, Drawer,
  List, ListItem, ListItemText, ListItemIcon, Divider,
  Menu, MenuItem, Avatar, Badge
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExploreIcon from '@mui/icons-material/Explore';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Glowing navigation indicator
const NavIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '3px',
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  bottom: 0,
  borderRadius: '3px 3px 0 0',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: `0 0 10px ${theme.palette.primary.main}`,
}));

// Glowing AppBar with enhanced styling
const GlowingAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(11, 13, 27, 0.75)', 
  backdropFilter: 'blur(12px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(140, 158, 255, 0.15)',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 0.5) 50%, rgba(140, 158, 255, 0) 100%)',
    opacity: 0.7,
  }
}));

// Styled navigation button
const NavButton = styled(Button)(({ theme, active }) => ({
  borderRadius: 0,
  transition: 'all 0.3s ease',
  padding: theme.spacing(2, 1.5),
  color: 'white',
  opacity: active ? 1 : 0.7,
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    opacity: 1,
    background: 'rgba(255, 255, 255, 0.05)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: active ? '100%' : '0%',
    height: '3px',
    background: 'transparent',
    transition: 'all 0.3s ease',
  },
  '&:hover::after': {
    width: '50%',
    background: 'rgba(140, 158, 255, 0.5)',
  }
}));

// Animated Login Button
const AnimatedLoginButton = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 28,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    transition: 'all 0.6s ease',
    zIndex: 1,
  },
  '&:hover::before': {
    left: '100%',
  }
}));

const HideOnScroll = (props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('/');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [navRef, setNavRef] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [stars, setStars] = useState([]);
  
  // Generate stars for navbar background
  useEffect(() => {
    const generatedStars = Array.from({ length: 20 }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, []);
  
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  
  useEffect(() => {
    if (navRef) {
      const activeButton = navRef.querySelector(`a[href="${activeTab}"]`);
      if (activeButton) {
        const { left, width } = activeButton.getBoundingClientRect();
        const navLeft = navRef.getBoundingClientRect().left;
        
        setIndicatorStyle({
          left: `${left - navLeft}px`,
          width: `${width}px`,
        });
      }
    }
  }, [activeTab, navRef]);

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Destinations', path: '/destinations', icon: <PublicIcon /> },
    { label: 'Book Now', path: '/booking', icon: <FlightTakeoffIcon /> },
    { label: 'Dashboard', path: '/dashboard', icon: <PersonIcon /> },
  ];

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <HideOnScroll>
      <GlowingAppBar position="fixed">
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
        
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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
                  fontSize: 30,
                  color: '#8C9EFF',
                  filter: 'drop-shadow(0 0 8px rgba(140, 158, 255, 0.8))'
                }} 
              />
            </motion.div>
            
            <Typography 
              variant="h6"
              sx={{ 
                textDecoration: 'none', 
                color: 'white',
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

          {/* Mobile menu button */}
          <IconButton 
            color="inherit" 
            onClick={toggleMobileMenu}
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              background: mobileMenuOpen ? 'rgba(140, 158, 255, 0.1)' : 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(140, 158, 255, 0.2)',
              }
            }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          
          {/* Desktop navigation */}
          <Box 
            ref={setNavRef}
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              position: 'relative',
              height: '100%',
              ml: 4
            }}
          >
            {navItems.map((item) => (
              <NavButton 
                key={item.path}
                component={Link} 
                to={item.path}
                active={activeTab === item.path ? 1 : 0}
                sx={{ mx: 0.5 }}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                  {item.label}
                </motion.div>
              </NavButton>
            ))}
            <NavIndicator style={indicatorStyle} />
          </Box>
          
          {/* Desktop right side menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <IconButton 
              color="inherit"
              sx={{ 
                mr: 2, 
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  padding: 1.5,
                  background: 'rgba(140, 158, 255, 0.1)',
                  opacity: 0,
                  transform: 'scale(0)',
                  transition: 'all 0.3s ease'
                },
                '&:hover::after': {
                  opacity: 1,
                  transform: 'scale(1)'
                }
              }}
            >
              <Badge 
                badgeContent={notificationsCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <AnimatedLoginButton
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3 } 
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                component={Link} 
                to="/login"
                variant="outlined"
                color="secondary"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleUserMenuOpen}
                sx={{ 
                  borderRadius: 28,
                  px: 3,
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                    background: 'rgba(255, 158, 128, 0.1)',
                  }
                }}
              >
                Account
              </Button>
            </AnimatedLoginButton>
            
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  background: 'rgba(22, 27, 51, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(140, 158, 255, 0.15)',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 10px rgba(140, 158, 255, 0.1)',
                }
              }}
            >
              <MenuItem component={Link} to="/login" onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: '#8C9EFF' }} />
                </ListItemIcon>
                <ListItemText>Login</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/register" onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: '#8C9EFF' }} />
                </ListItemIcon>
                <ListItemText>Register</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
        
        {/* Mobile Menu Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={toggleMobileMenu}
          PaperProps={{
            sx: {
              width: '80%',
              maxWidth: 300,
              background: 'rgba(11, 13, 27, 0.98)', 
              backdropFilter: 'blur(12px)',
              boxShadow: '-5px 0 30px rgba(0, 0, 0, 0.5)',
              borderLeft: '1px solid rgba(140, 158, 255, 0.2)',
              px: 2,
              pt: 5,
            }
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <RocketLaunchIcon 
              sx={{ 
                fontSize: 40,
                color: '#8C9EFF',
                filter: 'drop-shadow(0 0 8px rgba(140, 158, 255, 0.8))',
                animation: 'pulse 2s infinite alternate',
                '@keyframes pulse': {
                  '0%': { filter: 'drop-shadow(0 0 2px rgba(140, 158, 255, 0.7))' },
                  '100%': { filter: 'drop-shadow(0 0 8px rgba(140, 158, 255, 0.9))' }
                }
              }} 
            />
            <Typography 
              variant="h6"
              sx={{ 
                mt: 1,
                fontWeight: 700,
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
          
          <Divider sx={{ 
            my: 2, 
            borderColor: 'rgba(140, 158, 255, 0.2)',
            '&::before, &::after': {
              borderColor: 'rgba(140, 158, 255, 0.2)',
            }
          }} />
          
          <List>
            {navItems.map((item) => (
              <ListItem 
                key={item.path} 
                component={Link}
                to={item.path}
                onClick={toggleMobileMenu}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  mb: 1, 
                  bgcolor: activeTab === item.path ? 'rgba(140, 158, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(140, 158, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: activeTab === item.path ? '#8C9EFF' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    color: activeTab === item.path ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    fontWeight: activeTab === item.path ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ 
            my: 2, 
            borderColor: 'rgba(140, 158, 255, 0.2)',
            '&::before, &::after': {
              borderColor: 'rgba(140, 158, 255, 0.2)',
            }
          }} />
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button 
              component={Link} 
              to="/login"
              variant="contained"
              startIcon={<PersonIcon />}
              onClick={toggleMobileMenu}
              sx={{ 
                borderRadius: 28,
                px: 3,
                py: 1,
                background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
                boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
                }
              }}
            >
              Login
            </Button>
          </Box>
        </Drawer>
      </GlowingAppBar>
    </HideOnScroll>
  );
};

export default Navbar;