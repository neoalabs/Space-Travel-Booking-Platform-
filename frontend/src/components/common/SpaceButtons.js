// src/components/common/SpaceButtons.js
import React from 'react';
import { Button, styled, CircularProgress, Box, Tooltip } from '@mui/material';
import { keyframes } from '@mui/system';

// Animation keyframes
const shimmerEffect = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const pulseEffect = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(140, 158, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(140, 158, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(140, 158, 255, 0); }
`;

const floatEffect = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const glowEffect = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(140, 158, 255, 0.7)); }
  50% { filter: drop-shadow(0 0 8px rgba(140, 158, 255, 0.9)); }
  100% { filter: drop-shadow(0 0 2px rgba(140, 158, 255, 0.7)); }
`;

// Base Button - Common styles for all space buttons
const BaseSpaceButton = styled(Button)(({ theme, size = 'medium', disabled, fullWidth }) => {
  const sizes = {
    small: {
      fontSize: '0.875rem',
      padding: '6px 16px',
      borderRadius: '20px',
    },
    medium: {
      fontSize: '1rem',
      padding: '10px 24px',
      borderRadius: '28px',
    },
    large: {
      fontSize: '1.125rem',
      padding: '12px 32px',
      borderRadius: '32px',
    },
  };

  return {
    textTransform: 'none',
    fontWeight: 600,
    letterSpacing: '0.02em',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    width: fullWidth ? '100%' : 'auto',
    ...sizes[size],
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  };
});

// Primary Space Button - For primary actions like "Book Now", "Continue", etc.
export const PrimarySpaceButton = styled(BaseSpaceButton)(({ theme, animate, glow }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: 'white',
  boxShadow: `0 4px 14px rgba(61, 90, 254, 0.4)`,
  '&:hover': {
    boxShadow: `0 6px 20px rgba(61, 90, 254, 0.6)`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: `0 2px 10px rgba(61, 90, 254, 0.4)`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    animation: animate ? `${shimmerEffect} 2s infinite` : 'none',
  },
  ...(glow && {
    animation: `${pulseEffect} 2s infinite`,
  }),
}));

// Secondary Space Button - For secondary actions like "Cancel", "Back", etc.
export const SecondarySpaceButton = styled(BaseSpaceButton)(({ theme, variant }) => ({
  background: variant === 'filled' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  backdropFilter: 'blur(10px)',
  border: `2px solid rgba(255, 255, 255, 0.2)`,
  color: 'white',
  '&:hover': {
    background: `rgba(255, 255, 255, 0.15)`,
    border: `2px solid rgba(255, 255, 255, 0.3)`,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    background: `rgba(255, 255, 255, 0.2)`,
    transform: 'translateY(1px)',
  },
}));

// Book Now Button - Highlighted action for booking
export const BookNowButton = styled(BaseSpaceButton)(({ theme, animate }) => ({
  background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: 'white',
  boxShadow: `0 4px 14px rgba(255, 110, 64, 0.4)`,
  '&:hover': {
    boxShadow: `0 6px 20px rgba(255, 110, 64, 0.6)`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: `0 2px 10px rgba(255, 110, 64, 0.4)`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    animation: animate ? `${shimmerEffect} 2s infinite` : 'none',
  },
}));

// Emergency Button - For critical actions
export const EmergencyButton = styled(BaseSpaceButton)(({ theme }) => ({
  background: `linear-gradient(90deg, #f44336 0%, #d32f2f 100%)`,
  color: 'white',
  boxShadow: `0 4px 14px rgba(244, 67, 54, 0.4)`,
  '&:hover': {
    boxShadow: `0 6px 20px rgba(244, 67, 54, 0.6)`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: `0 2px 10px rgba(244, 67, 54, 0.4)`,
  },
  animation: `${pulseEffect} 2s infinite`,
}));

// Success Button - For successful actions
export const SuccessButton = styled(BaseSpaceButton)(({ theme }) => ({
  background: `linear-gradient(90deg, #4caf50 0%, #388e3c 100%)`,
  color: 'white',
  boxShadow: `0 4px 14px rgba(76, 175, 80, 0.4)`,
  '&:hover': {
    boxShadow: `0 6px 20px rgba(76, 175, 80, 0.6)`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: `0 2px 10px rgba(76, 175, 80, 0.4)`,
  },
}));

