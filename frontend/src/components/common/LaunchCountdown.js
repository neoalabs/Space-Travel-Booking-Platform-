// src/components/common/LaunchCountdown.js
import React from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const CountdownContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(22, 27, 51, 0.6)',
  backdropFilter: 'blur(10px)',
  borderRadius: 12,
  padding: theme.spacing(2),
  border: `1px solid rgba(140, 158, 255, 0.2)`,
}));

const CountdownUnit = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(0, 1),
}));

const LaunchCountdown = ({ launchDate }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(launchDate) - new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [launchDate]);
  
  return (
    <CountdownContainer>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Launch Countdown
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <CountdownUnit>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={60}
              thickness={4}
              sx={{ color: 'rgba(140, 158, 255, 0.2)' }}
            />
            <CircularProgress
              variant="determinate"
              value={(timeLeft.days / 365) * 100}
              size={60}
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
                position: 'absolute',
                left: 0,
              }}
            />
            <Typography variant="h6" sx={{ position: 'absolute', fontWeight: 700 }}>
              {timeLeft.days}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">Days</Typography>
        </CountdownUnit>
        
        <CountdownUnit>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={60}
              thickness={4}
              sx={{ color: 'rgba(140, 158, 255, 0.2)' }}
            />
            <CircularProgress
              variant="determinate"
              value={(timeLeft.hours / 24) * 100}
              size={60}
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
                position: 'absolute',
                left: 0,
              }}
            />
            <Typography variant="h6" sx={{ position: 'absolute', fontWeight: 700 }}>
              {timeLeft.hours}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">Hours</Typography>
        </CountdownUnit>
        
        <CountdownUnit>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={60}
              thickness={4}
              sx={{ color: 'rgba(140, 158, 255, 0.2)' }}
            />
            <CircularProgress
              variant="determinate"
              value={(timeLeft.minutes / 60) * 100}
              size={60}
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
                position: 'absolute',
                left: 0,
              }}
            />
            <Typography variant="h6" sx={{ position: 'absolute', fontWeight: 700 }}>
              {timeLeft.minutes}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">Mins</Typography>
        </CountdownUnit>
        
        <CountdownUnit>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={60}
              thickness={4}
              sx={{ color: 'rgba(140, 158, 255, 0.2)' }}
            />
            <CircularProgress
              variant="determinate"
              value={(timeLeft.seconds / 60) * 100}
              size={60}
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
                position: 'absolute',
                left: 0,
              }}
            />
            <Typography variant="h6" sx={{ position: 'absolute', fontWeight: 700 }}>
              {timeLeft.seconds}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">Secs</Typography>
        </CountdownUnit>
      </Box>
    </CountdownContainer>
  );
};

export default LaunchCountdown;