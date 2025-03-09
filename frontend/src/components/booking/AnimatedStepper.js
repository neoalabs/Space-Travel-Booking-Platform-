// src/components/booking/AnimatedStepper.js
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Stepper, Step, StepLabel, StepConnector, styled } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    height: 3,
    border: 0,
    backgroundColor: 'rgba(140, 158, 255, 0.1)',
    borderRadius: 1,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
  },
}));

const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  height: 40,
  width: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  background: ownerState.active || ownerState.completed 
    ? `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : 'rgba(140, 158, 255, 0.1)',
  zIndex: 1,
  boxShadow: ownerState.active
    ? `0 0 15px ${theme.palette.primary.main}`
    : 'none',
  color: ownerState.active || ownerState.completed ? 'white' : theme.palette.text.secondary,
  transition: 'all 0.3s ease',
}));

const AnimatedStepIcon = (props) => {
  const { active, completed, icon } = props;

  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {active ? (
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
      ) : (
        icon
      )}
    </StepIconRoot>
  );
};

const AnimatedStepper = ({ steps, activeStep }) => {
  // Add this line to get the theme object
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        connector={<AnimatedStepConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={AnimatedStepIcon}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Progress indicator */}
      <Box sx={{ position: 'relative', mt: 4, mx: 'auto', width: '80%' }}>
        <Box sx={{ height: 5, bgcolor: 'rgba(140, 158, 255, 0.1)', borderRadius: 2 }} />
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 5,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            borderRadius: 2,
            boxShadow: `0 0 8px ${theme.palette.primary.main}`,
          }}
        />
      </Box>
    </Box>
  );
};

export default AnimatedStepper;