// Cosmic Button - Special effect button for important features
export const CosmicButton = styled(BaseSpaceButton)(({ theme }) => ({
  background: `linear-gradient(45deg, #673ab7 0%, #9c27b0 50%, #673ab7 100%)`,
  backgroundSize: '200% auto',
  color: 'white',
  boxShadow: `0 4px 14px rgba(156, 39, 176, 0.4)`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundPosition: 'right center',
    boxShadow: `0 6px 20px rgba(156, 39, 176, 0.6)`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: `0 2px 10px rgba(156, 39, 176, 0.4)`,
  },
  animation: `${floatEffect} 4s ease-in-out infinite`,
}));

// Glass Button - Transparent glass effect
export const GlassButton = styled(BaseSpaceButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '30px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 6px 30px rgba(0, 0, 0, 0.3)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
}));

// Orbit Button - Button with orbiting effect
export const OrbitButton = styled(BaseSpaceButton)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: 'white',
  boxShadow: `0 4px 14px rgba(61, 90, 254, 0.4)`,
  '&:hover': {
    boxShadow: `0 6px 20px rgba(61, 90, 254, 0.6)`,
    '&::before': {
      animation: `${shimmerEffect} 1.5s infinite`,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: '34px',
    background: 'linear-gradient(90deg, #8C9EFF, #536DFE, #8C9EFF)',
    backgroundSize: '200% 200%',
    opacity: 0,
    zIndex: -1,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

// Icon-only Button - For compact actions
export const IconSpaceButton = styled(BaseSpaceButton)(({ theme, color = 'primary' }) => {
  const colors = {
    primary: {
      bg: 'rgba(140, 158, 255, 0.1)',
      border: 'rgba(140, 158, 255, 0.3)',
      hover: 'rgba(140, 158, 255, 0.2)',
      color: theme.palette.primary.main,
    },
    secondary: {
      bg: 'rgba(255, 158, 128, 0.1)',
      border: 'rgba(255, 158, 128, 0.3)',
      hover: 'rgba(255, 158, 128, 0.2)',
      color: theme.palette.secondary.main,
    },
    success: {
      bg: 'rgba(76, 175, 80, 0.1)',
      border: 'rgba(76, 175, 80, 0.3)',
      hover: 'rgba(76, 175, 80, 0.2)',
      color: '#4caf50',
    },
    error: {
      bg: 'rgba(244, 67, 54, 0.1)',
      border: 'rgba(244, 67, 54, 0.3)',
      hover: 'rgba(244, 67, 54, 0.2)',
      color: '#f44336',
    },
  };

  return {
    minWidth: 'unset',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors[color].bg,
    border: `1px solid ${colors[color].border}`,
    color: colors[color].color,
    '&:hover': {
      background: colors[color].hover,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  };
});

// Enhanced Button with Loading State and Tooltip support
export const SpaceButton = React.forwardRef(
  ({ 
    children, 
    variant = 'primary', 
    loading = false, 
    tooltip = '', 
    animate = false,
    glow = false,
    iconPosition = 'start',
    startIcon,
    endIcon,
    disabled = false,
    size = 'medium',
    fullWidth = false,
    ...props 
  }, ref) => {
    // Determine which button component to use
    const ButtonComponent = {
      primary: PrimarySpaceButton,
      secondary: SecondarySpaceButton,
      book: BookNowButton,
      emergency: EmergencyButton,
      success: SuccessButton,
      cosmic: CosmicButton,
      glass: GlassButton,
      orbit: OrbitButton,
    }[variant] || PrimarySpaceButton;

    // Create button content with loading state
    const buttonContent = (
      <ButtonComponent 
        ref={ref}
        disabled={disabled || loading}
        size={size}
        animate={animate}
        glow={glow}
        fullWidth={fullWidth}
        startIcon={loading ? null : (iconPosition === 'start' && startIcon)}
        endIcon={loading ? null : (iconPosition === 'end' && endIcon || iconPosition === 'end' && startIcon)}
        {...props}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color="inherit" 
              sx={{ mr: children ? 1 : 0 }} 
            />
            {children}
          </Box>
        ) : children}
      </ButtonComponent>
    );
    
    // Add tooltip if provided
    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow>
          {buttonContent}
        </Tooltip>
      );
    }
    
    return buttonContent;
  }
);

export default SpaceButton;