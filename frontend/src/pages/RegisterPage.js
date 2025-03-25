// src/pages/RegisterPage.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, TextField, Button, 
  Paper, Grid, Link as MuiLink, IconButton,
  InputAdornment, Divider, Stepper, Step, StepLabel,
  Tooltip, CircularProgress, useTheme, alpha,
  StepConnector, stepConnectorClasses, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, Checkbox
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ScienceIcon from '@mui/icons-material/Science';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
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

const GlowingButton = styled(Button)(({ theme, variant }) => {
  const isContained = variant !== 'outlined';
  return {
    borderRadius: 28,
    padding: theme.spacing(1.5, 4),
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    fontWeight: 600,
    fontSize: '1rem',
    letterSpacing: 0.5,
    ...(isContained && {
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
    }),
    ...(!isContained && {
      borderColor: 'rgba(140, 158, 255, 0.5)',
      color: 'white',
      '&:hover': {
        borderColor: 'rgba(140, 158, 255, 0.8)',
        background: 'rgba(140, 158, 255, 0.05)',
      }
    })
  };
});

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

// Custom Stepper components
const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: 'rgba(140, 158, 255, 0.15)',
    borderRadius: 1,
  },
}));

const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: 'rgba(140, 158, 255, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 44,
  zIndex: 1,
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  ...(ownerState.completed && {
    color: theme.palette.primary.main,
  }),
}));

const StepIconContent = styled('div')(({ theme, ownerState }) => ({
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: 'rgba(16, 20, 42, 0.5)',
  border: '2px solid currentColor',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  ...(ownerState.active && {
    boxShadow: '0 0 15px rgba(140, 158, 255, 0.7)',
    background: 'rgba(140, 158, 255, 0.1)',
  }),
}));

// Custom StepIcon component
function SpaceStepIcon(props) {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <PersonIcon />,
    2: <VerifiedUserIcon />,
    3: <SettingsIcon />,
  };

  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      <StepIconContent ownerState={{ active, completed }}>
        {completed ? <CheckCircleOutlineIcon /> : icons[String(icon)]}
      </StepIconContent>
    </StepIconRoot>
  );
}

