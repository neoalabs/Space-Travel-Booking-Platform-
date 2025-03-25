// src/components/animations/FadeInView.js
import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme, Box } from '@mui/material';

/**
 * Enhanced FadeInView component with multiple animation options
 * 
 * @param {ReactNode} children - Child components to animate
 * @param {number} delay - Delay before animation starts (in seconds)
 * @param {number} duration - Duration of animation (in seconds)
 * @param {string} direction - Direction of fade animation ('up', 'down', 'left', 'right', 'none')
 * @param {number} distance - Distance to travel during animation (in pixels)
 * @param {string} easing - Animation easing function
 * @param {boolean} once - Whether animation should only play once when in view
 * @param {number} threshold - Viewport threshold for triggering animation (0-1)
 * @param {boolean} staggerChildren - Whether to stagger children animations
 * @param {number} staggerDelay - Delay between each child animation (in seconds)
 * @param {string} animationVariant - Predefined animation variant ('cosmic', 'pulse', 'glide', 'bounce')
 * @param {Object} hover - Hover animation properties
 * @param {boolean} orchestrate - Coordinate with sibling animations
 * @param {string} className - Additional CSS class names
 * @param {Object} style - Additional inline styles
 */
const FadeInView = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 30,
  easing = 'easeOut',
  once = true,
  threshold = 0.1,
  staggerChildren = false,
  staggerDelay = 0.1,
  animationVariant = null,
  hover = null,
  orchestrate = false,
  className = '',
  style = {},
  ...props
}) => {
  const theme = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });
  
  // Handle animation triggering when element comes into view
  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, inView, once]);

  // Set initial animation properties based on direction
  let initialProps = { opacity: 0 };
  
  switch (direction) {
    case 'up':
      initialProps.y = distance;
      break;
    case 'down':
      initialProps.y = -distance;
      break;
    case 'left':
      initialProps.x = distance;
      break;
    case 'right':
      initialProps.x = -distance;
      break;
    case 'scale':
      initialProps.scale = 0.8;
      break;
    case 'none':
      // No additional properties needed
      break;
    default:
      initialProps.y = distance;
  }

  // Define animation variants
  const getCustomVariant = () => {
    switch (animationVariant) {
      case 'cosmic':
        return {
          hidden: { 
            opacity: 0, 
            y: direction === 'up' || direction === 'down' ? distance : 0,
            x: direction === 'left' || direction === 'right' ? distance : 0,
            scale: 0.9,
            filter: 'blur(10px)'
          },
          visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
              duration,
              delay,
              ease: 'easeOut',
              when: orchestrate ? 'beforeChildren' : undefined,
              staggerChildren: staggerChildren ? staggerDelay : undefined,
            }
          }
        };
      case 'pulse':
        return {
          hidden: { 
            opacity: 0, 
            scale: 0.5
          },
          visible: {
            opacity: 1,
            scale: [0.5, 1.05, 1],
            transition: {
              duration: duration * 1.2,
              delay,
              times: [0, 0.7, 1],
              ease: 'easeOut',
              when: orchestrate ? 'beforeChildren' : undefined,
              staggerChildren: staggerChildren ? staggerDelay : undefined,
            }
          }
        };
      case 'glide':
        return {
          hidden: { 
            opacity: 0, 
            y: direction === 'up' ? distance * 2 : -distance * 2,
            rotateX: direction === 'up' ? 30 : -30
          },
          visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
              duration: duration * 1.5,
              delay,
              ease: [0.215, 0.61, 0.355, 1],
              when: orchestrate ? 'beforeChildren' : undefined,
              staggerChildren: staggerChildren ? staggerDelay : undefined,
            }
          }
        };
      case 'bounce':
        return {
          hidden: { 
            opacity: 0, 
            y: direction === 'up' ? distance : -distance,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 15,
              delay,
              when: orchestrate ? 'beforeChildren' : undefined,
              staggerChildren: staggerChildren ? staggerDelay : undefined,
            }
          }
        };
      case 'float':
        return {
          hidden: { 
            opacity: 0, 
            y: distance,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: 'easeOut',
              when: orchestrate ? 'beforeChildren' : undefined,
              staggerChildren: staggerChildren ? staggerDelay : undefined,
            }
          },
          float: {
            y: [-5, 5, -5],
            transition: {
              y: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 4,
                ease: 'easeInOut'
              }
            }
          }
        };
      case 'glow':
        return {
          hidden: { 
            opacity: 0, 
            filter: 'brightness(0.5) blur(10px)',
          },
          visible: {
            opacity: 1,
            filter: 'brightness(1) blur(0px)',
            transition: {
              duration,
              delay,
              ease: 'easeOut',
              when: orchestrate ? 'beforeChildren' : undefined,
              staggerChildren: staggerChildren ? staggerDelay : undefined,
            }
          },
          pulse: {
            boxShadow: [
              '0 0 0 rgba(140, 158, 255, 0)',
              '0 0 10px rgba(140, 158, 255, 0.5)',
              '0 0 0 rgba(140, 158, 255, 0)'
            ],
            transition: {
              boxShadow: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 2,
                ease: 'easeInOut'
              }
            }
          }
        };
      default:
        return {
          hidden: { 
            opacity: 0, 
            ...initialProps
          },
          visible: {
            opacity: 1,
            y: initialProps.hasOwnProperty('y') ? 0 : undefined,
            x: initialProps.hasOwnProperty('x') ? 0 : undefined,
            scale: initialProps.hasOwnProperty('scale') ? 1 : undefined,
            transition: {
              duration,
              delay,
              ease: easing,
              when: orchestrate ? 'beforeChildren' : undefined,
              staggerChildren: staggerChildren ? staggerDelay : undefined,
            }
          }
        };
    }
  };
  
  const variants = getCustomVariant();
  
  // Handle hover animations if provided
  const hoverAnimations = hover ? {
    whileHover: hover.scale 
      ? { scale: hover.scale, transition: { duration: 0.3 } }
      : hover.glow 
        ? { boxShadow: `0 0 15px ${theme.palette.primary.main}` }
        : hover.custom || {}
  } : {};

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
      className={className}
      style={style}
      {...hoverAnimations}
      {...props}
    >
      {animationVariant === 'float' ? (
        <motion.div animate="float" variants={variants}>
          {children}
        </motion.div>
      ) : animationVariant === 'glow' ? (
        <motion.div animate="pulse" variants={variants}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

/**
 * ScaleInView Component - Specialized animation for scaling effects
 */
const ScaleInView = (props) => {
  return <FadeInView direction="scale" {...props} />;
};

/**
 * FloatInView Component - Elements that float after appearing
 */
const FloatInView = (props) => {
  return <FadeInView animationVariant="float" {...props} />;
};

/**
 * GlowInView Component - Elements that glow after appearing
 */
const GlowInView = (props) => {
  return <FadeInView animationVariant="glow" {...props} />;
};

/**
 * CosmicInView Component - Space-themed appearance animation
 */
const CosmicInView = (props) => {
  return <FadeInView animationVariant="cosmic" {...props} />;
};

/**
 * StaggerContainer - Container for staggered child animations
 */
const StaggerContainer = ({ 
  children, 
  delay = 0,
  staggerDelay = 0.1,
  className = '',
  style = {},
  ...props 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem - Item to be used within StaggerContainer
 */
const StaggerItem = ({ 
  children, 
  direction = 'up',
  distance = 20,
  className = '',
  style = {},
  ...props 
}) => {
  let yValue = 0;
  let xValue = 0;
  
  switch (direction) {
    case 'up':
      yValue = distance;
      break;
    case 'down':
      yValue = -distance;
      break;
    case 'left':
      xValue = distance;
      break;
    case 'right':
      xValue = -distance;
      break;
    default:
      yValue = distance;
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: yValue,
      x: xValue
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * RevealText - Text that reveals letter by letter
 */
const RevealText = ({ 
  text,
  delay = 0,
  staggerDelay = 0.02,
  duration = 0.5,
  tag = 'div',
  className = '',
  style = {},
  ...props 
}) => {
  const characters = text.split('');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: staggerDelay
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration
      }
    }
  };
  
  // Create a component based on the tag prop
  const MotionComponent = motion[tag];
  
  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        ...style
      }}
      {...props}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={childVariants}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

/**
 * SpaceParallax - Creates a parallax effect based on scroll or mouse movement
 */
const SpaceParallax = ({ 
  children, 
  speed = 0.5, 
  direction = 'y',
  mouseMove = false,
  className = '',
  style = {},
  ...props 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement if enabled
  React.useEffect(() => {
    if (!mouseMove) return;
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      setMousePosition({
        x: (clientX - centerX) / centerX,
        y: (clientY - centerY) / centerY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseMove]);
  
  return (
    <motion.div
      className={className}
      style={{
        position: 'relative',
        ...style
      }}
      {...props}
    >
      <motion.div
        style={{
          position: 'relative'
        }}
        animate={mouseMove ? {
          x: direction === 'x' || direction === 'both' ? mousePosition.x * 100 * speed : 0,
          y: direction === 'y' || direction === 'both' ? mousePosition.y * 100 * speed : 0
        } : undefined}
        transition={mouseMove ? { type: 'spring', stiffness: 50, damping: 30 } : undefined}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

/**
 * SpaceGradientText - Text with animated gradient effect
 */
const SpaceGradientText = ({
  children,
  animate = true,
  duration = 8,
  colors = ['#FFFFFF', '#8C9EFF', '#6979F8', '#BB86FC', '#FFFFFF'],
  className = '',
  style = {},
  ...props
}) => {
  const gradientAnimation = animate ? {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    },
    transition: {
      duration,
      ease: 'linear',
      repeat: Infinity,
    }
  } : {};

  return (
    <motion.div
      className={className}
      style={{
        background: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        display: 'inline-block',
        ...style
      }}
      {...gradientAnimation}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export {
  FadeInView as default,
  ScaleInView,
  FloatInView,
  GlowInView,
  CosmicInView,
  StaggerContainer,
  StaggerItem,
  RevealText,
  SpaceParallax,
  SpaceGradientText
};