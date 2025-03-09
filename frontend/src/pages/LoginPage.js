// src/pages/LoginPage.js
import React from 'react';
import { 
  Container, Typography, Box, TextField, Button, 
  Paper, Grid, Link as MuiLink 
} from '@mui/material';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign In
        </Typography>
        
        <Typography variant="body2" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Sign in to manage your space journeys
        </Typography>
        
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            component={Link}
            to="/dashboard"
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <MuiLink href="#" variant="body2">
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink component={Link} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;