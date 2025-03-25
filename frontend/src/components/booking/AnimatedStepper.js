// src/components/booking/AnimatedStepper.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  StepConnector, 
  stepConnectorClasses,
  Typography,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Custom step connector with glow and animation effects
const GlowingStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
      boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.7)}`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
      boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    backgroundColor: 'rgba(140, 158, 255, 0.1)',
    borderRadius: 2,
    transition: 'all 0.5s ease',
  },
}));

// Styled step icon container
const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  '& .StepIcon-completedIcon': {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 18,
  },
  '& .StepIcon-circle': {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: ownerState.active ? 'rgba(140, 158, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
    border: ownerState.active 
      ? `2px solid ${theme.palette.primary.main}` 
      : ownerState.completed 
        ? `2px solid ${theme.palette.primary.main}` 
        : '2px solid rgba(140, 158, 255, 0.2)',
    boxShadow: ownerState.active 
      ? `0 0 15px ${alpha(theme.palette.primary.main, 0.6)}` 
      : ownerState.completed 
        ? `0 0 10px ${alpha(theme.palette.primary.main, 0.4)}` 
        : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: 5,
    position: 'relative',
  },
  '& .StepIcon-icon': {
    color: ownerState.active ? 'white' : 'rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
    fontSize: 22,
  },
  '& .StepIcon-asteroidOrbit': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 70,
    height: 70,
    borderRadius: '50%',
    border: '1px dashed rgba(140, 158, 255, 0.2)',
    opacity: ownerState.active ? 1 : 0.5,
    animation: ownerState.active ? 'rotate 12s linear infinite' : 'none',
    '@keyframes rotate': {
      '0%': {
        transform: 'translate(-50%, -50%) rotate(0deg)',
      },
      '100%': {
        transform: 'translate(-50%, -50%) rotate(360deg)',
      },
    },
  },
  '& .StepIcon-asteroid': {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: ownerState.active ? theme.palette.primary.main : 'rgba(140, 158, 255, 0.3)',
    boxShadow: ownerState.active ? `0 0 10px ${theme.palette.primary.main}` : 'none',
    top: '50%',
    left: '0%',
    marginTop: -4,
    marginLeft: -4,
  },
}));

const StepIconContent = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
}));

// Custom animated step icon component
const AnimatedStepIcon = (props) => {
  const { active, completed, className, icon } = props;
  const theme = useTheme();

  // Pulse animation for the active step
  const [isPulsing, setIsPulsing] = useState(active);
  
  useEffect(() => {
    setIsPulsing(active);
  }, [active]);

  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      <Box
        component={motion.div}
        animate={isPulsing ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            `0 0 10px ${alpha(theme.palette.primary.main, 0.4)}`,
            `0 0 20px ${alpha(theme.palette.primary.main, 0.6)}`,
            `0 0 10px ${alpha(theme.palette.primary.main, 0.4)}`
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop'
        }}
        className="StepIcon-circle"
      >
        <StepIconContent>
          {completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Checkmark icon for completed steps */}
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #8C9EFF 0%, #6979F8 100%)',
                  boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                ✓
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={active ? { scale: 0.8 } : { scale: 1 }}
              animate={active ? { scale: 1 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="StepIcon-icon"
            >
              {/* Number icon for not-yet-completed steps */}
              {icon}
            </motion.div>
          )}
        </StepIconContent>
      </Box>
      
      {/* Decorative asteroid orbit */}
      <Box className="StepIcon-asteroidOrbit">
        <Box 
          component={motion.div}
          animate={active ? {
            rotate: 360
          } : {}}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
          className="StepIcon-asteroid"
        />
      </Box>
    </StepIconRoot>
  );
};

// Enhanced animated step label
const AnimatedStepLabel = styled(StepLabel)(({ theme, active, completed }) => ({
  '& .MuiStepLabel-label': {
    marginTop: 8,
    fontSize: '0.95rem',
    color: active 
      ? 'white' 
      : completed 
        ? theme.palette.primary.main 
        : 'rgba(255, 255, 255, 0.6)',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.3s ease',
  },
}));

// Main AnimatedStepper component
const AnimatedStepper = ({ steps, activeStep, orientation = 'horizontal' }) => {
  const theme = useTheme();
  
  // Generate small stars for background decoration
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const generatedStars = Array.from({ length: 20 }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }));
    setStars(generatedStars);
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      mb: 6, 
      mt: 2,
      position: 'relative',
      overflow: 'hidden',
      p: 2,
      borderRadius: 4,
      background: 'rgba(16, 20, 42, 0.4)',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(140, 158, 255, 0.15)',
    }}>
      {/* Decorative stars in the background */}
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
            animation: `twinkle ${star.animationDuration} infinite alternate ${star.animationDelay}`,
            '@keyframes twinkle': {
              '0%': { opacity: star.opacity, boxShadow: '0 0 0 rgba(255, 255, 255, 0)' },
              '100%': { opacity: star.opacity * 0.3, boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)' }
            },
            zIndex: 0
          }}
        />
      ))}
      
      {/* Background glow effects */}
      <Box
        component={motion.div}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'loop',
        }}
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle at center, rgba(140, 158, 255, 0.15) 0%, rgba(140, 158, 255, 0) 70%)',
          filter: 'blur(20px)',
          zIndex: 0
        }}
      />
      
      <Box
        component={motion.div}
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'loop',
          delay: 2
        }}
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 250,
          height: 250,
          background: 'radial-gradient(circle at center, rgba(255, 158, 128, 0.1) 0%, rgba(255, 158, 128, 0) 70%)',
          filter: 'blur(30px)',
          zIndex: 0
        }}
      />
      
      {/* Enhanced Stepper component */}
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        orientation={orientation}
        connector={<GlowingStepConnector />}
        sx={{ 
          position: 'relative',
          zIndex: 2,
          mb: 4,
          pt: 2
        }}
      >
        {steps.map((label, index) => {
          const isActive = activeStep === index;
          const isCompleted = activeStep > index;
          
          return (
            <Step key={label}>
              <AnimatedStepLabel 
                StepIconComponent={AnimatedStepIcon}
                active={isActive}
                completed={isCompleted}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${label}-${isActive}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {label}
                  </motion.div>
                </AnimatePresence>
              </AnimatedStepLabel>
            </Step>
          );
        })}
      </Stepper>
      
      {/* Enhanced progress indicator */}
      <Box sx={{ position: 'relative', mx: 'auto', width: '85%', zIndex: 1 }}>
        {/* Base track */}
        <Box sx={{ 
          height: 6, 
          bgcolor: 'rgba(140, 158, 255, 0.1)', 
          borderRadius: 3,
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Progress indicator */}
          <Box
            component={motion.div}
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
              borderRadius: 3,
              boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.7)}`,
            }}
          >
            {/* Shimmer effect */}
            <Box
              component={motion.div}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
                ease: "easeInOut",
                repeatDelay: 1
              }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
              }}
            />
          </Box>
        </Box>
        
        {/* Step markers */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          pointerEvents: 'none'
        }}>
          {steps.map((_, index) => {
            const isActive = activeStep >= index;
            return (
              <Box 
                key={index}
                component={motion.div}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.3 }}
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: isActive ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid',
                  borderColor: isActive ? theme.palette.primary.light : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive ? `0 0 10px ${theme.palette.primary.main}` : 'none',
                  transform: 'translateY(-3px)',
                  zIndex: 2
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AnimatedStepper;