const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Refs
  const threeJsContainerRef = useRef(null);
  
  // States
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [spaceExperience, setSpaceExperience] = useState('none');
  const [preferredDestination, setPreferredDestination] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  
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
  
  const steps = [
    'Personal Information',
    'Security Details',
    'Space Preferences'
  ];
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating registration process
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
  
  const blinkAnimation = {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'mirror'
      }
    }
  };
  
  // Validation checks
  const isEmailValid = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
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
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
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
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon />
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
                error={email !== '' && !isEmailValid}
                helperText={email !== '' && !isEmailValid ? "Please enter a valid email" : null}
              />
            </motion.div>
          </motion.div>
        );
      case 1:
        return (
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
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
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
                sx={{ mb: 3 }}
                error={password !== '' && !isPasswordValid}
                helperText={password !== '' && !isPasswordValid ? "Password must be at least 8 characters" : null}
              />
            </motion.div>
            
            <motion.div variants={itemFadeIn}>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
                error={confirmPassword !== '' && !doPasswordsMatch}
                helperText={confirmPassword !== '' && !doPasswordsMatch ? "Passwords don't match" : null}
              />
            </motion.div>
            
            <motion.div variants={itemFadeIn}>
              <Box 
                sx={{ 
                  mt: 2,
                  p: 2,
                  background: 'rgba(140, 158, 255, 0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(140, 158, 255, 0.2)',
                }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Password Strength
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                  <Box 
                    component={motion.div}
                    initial={{ width: 0 }}
                    animate={{ width: `${password.length >= 8 ? 100 : (password.length / 8) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      background: password.length >= 8 
                        ? 'linear-gradient(90deg, #8C9EFF 0%, #6979F8 100%)' 
                        : 'linear-gradient(90deg, #FF9E80 0%, #FF6E40 100%)',
                      boxShadow: password.length >= 8 
                        ? '0 0 10px rgba(105, 121, 248, 0.5)'
                        : '0 0 10px rgba(255, 110, 64, 0.5)',
                      mb: 1
                    }}
                  />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: password.length >= 8 
                          ? theme.palette.primary.main 
                          : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {password.length >= 8 
                        ? <CheckCircleOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} /> 
                        : <Box 
                            component="span" 
                            sx={{ 
                              width: 14, 
                              height: 14, 
                              borderRadius: '50%', 
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              mr: 0.5,
                              display: 'inline-block'
                            }} 
                          />
                      }
                      At least 8 characters
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: /[A-Z]/.test(password) 
                          ? theme.palette.primary.main 
                          : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {/[A-Z]/.test(password) 
                        ? <CheckCircleOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} /> 
                        : <Box 
                            component="span" 
                            sx={{ 
                              width: 14, 
                              height: 14, 
                              borderRadius: '50%', 
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              mr: 0.5,
                              display: 'inline-block'
                            }} 
                          />
                      }
                      Uppercase letter
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: /[0-9]/.test(password) 
                          ? theme.palette.primary.main 
                          : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {/[0-9]/.test(password) 
                        ? <CheckCircleOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} /> 
                        : <Box 
                            component="span" 
                            sx={{ 
                              width: 14, 
                              height: 14, 
                              borderRadius: '50%', 
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              mr: 0.5,
                              display: 'inline-block'
                            }} 
                          />
                      }
                      Number
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: /[^A-Za-z0-9]/.test(password) 
                          ? theme.palette.primary.main 
                          : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {/[^A-Za-z0-9]/.test(password) 
                        ? <CheckCircleOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} /> 
                        : <Box 
                            component="span" 
                            sx={{ 
                              width: 14, 
                              height: 14, 
                              borderRadius: '50%', 
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              mr: 0.5,
                              display: 'inline-block'
                            }} 
                          />
                      }
                      Special character
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            variants={staggerItems}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemFadeIn}>
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                >
                  Previous Space Experience
                </FormLabel>
                <RadioGroup
                  name="spaceExperience"
                  value={spaceExperience}
                  onChange={(e) => setSpaceExperience(e.target.value)}
                  sx={{ mt: 1 }}
                >
                  <FormControlLabel 
                    value="none" 
                    control={
                      <Radio 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    } 
                    label="First-time space traveler" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="simulation" 
                    control={
                      <Radio 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    } 
                    label="Space simulation training" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="zerog" 
                    control={
                      <Radio 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    } 
                    label="Zero-G experience" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="orbital" 
                    control={
                      <Radio 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    } 
                    label="Previous orbital flight" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </motion.div>
            
            <motion.div variants={itemFadeIn}>
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                >
                  Preferred Space Destination
                </FormLabel>
                <RadioGroup
                  name="preferredDestination"
                  value={preferredDestination}
                  onChange={(e) => setPreferredDestination(e.target.value)}
                  sx={{ mt: 1 }}
                >
                  <FormControlLabel 
                    value="orbit" 
                    control={
                      <Radio 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    } 
                    label="Earth's Orbit" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="moon" 
                    control={
                      <Radio 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    } 
                    label="Lunar Gateway" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="mars" 
                    control={
                      <Radio 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    } 
                    label="Mars Base Alpha" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  />
                  <FormControlLabel 
                    value="any" 
                    control={
                      <Radio 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    } 
                    label="Any destination - I'm flexible" 
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                      }
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </motion.div>
            
            <motion.div variants={itemFadeIn}>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                      I agree to the{' '}
                      <MuiLink 
                        component={Link} 
                        to="#"
                        sx={{ 
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        Terms of Service
                      </MuiLink>{' '}
                      and{' '}
                      <MuiLink 
                        component={Link} 
                        to="#"
                        sx={{ 
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        Space Travel Policies
                      </MuiLink>
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start' }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        }
                      }}
                    />
                  }
                  label="Keep me updated with space travel news and special offers"
                  sx={{ 
                    mt: 1,
                    '& .MuiFormControlLabel-label': { 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem'
                    }
                  }}
                />
              </Box>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ 
      position: 'relative',
      marginTop:'7%',
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
          top: 0,
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
          top: ['20%', '10%'],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 4,
          times: [0, 0.1, 0.9, 1],
          repeat: Infinity,
          repeatDelay: 12
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
      
      {/* Background planets */}
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
          left: { xs: -50, md: '5%' },
          top: { xs: '10%', md: '15%' },
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
          borderRadius: '50%',
          background: 'radial-gradient(circle at 70% 30%, #aa7700 0%, #995500 60%, #774400 100%)',
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
        maxWidth="md" 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{ position: 'relative', zIndex: 1 }}
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
              Join the Space Travelers
            </GradientText>
            
            <Typography 
              variant="subtitle1" 
              align="center" 
              color="rgba(255, 255, 255, 0.7)" 
              sx={{ maxWidth: 450, mx: 'auto', mb: 3 }}
            >
              Create your account to book and manage cosmic journeys beyond Earth
            </Typography>
          </Box>
          
          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel 
            connector={<StyledStepConnector />}
            sx={{ mb: 4 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={SpaceStepIcon}>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Form */}
          <Box 
            component="form" 
            onSubmit={activeStep === steps.length - 1 ? handleSubmit : undefined} 
            noValidate 
            sx={{ mt: 1 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <GlowingButton
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </GlowingButton>
              
              {activeStep === steps.length - 1 ? (
                <GlowingButton
                  type="submit"
                  variant="contained"
                  disabled={loading || !agreeTerms}
                  endIcon={loading ? null : <ArrowForwardIcon />}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Complete Registration'
                  )}
                </GlowingButton>
              ) : (
                <GlowingButton
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && (!firstName || !lastName || !isEmailValid)) ||
                    (activeStep === 1 && (!isPasswordValid || !doPasswordsMatch))
                  }
                  endIcon={<ArrowForwardIcon />}
                >
                  Next
                </GlowingButton>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ 
            my: 4, 
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
              Already have an account?{' '}
              <MuiLink 
                component={Link} 
                to="/login"
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
                Sign In
              </MuiLink>
            </Typography>
          </Box>
          
          {/* Information note */}
          <Box 
            sx={{ 
              mt: 4,
              p: 2,
              background: 'rgba(255, 158, 128, 0.1)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              border: '1px solid rgba(255, 158, 128, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <InfoOutlinedIcon sx={{ color: '#FF9E80' }} />
            <Typography variant="body2" color="rgba(255, 255, 255, 0.9)">
              Ready to explore the cosmos? Register now to book your journey to space with Dubai's premier space travel service.
            </Typography>
          </Box>
        </GlowingCard>
      </Container>
    </Box>
  );
};

export default RegisterPage;