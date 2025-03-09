// src/components/Footer.js
import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Dubai Space Travel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The future of space tourism starts here.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dubai Spaceport, UAE
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@dubaispacetravel.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +971 4 123 4567
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="text.secondary" display="block">Terms of Service</Link>
            <Link href="#" color="text.secondary" display="block">Privacy Policy</Link>
            <Link href="#" color="text.secondary" display="block">Safety Protocols</Link>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
          © {new Date().getFullYear()} Dubai Space Travel. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;