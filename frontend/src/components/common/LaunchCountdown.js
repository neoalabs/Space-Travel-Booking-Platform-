// src/components/common/LaunchCountdown.js
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, CircularProgress, useTheme, 
  Tooltip, LinearProgress, Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CountdownContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(22, 27, 51, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: theme.spacing(3),
  border: `1px solid rgba(140, 158, 255, 0.2)`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 15px rgba(140, 158, 255, 0.2)',
    border: '1px solid rgba(140, 158, 255, 0.3)',
  }
}));

const CountdownUnit = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(0, 1.5),
  position: 'relative',
}));

const GlowingCircularProgress = styled(CircularProgress)(({ theme, isActive }) => ({
  color: isActive ? theme.palette.primary.main : 'rgba(140, 158, 255, 0.2)',
  filter: isActive ? 'drop-shadow(0 0 5px rgba(140, 158, 255, 0.7))' : 'none',
  transition: 'all 0.3s ease',
}));

const LaunchStatusChip = styled(Box)(({ theme, status }) => {
  let color = theme.palette.primary.main;
  let bgColor = 'rgba(140, 158, 255, 0.15)';
  let borderColor = 'rgba(140, 158, 255, 0.3)';
  
  if (status === 'imminent') {
    color = theme.palette.warning.main;
    bgColor = 'rgba(255, 152, 0, 0.15)';
    borderColor = 'rgba(255, 152, 0, 0.3)';
  } else if (status === 'launching') {
    color = theme.palette.error.main;
    bgColor = 'rgba(244, 67, 54, 0.15)';
    borderColor = 'rgba(244, 67, 54, 0.3)';
  } else if (status === 'launched') {
    color = theme.palette.success.main;
    bgColor = 'rgba(76, 175, 80, 0.15)';
    borderColor = 'rgba(76, 175, 80, 0.3)';
  }
  
  return {
    background: bgColor,
    color: color,
    border: `1px solid ${borderColor}`,
    borderRadius: 16,
    padding: theme.spacing(0.5, 2),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    gap: 4,
    position: 'absolute',
    top: 12,
    right: 12,
  };
});

