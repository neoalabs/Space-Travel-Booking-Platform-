// src/components/common/StarfieldBackground.js
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Box, useTheme, useMediaQuery } from '@mui/material';

/**
 * Enhanced StarfieldBackground with multiple visual effects
 * @param {Object} props - Component properties
 * @param {number} props.baseDensity - Base number of stars (default: 100)
 * @param {string} props.theme - Visual theme: 'deepSpace', 'cosmic', 'nebula', 'blue', 'purple' (default: 'deepSpace')
 * @param {boolean} props.shootingStars - Enable shooting star effects (default: true)
 * @param {boolean} props.parallax - Enable parallax effect with mouse movement (default: true)
 * @param {boolean} props.pulsating - Enable star pulsating effects (default: true)
 * @param {boolean} props.nebulaClouds - Add nebula cloud effects (default: false)
 * @param {boolean} props.interactive - Make stars move away from cursor (default: false)
 * @param {number} props.scrollFactor - How much scroll affects parallax (0-1) (default: 0.3)
 * @param {string} props.direction - Direction of star movement: 'random', 'top', 'bottom', 'left', 'right' (default: 'random')
 * @param {string} props.className - Additional CSS class
 */
const StarfieldBackground = ({
  baseDensity = 100,
  theme = 'deepSpace',
  shootingStars = true,
  parallax = true,
  pulsating = true,
  nebulaClouds = false,
  interactive = false,
  scrollFactor = 0.3,
  direction = 'random',
  className = ''
}) => {
  const themeObject = useTheme();
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery(themeObject.breakpoints.down('sm'));
  
  // Adjust features based on device and preferences
  const shouldReduceEffects = isReducedMotion || isMobile;
  const effectiveParallax = parallax && !shouldReduceEffects;
  const effectivePulsating = pulsating && !shouldReduceEffects;
  const effectiveShootingStars = shootingStars && !shouldReduceEffects;
  
  // Adjust density based on device type to prevent performance issues
  const effectiveDensity = shouldReduceEffects ? Math.floor(baseDensity * 0.6) : baseDensity;
  
  // Control when shooting stars appear
  const [showShootingStar, setShowShootingStar] = useState(false);
  const shootingStarControls = useAnimation();
  
  // Stars state
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Position nebula clouds
  const [nebulae, setNebulae] = useState([]);
  
  // Theme colors configuration
  const themeColors = useMemo(() => {
    const themes = {
      deepSpace: {
        starColors: ['#ffffff', '#fffafa', '#f8f8ff', '#f5f5f5'],
        shootingStarColor: '#ffffff',
        nebulaColors: ['rgba(76, 104, 215, 0.08)', 'rgba(140, 158, 255, 0.1)', 'rgba(63, 81, 181, 0.07)']
      },
      cosmic: {
        starColors: ['#ffffff', '#f8f7ff', '#ffc7c7', '#c7d5ff', '#dcffdb'],
        shootingStarColor: '#8df0ff',
        nebulaColors: ['rgba(255, 112, 112, 0.08)', 'rgba(130, 170, 255, 0.1)', 'rgba(152, 255, 183, 0.08)']
      },
      nebula: {
        starColors: ['#ffffff', '#ffcbb6', '#ffb4ed', '#ffc36b'],
        shootingStarColor: '#ff9e80',
        nebulaColors: ['rgba(171, 71, 188, 0.1)', 'rgba(255, 112, 67, 0.08)', 'rgba(255, 214, 0, 0.07)']
      },
      blue: {
        starColors: ['#ffffff', '#caf0f8', '#ade8f4', '#90e0ef'],
        shootingStarColor: '#48cae4',
        nebulaColors: ['rgba(0, 119, 182, 0.08)', 'rgba(0, 150, 199, 0.1)', 'rgba(0, 180, 216, 0.07)']
      },
      purple: {
        starColors: ['#ffffff', '#e0c3fc', '#d8bbff', '#c8b6ff'],
        shootingStarColor: '#c77dff',
        nebulaColors: ['rgba(110, 16, 176, 0.08)', 'rgba(126, 87, 194, 0.1)', 'rgba(149, 117, 205, 0.07)']
      }
    };
    
    return themes[theme] || themes.deepSpace;
  }, [theme]);
  
  // Generate stars with different properties
  useEffect(() => {
    // Generate main stars
    const generateStars = () => {
      const newStars = [];
      
      for (let i = 0; i < effectiveDensity; i++) {
        // Divide stars into 3 depth layers for parallax
        const depthLayer = Math.floor(Math.random() * 3) + 1;
        const parallaxAmount = effectiveParallax ? depthLayer * 0.5 : 0;
        
        // Calculate size based on depth layer (distant stars are smaller)
        const baseSize = 4 - depthLayer;
        const maxSize = baseSize * 2;
        
        // Create the star
        newStars.push({
          id: `star-${i}`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size: Math.random() * (maxSize - baseSize) + baseSize,
          opacity: Math.random() * 0.5 + 0.2,
          color: themeColors.starColors[Math.floor(Math.random() * themeColors.starColors.length)],
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          blurAmount: depthLayer === 3 ? 0 : depthLayer === 2 ? '0.5px' : '0.8px',
          depthLayer,
          parallaxAmount
        });
      }
      setStars(newStars);
    };
    
    // Generate nebula clouds if enabled
    const generateNebulae = () => {
      if (!nebulaClouds) {
        setNebulae([]);
        return;
      }
      
      const newNebulae = [];
      const numberOfNebulae = isMobile ? 2 : 4;
      
      for (let i = 0; i < numberOfNebulae; i++) {
        newNebulae.push({
          id: `nebula-${i}`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 30 + 20}%`,
          height: `${Math.random() * 30 + 20}%`,
          color: themeColors.nebulaColors[i % themeColors.nebulaColors.length],
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.5 + 0.3,
          blur: `${Math.random() * 50 + 30}px`
        });
      }
      setNebulae(newNebulae);
    };
    
    generateStars();
    generateNebulae();
    
    // Event cleanup
    return () => {
      setStars([]);
      setNebulae([]);
    };
  }, [effectiveDensity, themeColors, effectiveParallax, nebulaClouds, isMobile]);
  
  // Handle shooting stars effect
  useEffect(() => {
    if (!effectiveShootingStars) return;
    
    const triggerShootingStar = () => {
      // Only show shooting stars occasionally
      if (Math.random() > 0.7) {
        setShowShootingStar(true);
        
        // Animate the shooting star
        shootingStarControls.start({
          left: ['0%', '100%'],
          top: ['0%', '70%'],
          opacity: [0, 1, 0],
          transition: {
            duration: Math.random() * 2 + 1.5,
            ease: "easeOut"
          }
        }).then(() => {
          setShowShootingStar(false);
        });
      }
    };
    
    // Trigger shooting stars at random intervals
    const interval = setInterval(triggerShootingStar, Math.random() * 7000 + 3000);
    
    return () => clearInterval(interval);
  }, [effectiveShootingStars, shootingStarControls]);
  
  // Handle parallax effect with mouse movement
  useEffect(() => {
    if (!effectiveParallax || !containerRef.current) return;
    
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate relative position within container (from -0.5 to 0.5)
      const relativeX = ((e.clientX - rect.left) / rect.width - 0.5);
      const relativeY = ((e.clientY - rect.top) / rect.height - 0.5);
      
      // Update motion values
      mouseX.set(relativeX);
      mouseY.set(relativeY);
      
      // If interactive, store mouse position for star interaction
      if (interactive) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      // Calculate scroll position relative to the document
      const scrollY = window.scrollY / document.body.scrollHeight;
      
      // Apply a small parallax effect based on scroll
      mouseY.set(scrollY * scrollFactor);
    };
    
    if (effectiveParallax) {
      document.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (effectiveParallax) {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [effectiveParallax, mouseX, mouseY, interactive, scrollFactor]);
  
  // Create blinking animations for stars
  const getAnimationStyle = (star) => {
    if (!effectivePulsating) return {};
    
    // Subtle animations
    return {
      animation: `twinkle-${star.id} ${star.animationDuration} infinite alternate ${star.animationDelay}`,
      '@keyframes': {
        [`twinkle-${star.id}`]: {
          '0%': { 
            opacity: star.opacity, 
            boxShadow: `0 0 ${star.size * 0.5}px ${star.color}` 
          },
          '100%': { 
            opacity: star.opacity * 0.3, 
            boxShadow: `0 0 ${star.size * 0.3}px ${star.color}` 
          }
        }
      }
    };
  };

  // Create reference values for max parallax effect
  // These hooks are now at the top level, not in callbacks
  const baseXParallax = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const baseYParallax = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);
  
  return (
    <Box
      ref={containerRef}
      className={`starfield-background ${className}`}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Nebula clouds if enabled */}
      {nebulaClouds && nebulae.map(nebula => (
        <motion.div
          key={nebula.id}
          style={{
            position: 'absolute',
            top: nebula.top,
            left: nebula.left,
            width: nebula.width,
            height: nebula.height,
            backgroundColor: nebula.color,
            borderRadius: '50%',
            filter: `blur(${nebula.blur})`,
            opacity: nebula.opacity,
            transform: `rotate(${nebula.rotation}deg)`,
            mixBlendMode: 'screen',
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [nebula.opacity, nebula.opacity * 1.2, nebula.opacity],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        />
      ))}
      
      {/* Main stars with parallax */}
      {stars.map(star => {
        // Use the star's parallax amount to modify the base transform
        // instead of creating a new transform hook for each star
        const starStyle = {
          position: 'absolute',
          top: star.top,
          left: star.left,
          width: `${star.size}px`,
          height: `${star.size}px`,
          backgroundColor: star.color,
          borderRadius: '50%',
          opacity: star.opacity,
          filter: `blur(${star.blurAmount})`,
        };

        // For interactive mode, create derived values without hooks
        const getInteractiveXY = () => {
          if (!interactive || !mousePosition.x || !star.left) {
            return {};
          }
          
          // Parse percentage values to numbers
          const starLeft = parseFloat(star.left);
          const starTop = parseFloat(star.top);
          
          return {
            x: (starLeft - mousePosition.x) * 0.01 * star.parallaxAmount,
            y: (starTop - mousePosition.y) * 0.01 * star.parallaxAmount
          };
        };

        return (
          <motion.div
            key={star.id}
            style={starStyle}
            animate={{
              // Apply parallax effect by multiplying the base transform by the star's parallax amount
              x: interactive ? getInteractiveXY().x : baseXParallax.get() * star.parallaxAmount,
              y: interactive ? getInteractiveXY().y : baseYParallax.get() * star.parallaxAmount
            }}
            transition={{
              type: 'spring',
              stiffness: 50,
              damping: 20
            }}
            sx={getAnimationStyle(star)}
          />
        );
      })}
      
      {/* Shooting star */}
      {effectiveShootingStars && showShootingStar && (
        <motion.div
          animate={shootingStarControls}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: themeColors.shootingStarColor,
            borderRadius: '50%',
            boxShadow: `0 0 10px 2px ${themeColors.shootingStarColor}`,
            zIndex: 10,
          }}
        >
          {/* Shooting star trail */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '60px',
              height: '1px',
              background: `linear-gradient(to left, transparent, ${themeColors.shootingStarColor})`,
              transform: 'rotate(5deg)',
              transformOrigin: 'right center',
            }}
          />
        </motion.div>
      )}
      
      {/* Adding a subtle gradient overlay based on theme */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: theme === 'cosmic' ? 
            'radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(25,32,72,0.4) 100%)' :
            theme === 'nebula' ?
            'radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(44,20,62,0.4) 100%)' :
            theme === 'blue' ?
            'radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(7,11,52,0.4) 100%)' :
            theme === 'purple' ?
            'radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(38,14,71,0.4) 100%)' :
            'radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(8,11,33,0.4) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default StarfieldBackground;