// src/components/destinations/DestinationExplorer.js
import React, { useState } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const DestinationExplorer = ({ destinations }) => {
  const theme = useTheme();
  const [activeDestination, setActiveDestination] = useState(null);
  
  // Calculate positions for planets in a solar system style layout
  const getPositionStyle = (index, total) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 200; // orbit radius
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
    };
  };
  
  return (
    <Box sx={{ 
      position: 'relative', 
      height: 600, 
      width: '100%',
      overflow: 'hidden',
      bgcolor: 'background.subtle',
      borderRadius: 4,
      m: 'auto',
    }}>
      {/* Sun at the center */}
      <Box sx={{
        position: 'absolute',
        left: 'calc(50% - 40px)',
        top: 'calc(50% - 40px)',
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,223,128,1) 0%, rgba(255,158,128,1) 100%)',
        boxShadow: '0 0 40px rgba(255, 223, 128, 0.8)',
        filter: 'blur(2px)',
        zIndex: 1,
      }} />
      
      {/* Orbits */}
      <Box sx={{
        position: 'absolute',
        left: 'calc(50% - 200px)',
        top: 'calc(50% - 200px)',
        width: 400,
        height: 400,
        borderRadius: '50%',
        border: '1px dashed rgba(255, 255, 255, 0.1)',
        zIndex: 0,
      }} />
      
      {/* Destinations as planets */}
      {destinations.map((destination, index) => {
        const position = getPositionStyle(index, destinations.length);
        const isActive = activeDestination?.id === destination.id;
        
        return (
          <motion.div
            key={destination.id}
            initial={position}
            animate={{
              ...position,
              scale: isActive ? 1.4 : 1,
              zIndex: isActive ? 10 : 2,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20,
            }}
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
            }}
            onClick={() => setActiveDestination(destination)}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.background.paper} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: isActive 
                  ? `0 0 20px ${theme.palette.primary.main}` 
                  : 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${isActive ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.2)'}`,
              }}
            >
              <Typography variant="caption" align="center">
                {destination.name.split(' ')[0]}
              </Typography>
            </Box>
          </motion.div>
        );
      })}
      
      {/* Destination details panel */}
      {activeDestination && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 300,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary.main}`,
            boxShadow: `0 0 20px rgba(140, 158, 255, 0.2)`,
            zIndex: 20,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {activeDestination.name}
          </Typography>
          
          <Typography variant="body2" paragraph>
            {activeDestination.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="primary.main">
              ${activeDestination.basePrice.toLocaleString()}
            </Typography>
            
            <Button 
              variant="contained" 
              size="small"
              sx={{ borderRadius: 28 }}
            >
              Explore
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DestinationExplorer;