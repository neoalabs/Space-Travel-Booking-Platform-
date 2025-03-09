// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import DestinationsPage from './pages/DestinationsPage';
import AccommodationsPage from './pages/AccommodationsPage';
import UserDashboard from './pages/UserDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Create a more dynamic theme in App.js
const spaceTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8C9EFF', // Cosmic blue
      light: '#BBDEFB',
      dark: '#3D5AFE',
    },
    secondary: {
      main: '#FF9E80', // Mars orange
      light: '#FFCCBC',
      dark: '#FF6E40',
    },
    accent: {
      main: '#BB86FC', // Nebula purple
      light: '#E1BEE7',
      dark: '#9C27B0',
    },
    background: {
      default: '#0B0D1B', // Deep space
      paper: '#161B33', // Night sky
      subtle: '#1C2046', // Cosmic indigo
    },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={spaceTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/accommodations" element={<AccommodationsPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;