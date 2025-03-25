// src/components/animations/ScaleInView.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme, alpha } from '@mui/material';

/**
 * Enhanced ScaleInView component with cosmic animation effects
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {number} props.delay - Delay before animation starts (in seconds)
 * @param {number} props.duration - Animation duration (in seconds)
 * @param {number} props.initialScale - Initial scale value (default: 0.85)
 * @param {number} props.finalScale - Final scale value (default: 1)
 * @param {boolean} props.staggerChildren - Whether to stagger children animations
 * @param {number} props.staggerDelay - Delay between each child animation (in seconds)
 * @param {string} props.from - Direction to animate from ('top', 'bottom', 'left', 'right', 'center')
 * @param {boolean} props.infinite - Whether the animation should repeat infinitely
 * @param {string} props.effect - Additional effect ('glow', 'cosmic', 'nebula', 'stardust', 'pulse', 'none')
 * @param {boolean} props.fadeIn - Whether to also fade in (default: true)
 * @param {boolean} props.whenVisible - Only animate when in viewport
 * @param {string} props.easing - Animation easing function
 * @param {Object} props.style - Additional styles to apply
 */
const ScaleInView = ({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  initialScale = 0.85,
  finalScale = 1,
  staggerChildren = false,
  staggerDelay = 0.1,
  from = 'center',
  infinite = false,
  effect = 'none',
  fadeIn = true, 
  whenVisible = true,
  easing = "easeOut",
  style = {},
  ...props 
}) => {
  const theme = useTheme();
  const [elementRef, setElementRef] = useState(null);
  const [isVisible, setIsVisible] = useState(!whenVisible);
  
  // Calculate initial position offset based on 'from' direction
  const getInitialOffset = () => {
    switch (from) {
      case 'top': return { y: -30, x: 0 };
      case 'bottom': return { y: 30, x: 0 };
      case 'left': return { y: 0, x: -30 };
      case 'right': return { y: 0, x: 30 };
      default: return { y: 0, x: 0 };
    }
  };
  
  // Create effect-specific styles and animations
  const getEffectStyles = () => {
    switch (effect) {
      case 'glow':
        return {
          filter: 'drop-shadow(0 0 8px rgba(140, 158, 255, 0.8))',
          transition: { filter: { duration: 1.5 } }
        };
      case 'cosmic':
        return {
          boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.6)}`,
          transition: { boxShadow: { duration: 1.5 } }
        };
      case 'nebula':
        return {
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
          backdropFilter: 'blur(8px)',
          transition: { background: { duration: 1.5 } }
        };
      case 'stardust':
        return {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
            opacity: 0,
            transition: 'opacity 1.5s ease-out',
          },
          '&.active::before': {
            opacity: 1,
          }
        };
      case 'pulse':
        return {
          animation: infinite ? 
            'pulse 2s infinite alternate' : 
            'none',
          '@keyframes pulse': {
            '0%': { transform: `scale(${finalScale})` },
            '100%': { transform: `scale(${finalScale * 1.05})` }
          }
        };
      default:
        return {};
    }
  };
  
  // Intersection Observer to detect when element is in viewport
  useEffect(() => {
    if (!whenVisible || !elementRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(elementRef);
    
    return () => {
      if (elementRef) observer.unobserve(elementRef);
    };
  }, [elementRef, whenVisible]);
  
  // Initial offset based on direction
  const offset = getInitialOffset();
  
  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: fadeIn ? 0 : 1, 
      scale: initialScale,
      ...offset
    },
    visible: { 
      opacity: 1, 
      scale: finalScale,
      y: 0,
      x: 0,
      transition: {
        delay,
        duration,
        ease: easing,
        staggerChildren: staggerChildren ? staggerDelay : 0,
        repeat: infinite ? Infinity : 0,
        repeatType: infinite ? "reverse" : "none",
        repeatDelay: infinite ? 0.5 : 0
      }
    }
  };
  
  // Child variants for staggered animations
  const childVariants = staggerChildren ? {
    hidden: { 
      opacity: fadeIn ? 0 : 1, 
      scale: initialScale * 0.9,
      ...offset
    },
    visible: { 
      opacity: 1, 
      scale: finalScale,
      y: 0,
      x: 0,
      transition: {
        duration: duration * 0.8,
        ease: easing
      }
    }
  } : {};
  
  // Effect styles
  const effectStyles = getEffectStyles();
  
  // Combine all styles
  const combinedStyles = {
    ...style,
    ...effectStyles
  };

  return (
    <motion.div
      ref={setElementRef}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      style={combinedStyles}
      className={effect === 'stardust' && isVisible ? 'active' : ''}
      {...props}
    >
      {staggerChildren
        ? React.Children.map(children, child => (
            <motion.div variants={childVariants}>
              {child}
            </motion.div>
          ))
        : children
      }
    </motion.div>
  );
};

export default ScaleInView;