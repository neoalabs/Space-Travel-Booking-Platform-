// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  IconButton, useScrollTrigger, Slide
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

// Glowing navigation indicator
const NavIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '3px',
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  bottom: 0,
  borderRadius: '3px 3px 0 0',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: `0 0 8px ${theme.palette.primary.main}`,
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
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Book Now', path: '/booking' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(11, 13, 27, 0.8)', 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: 'white',
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 700,
            }}
          >
            <RocketLaunchIcon 
              sx={{ 
                mr: 1,
                animation: 'pulse 2s infinite alternate',
                '@keyframes pulse': {
                  '0%': { filter: 'drop-shadow(0 0 2px rgba(140, 158, 255, 0.7))' },
                  '100%': { filter: 'drop-shadow(0 0 8px rgba(140, 158, 255, 0.9))' }
                }
              }} 
            />
            Dubai Space Travel
          </Typography>

          {/* Mobile menu button */}
          <IconButton 
            color="inherit" 
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Desktop navigation */}
          <Box 
            ref={setNavRef}
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              position: 'relative',
              height: '100%',
            }}
          >
            {navItems.map((item) => (
              <Button 
                key={item.path}
                component={Link} 
                to={item.path}
                color="inherit"
                sx={{ 
                  mx: 1, 
                  py: 2,
                  opacity: activeTab === item.path ? 1 : 0.7,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
            <NavIndicator style={indicatorStyle} />
          </Box>
          
          <Button 
            component={Link} 
            to="/login"
            variant="outlined"
            color="secondary"
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              borderRadius: 28,
              px: 3,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                background: 'rgba(255, 158, 128, 0.1)',
              }
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;