const LaunchCountdown = ({ 
  launchDate, 
  title = "Launch Countdown",
  showDate = true,
  variant = "standard", // standard, compact
  onComplete = () => {},
  showProgress = true,
  launchName = ""
}) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  
  const [countdownStatus, setCountdownStatus] = useState('upcoming');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [animateRocket, setAnimateRocket] = useState(false);
  
  // Set initial total seconds (used for progress calculation)
  const [initialTotalSeconds] = React.useState(() => {
    // Calculate for a reasonable timeframe - 60 days
    return 60 * 24 * 60 * 60;
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = new Date(launchDate) - now;
      
      if (difference <= 0) {
        // Launch has happened
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        setCountdownStatus('launched');
        onComplete();
        return;
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const total = Math.floor(difference / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds, total });
      
      // Determine countdown status
      if (days === 0) {
        if (hours < 2) {
          setCountdownStatus('launching');
          // Trigger rocket animation in the last 10 minutes
          if (hours === 0 && minutes < 10) {
            setAnimateRocket(true);
          }
        } else {
          setCountdownStatus('imminent');
        }
      } else {
        setCountdownStatus('upcoming');
      }
      
      // Calculate progress (inverse - starts at 0 and goes to 100)
      const elapsedSeconds = initialTotalSeconds - total;
      const calculatedProgress = Math.min(100, Math.max(0, (elapsedSeconds / initialTotalSeconds) * 100));
      setProgressPercentage(calculatedProgress);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [launchDate, initialTotalSeconds, onComplete]);
  
  // Format the launch date in a readable format
  const formattedLaunchDate = new Date(launchDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedLaunchTime = new Date(launchDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  // Status message based on countdown
  const getStatusMessage = () => {
    if (countdownStatus === 'launched') {
      return "Launch Successful!";
    } else if (countdownStatus === 'launching') {
      return "Launch Imminent!";
    } else if (countdownStatus === 'imminent') {
      return "Preparing for Launch";
    } else {
      return "Countdown Active";
    }
  };
  
  // Rocket animation variants
  const rocketVariants = {
    idle: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        y: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }
      }
    },
    launch: {
      y: [-300],
      transition: {
        duration: 1.5,
        ease: "easeIn"
      }
    }
  };
  
  // Pulsing animation for the container when close to launch
  const containerAnimation = countdownStatus === 'launching' ? {
    boxShadow: [
      '0 8px 32px rgba(0, 0, 0, 0.2)',
      '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 20px rgba(244, 67, 54, 0.4)',
      '0 8px 32px rgba(0, 0, 0, 0.2)'
    ],
    transition: {
      boxShadow: {
        repeat: Infinity,
        duration: 2
      }
    }
  } : {};
  
  // Render compact variant
  if (variant === 'compact') {
    return (
      <CountdownContainer 
        component={motion.div}
        animate={containerAnimation}
        sx={{ 
          p: 2, 
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            variants={rocketVariants}
            initial="idle"
            animate={animateRocket ? "animate" : "idle"}
          >
            <RocketLaunchIcon 
              sx={{ 
                mr: 1.5, 
                color: countdownStatus === 'launching' ? theme.palette.error.main : theme.palette.primary.main,
                fontSize: 28
              }} 
            />
          </motion.div>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedLaunchDate}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {timeLeft.days}
            </Typography>
            <Typography variant="caption" color="text.secondary">Days</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">:</Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {timeLeft.hours.toString().padStart(2, '0')}
            </Typography>
            <Typography variant="caption" color="text.secondary">Hrs</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">:</Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {timeLeft.minutes.toString().padStart(2, '0')}
            </Typography>
            <Typography variant="caption" color="text.secondary">Min</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">:</Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {timeLeft.seconds.toString().padStart(2, '0')}
            </Typography>
            <Typography variant="caption" color="text.secondary">Sec</Typography>
          </Box>
        </Box>
      </CountdownContainer>
    );
  }
  
  // Render standard variant
  return (
    <CountdownContainer 
      component={motion.div}
      animate={containerAnimation}
    >
      {/* Status chip */}
      <LaunchStatusChip status={countdownStatus}>
        <Box 
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: countdownStatus === 'launching' ? 0.8 : 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            background: countdownStatus === 'launching' 
              ? theme.palette.error.main 
              : countdownStatus === 'imminent'
                ? theme.palette.warning.main
                : countdownStatus === 'launched'
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
            mr: 0.5
          }}
        />
        {getStatusMessage()}
      </LaunchStatusChip>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <motion.div
          variants={rocketVariants}
          initial="idle"
          animate={animateRocket ? (countdownStatus === 'launched' ? "launch" : "animate") : "idle"}
        >
          <RocketLaunchIcon 
            sx={{ 
              mr: 1.5, 
              color: countdownStatus === 'launching' ? theme.palette.error.main : theme.palette.primary.main
            }} 
          />
        </motion.div>
        <Typography variant="h6" fontWeight={600} color="white">
          {title}
          {launchName && `: ${launchName}`}
        </Typography>
      </Box>
      
      {showDate && (
        <Tooltip 
          title={`Launch scheduled for ${formattedLaunchDate} at ${formattedLaunchTime}`}
          placement="top"
          TransitionComponent={Zoom}
          arrow
        >
          <Box 
            component={motion.div}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              p: 0.75,
              px: 1.5,
              backgroundColor: 'rgba(140, 158, 255, 0.1)',
              borderRadius: 10,
              border: '1px solid rgba(140, 158, 255, 0.2)',
              cursor: 'pointer'
            }}
          >
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'rgba(140, 158, 255, 0.7)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {formattedLaunchDate} · {formattedLaunchTime}
            </Typography>
          </Box>
        </Tooltip>
      )}
      
      {showProgress && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Countdown Progress
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
              {Math.round(progressPercentage)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(140, 158, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                borderRadius: 3,
                transition: 'transform 0.5s ease'
              }
            }}
          />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <CountdownUnit>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowingCircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={3}
              sx={{ color: 'rgba(140, 158, 255, 0.1)' }}
            />
            <GlowingCircularProgress
              variant="determinate"
              value={Math.min(100, (timeLeft.days / 365) * 100)}
              size={80}
              thickness={5}
              isActive={timeLeft.days > 0}
              sx={{ 
                position: 'absolute',
                left: 0,
              }}
            />
            <Typography 
              variant="h4" 
              component={motion.div}
              key={`days-${timeLeft.days}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ 
                position: 'absolute', 
                fontWeight: 700,
                fontSize: '1.75rem',
                color: timeLeft.days > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)'
              }}
            >
              {timeLeft.days}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.7)"
            sx={{ mt: 1 }}
          >
            Days
          </Typography>
        </CountdownUnit>
        
        <CountdownUnit>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowingCircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={3}
              sx={{ color: 'rgba(140, 158, 255, 0.1)' }}
            />
            <GlowingCircularProgress
              variant="determinate"
              value={(timeLeft.hours / 24) * 100}
              size={80}
              thickness={5}
              isActive={timeLeft.hours > 0}
              sx={{ 
                position: 'absolute',
                left: 0,
              }}
            />
            <Typography 
              variant="h4" 
              component={motion.div}
              key={`hours-${timeLeft.hours}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ 
                position: 'absolute', 
                fontWeight: 700,
                fontSize: '1.75rem',
                color: timeLeft.hours > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)'
              }}
            >
              {timeLeft.hours.toString().padStart(2, '0')}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.7)"
            sx={{ mt: 1 }}
          >
            Hours
          </Typography>
        </CountdownUnit>
        
        <CountdownUnit>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowingCircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={3}
              sx={{ color: 'rgba(140, 158, 255, 0.1)' }}
            />
            <GlowingCircularProgress
              variant="determinate"
              value={(timeLeft.minutes / 60) * 100}
              size={80}
              thickness={5}
              isActive={timeLeft.minutes > 0}
              sx={{ 
                position: 'absolute',
                left: 0,
              }}
            />
            <Typography 
              variant="h4" 
              component={motion.div}
              key={`minutes-${timeLeft.minutes}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ 
                position: 'absolute', 
                fontWeight: 700,
                fontSize: '1.75rem',
                color: timeLeft.minutes > 0 ? 'white' : 'rgba(255, 255, 255, 0.5)'
              }}
            >
              {timeLeft.minutes.toString().padStart(2, '0')}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.7)"
            sx={{ mt: 1 }}
          >
            Minutes
          </Typography>
        </CountdownUnit>
        
        <CountdownUnit>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowingCircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={3}
              sx={{ color: 'rgba(140, 158, 255, 0.1)' }}
            />
            <GlowingCircularProgress
              variant="determinate"
              value={(timeLeft.seconds / 60) * 100}
              size={80}
              thickness={5}
              isActive={true}
              sx={{ 
                position: 'absolute',
                left: 0,
              }}
            />
            <Typography 
              variant="h4" 
              component={motion.div}
              key={`seconds-${timeLeft.seconds}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ 
                position: 'absolute', 
                fontWeight: 700,
                fontSize: '1.75rem',
                color: 'white'
              }}
            >
              {timeLeft.seconds.toString().padStart(2, '0')}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.7)"
            sx={{ mt: 1 }}
          >
            Seconds
          </Typography>
        </CountdownUnit>
      </Box>
      
      {/* Launch status message - changes based on countdown state */}
      <AnimatePresence mode="wait">
        <motion.div
          key={countdownStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Box 
            sx={{ 
              mt: 2,
              p: 1,
              px: 3,
              borderRadius: 2,
              backgroundColor: countdownStatus === 'launching' 
                ? 'rgba(244, 67, 54, 0.1)'
                : countdownStatus === 'launched'
                  ? 'rgba(76, 175, 80, 0.1)'
                  : 'rgba(140, 158, 255, 0.1)',
              border: `1px solid ${
                countdownStatus === 'launching' 
                  ? 'rgba(244, 67, 54, 0.3)'
                  : countdownStatus === 'launched'
                    ? 'rgba(76, 175, 80, 0.3)'
                    : 'rgba(140, 158, 255, 0.3)'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <AccessTimeIcon 
              fontSize="small" 
              sx={{ 
                color: countdownStatus === 'launching' 
                  ? theme.palette.error.main
                  : countdownStatus === 'launched'
                    ? theme.palette.success.main
                    : theme.palette.primary.main
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: countdownStatus === 'launching' 
                  ? theme.palette.error.main
                  : countdownStatus === 'launched'
                    ? theme.palette.success.main
                    : theme.palette.primary.main,
                fontWeight: 500
              }}
            >
              {countdownStatus === 'launched' ? 'Launch Successful!' : 
                countdownStatus === 'launching' ? 'Launch Sequence Initiated' :
                countdownStatus === 'imminent' ? 'Final Preparations Underway' :
                'Countdown In Progress'}
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>
      
      {/* Launched animation */}
      {countdownStatus === 'launched' && (
        <Box 
          component={motion.div}
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: [0, 1, 0.8, 1],
            transition: { 
              y: { duration: 0.5 },
              opacity: { duration: 1.5, repeat: Infinity, repeatType: 'loop' }
            }
          }}
          sx={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center bottom, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0) 70%)',
            zIndex: -1
          }}
        />
      )}
    </CountdownContainer>
  );
};

export default LaunchCountdown;