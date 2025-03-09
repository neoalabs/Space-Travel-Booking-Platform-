// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <RocketLaunchIcon sx={{ mr: 1 }} />
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Dubai Space Travel
          </Link>
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/destinations">Destinations</Button>
          <Button color="inherit" component={Link} to="/booking">Book Now</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;