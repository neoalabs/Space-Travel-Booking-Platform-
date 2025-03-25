// src/pages/LoginPage.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, TextField, Button, 
  Paper, Grid, Link as MuiLink, IconButton,
  InputAdornment, Divider, Checkbox, FormControlLabel,
  Tooltip, CircularProgress, useTheme, alpha
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Styled components
const GlowingCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(22, 27, 51, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(140, 158, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(140, 158, 255, 0.15)',
  overflow: 'hidden',
  position: 'relative',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #FFFFFF 0%, #8C9EFF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  fontWeight: 700,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: 'rgba(16, 20, 42, 0.5)',
    backdropFilter: 'blur(5px)',
    borderRadius: 10,
    border: '1px solid rgba(140, 158, 255, 0.2)',
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover, &.Mui-focused': {
      border: '1px solid rgba(140, 158, 255, 0.5)',
      boxShadow: '0 0 15px rgba(140, 158, 255, 0.2)'
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(2),
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const GlowingButton = styled(Button)(({ theme }) => ({
  borderRadius: 28,
  padding: theme.spacing(1.5, 4),
  position: 'relative',
  overflow: 'hidden',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  fontWeight: 600,
  fontSize: '1rem',
  letterSpacing: 0.5,
  background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
  boxShadow: '0 4px 14px rgba(105, 121, 248, 0.5)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(105, 121, 248, 0.7)',
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

const SocialButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  borderRadius: '50%',
  padding: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-3px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  }
}));

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Refs
  const threeJsContainerRef = useRef(null);
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  
  // Generate stars for background
  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }));
    setStars(generatedStars);
  }, []);
  
  // Initialize Three.js scene for immersive background
  useEffect(() => {
    if (!threeJsContainerRef.current) return;
    
    // Initialize Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Clean up existing canvas if any
    while (threeJsContainerRef.current.firstChild) {
      threeJsContainerRef.current.removeChild(threeJsContainerRef.current.firstChild);
    }
    
    threeJsContainerRef.current.appendChild(renderer.domElement);
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20 - 5;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Create a nebula effect using point clouds
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaMaterial = new THREE.PointsMaterial({
      color: 0x8c9eff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const nebulaVertices = [];
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (Math.random() - 0.5) * 3 - 8;
      nebulaVertices.push(x, y, z);
    }
    
    nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaVertices, 3));
    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
    
    // Create a second nebula with different color
    const nebula2Geometry = new THREE.BufferGeometry();
    const nebula2Material = new THREE.PointsMaterial({
      color: 0xff9e80,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const nebula2Vertices = [];
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 3;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (Math.random() - 0.5) * 3 - 10;
      nebula2Vertices.push(x, y, z);
    }
    
    nebula2Geometry.setAttribute('position', new THREE.Float32BufferAttribute(nebula2Vertices, 3));
    const nebula2 = new THREE.Points(nebula2Geometry, nebula2Material);
    scene.add(nebula2);
    
    // Handle mouse movement for interactive background
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      stars.rotation.y = mouseX * 0.1;
      stars.rotation.x = mouseY * 0.1;
      
      nebula.rotation.y = mouseX * 0.2;
      nebula.rotation.x = mouseY * 0.2;
      
      nebula2.rotation.y = -mouseX * 0.1;
      nebula2.rotation.x = -mouseY * 0.1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      stars.rotation.y += 0.0003;
      nebula.rotation.y += 0.0005;
      nebula2.rotation.y -= 0.0003;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating login process
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <Box sx={{ 
      marginTop: '5%',
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0B0D1B 0%, #161B33 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pt: { xs: 10, md: 0 },
      pb: { xs: 10, md: 0 },
      overflow: 'hidden'
    }}>
      {/* Three.js Background */}
      <Box 
        ref={threeJsContainerRef}
        sx={{ 
          position: 'fixed',
          top: '0',
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.8,
          '& canvas': {
            display: 'block',
          }
        }}
      />
      
      {/* Stars background */}
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
      
      {/* Shooting star animation */}
      <Box 
        component={motion.div}
        animate={{
          left: ['-5%', '120%'],
          top: ['40%', '30%'],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 4,
          times: [0, 0.1, 0.9, 1],
          repeat: Infinity,
          repeatDelay: 15
        }}
        sx={{
          position: 'absolute',
          width: 150,
          height: 2,
          background: 'linear-gradient(90deg, rgba(140, 158, 255, 0) 0%, rgba(140, 158, 255, 1) 100%)',
          boxShadow: '0 0 10px rgba(140, 158, 255, 0.8), 0 0 20px rgba(140, 158, 255, 0.5)',
          borderRadius: 4,
          zIndex: 0,
          transform: 'rotate(-15deg)'
        }}
      />
      
      {/* Background planet */}
      <Box 
        component={motion.div}
        animate={{ 
          y: [0, -15, 0],
          rotate: 360,
        }}
        transition={{
          y: { 
            duration: 12, 
            repeat: Infinity,
            repeatType: 'loop'
          },
          rotate: {
            duration: 180,
            repeat: Infinity,
            ease: 'linear'
          }
        }}
        sx={{
          position: 'absolute',
          right: { xs: -50, md: '5%' },
          top: { xs: '10%', md: '20%' },
          width: { xs: 100, md: 150 },
          height: { xs: 100, md: 150 },
          borderRadius: '50%',
          background: 'radial-gradient(circle at 70% 30%, #11aaff 0%, #0088cc 70%, #006699 100%)',
          filter: 'blur(1px)',
          opacity: 0.25,
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%)',
          }
        }}
      />
      
      <Container 
        maxWidth="lg" 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Grid 
          container 
          spacing={4} 
          justifyContent="center" 
          alignItems="center"
          sx={{ minHeight: '100vh' }}
        >
          {/* Left side - Login form */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            lg={5}
            component={motion.div}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <GlowingCard elevation={10} sx={{ p: { xs: 3, md: 5 } }}>
              {/* Logo and Title */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 4,
                  position: 'relative'
                }}
              >
                <Box 
                  component={motion.div}
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    y: [0, -3, 3, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(140, 158, 255, 0.2) 0%, rgba(140, 158, 255, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(140, 158, 255, 0.3)'
                    }}
                  >
                    <RocketLaunchIcon 
                      sx={{ 
                        fontSize: 40, 
                        color: '#8C9EFF',
                        filter: 'drop-shadow(0 0 8px rgba(140, 158, 255, 0.8))'
                      }}
                    />
                  </Box>
                </Box>
                
                <GradientText variant="h4" component="h1" align="center" gutterBottom>
                  Welcome Back
                </GradientText>
                
                <Typography 
                  variant="subtitle1" 
                  align="center" 
                  color="rgba(255, 255, 255, 0.7)" 
                  sx={{ maxWidth: 300, mx: 'auto', mb: 3 }}
                >
                  Sign in to access your space journey dashboard
                </Typography>
              </Box>
              
              {/* Login Form */}
              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                noValidate 
                sx={{ mt: 1 }}
              >
                <motion.div 
                  variants={staggerItems}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemFadeIn}>
                    <StyledTextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemFadeIn}>
                    <StyledTextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePassword}
                              edge="end"
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemFadeIn}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&.Mui-checked': {
                                color: theme.palette.primary.main,
                              }
                            }}
                          />
                        }
                        label="Remember me"
                        sx={{ 
                          '& .MuiFormControlLabel-label': { 
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem'
                          }
                        }}
                      />
                      
                      <MuiLink 
                        href="#" 
                        variant="body2"
                        sx={{ 
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: theme.palette.primary.light,
                          }
                        }}
                      >
                        Forgot password?
                      </MuiLink>
                    </Box>
                  </motion.div>
                  
                  <motion.div variants={itemFadeIn}>
                    <GlowingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      endIcon={loading ? null : <ArrowForwardIcon />}
                      sx={{ mt: 2, mb: 3 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Sign In'
                      )}
                    </GlowingButton>
                  </motion.div>
                </motion.div>
                
                <Divider sx={{ 
                  my: 3, 
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.9rem',
                  '&::before, &::after': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}>
                  or continue with
                </Divider>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                    <SocialButton>
                      <GoogleIcon />
                    </SocialButton>
                    <SocialButton>
                      <FacebookIcon />
                    </SocialButton>
                    <SocialButton>
                      <TwitterIcon />
                    </SocialButton>
                  </Box>
                </motion.div>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Don't have an account?{' '}
                    <MuiLink 
                      component={Link} 
                      to="/register"
                      sx={{ 
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: theme.palette.primary.light,
                        }
                      }}
                    >
                      Sign Up
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </GlowingCard>
          </Grid>
          
          {/* Right side - Information */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            lg={5}
            sx={{ 
              display: { xs: 'none', md: 'block' },
              position: 'relative' 
            }}
          >
            <Box 
              component={motion.div}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              sx={{ 
                position: 'relative',
                zIndex: 2
              }}
            >
              <GradientText 
                variant="h3" 
                gutterBottom
                sx={{ mb: 4 }}
              >
                Journey Beyond Earth
              </GradientText>
              
              <Box 
                sx={{ 
                  mb: 4,
                  p: 3,
                  background: 'rgba(22, 27, 51, 0.6)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 3,
                  border: '1px solid rgba(140, 158, 255, 0.2)',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <StarIcon sx={{ color: theme.palette.primary.main }} />
                  Exclusive Member Benefits
                </Typography>
                
                <Typography variant="body1" color="rgba(255, 255, 255, 0.8)" paragraph>
                  Sign in to access your space traveler dashboard where you can manage bookings, 
                  track achievements, and prepare for your cosmic journey.
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box 
                    component={motion.div}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    sx={{ 
                      p: 2.5, 
                      background: 'rgba(22, 27, 51, 0.6)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 3,
                      border: '1px solid rgba(140, 158, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Box 
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(140, 158, 255, 0.2)',
                      }}
                    >
                      <PublicIcon sx={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        Journey Management
                      </Typography>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        View and manage all your upcoming space trips in one place
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box 
                    component={motion.div}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    sx={{ 
                      p: 2.5, 
                      background: 'rgba(22, 27, 51, 0.6)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 3,
                      border: '1px solid rgba(140, 158, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Box 
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 158, 128, 0.2)',
                      }}
                    >
                      <ShieldIcon sx={{ color: '#FF9E80' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                        Secure Access
                      </Typography>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        Your journey details are protected with advanced security
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Box 
                sx={{ 
                  mt: 4,
                  p: 2,
                  background: 'rgba(255, 158, 128, 0.1)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 158, 128, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <InfoOutlinedIcon sx={{ color: '#FF9E80' }} />
                <Typography variant="body2" color="rgba(255, 255, 255, 0.9)">
                  By signing in, you agree to our Terms of Service and Space Travel Policies.
                </Typography>
              </Box>
            </Box>
            
            {/* Decorative floating elements */}
            <Box 
              component={motion.div}
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{
                duration:
                10, 
                repeat: Infinity,
                repeatType: 'loop'
              }}
              sx={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(140, 158, 255, 0.4) 0%, rgba(140, 158, 255, 0) 70%)',
                filter: 'blur(20px)',
                zIndex: 0
              }}
            />
            
            <Box 
              component={motion.div}
              animate={{ 
                y: [0, 30, 0],
              }}
              transition={{
                duration: 15, 
                repeat: Infinity,
                repeatType: 'loop'
              }}
              sx={{
                position: 'absolute',
                bottom: '15%',
                left: '5%',
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 70% 70%, rgba(255, 158, 128, 0.3) 0%, rgba(255, 158, 128, 0) 70%)',
                filter: 'blur(25px)',
                zIndex: 0
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;