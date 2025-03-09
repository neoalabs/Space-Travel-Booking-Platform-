// src/components/common/SpaceDestinationCard.js
import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlowingCard = styled(Card)(({ theme, isHovered }) => ({
  background: 'rgba(22, 27, 51, 0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isHovered ? 'rgba(140, 158, 255, 0.4)' : 'rgba(140, 158, 255, 0.15)'}`,
  transition: 'all 0.3s ease',
  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
  boxShadow: isHovered 
    ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(140, 158, 255, 0.4)' 
    : '0 8px 20px rgba(0, 0, 0, 0.3)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const SpaceDestinationCard = ({ destination, onBookNow }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <GlowingCard 
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        <CardMedia
          component="img"
          image={destination.imageUrl}
          alt={destination.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(0deg, rgba(22,27,51,1) 0%, rgba(22,27,51,0) 70%)',
        }} />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" component="h2" 
          sx={{ 
            mb: 1, 
            fontWeight: 600,
            color: isHovered ? '#8C9EFF' : 'white',
            transition: 'color 0.3s ease',
          }}
        >
          {destination.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {destination.description}
        </Typography>
        
        <Box sx={{
          mt: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography 
            variant="h6" 
            color="secondary" 
            sx={{ fontWeight: 600 }}
          >
            ${destination.basePrice.toLocaleString()}
          </Typography>
          
          <Button 
            variant={isHovered ? "contained" : "outlined"}
            size="small"
            color="primary"
            onClick={() => onBookNow(destination)}
            sx={{
              borderRadius: 28,
              transition: 'all 0.3s ease',
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </GlowingCard>
  );
};

export default SpaceDestinationCard;