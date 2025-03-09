// src/components/common/SpaceButtons.js
import { Button, styled } from '@mui/material';

export const PrimarySpaceButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: 'white',
  borderRadius: 28,
  padding: '10px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: `0 4px 14px rgba(61, 90, 254, 0.4)`,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 6px 20px rgba(61, 90, 254, 0.6)`,
    transform: 'translateY(-2px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    transition: 'all 0.6s ease',
  },
  '&:hover::after': {
    left: '100%',
  }
}));

export const SecondarySpaceButton = styled(Button)(({ theme }) => ({
  background: `rgba(255, 255, 255, 0.05)`,
  backdropFilter: 'blur(10px)',
  border: `2px solid rgba(255, 255, 255, 0.2)`,
  color: 'white',
  borderRadius: 28,
  padding: '8px 22px',
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `rgba(255, 255, 255, 0.1)`,
    border: `2px solid rgba(255, 255, 255, 0.3)`,
  },
}));

export const BookNowButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: 'white',
  borderRadius: 28,
  padding: '10px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: `0 4px 14px rgba(255, 110, 64, 0.4)`,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 6px 20px rgba(255, 110, 64, 0.6)`,
    transform: 'translateY(-2px)',
  },
}));