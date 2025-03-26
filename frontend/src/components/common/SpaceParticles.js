// src/components/common/SpaceParticles.js
import React, { useEffect, useState, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useTheme, useMediaQuery } from '@mui/material';

// Preset configurations for different space environments
const PARTICLE_PRESETS = {
  // Deep space with distant stars and nebulae
  deepSpace: {
    fpsLimit: 60,
    particles: {
      number: {
        value: 160,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: true,
          speed: 0.2,
          opacity_min: 0.3,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.3,
          sync: false
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 0.2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "bubble"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 0.5
          }
        },
        bubble: {
          distance: 200,
          size: 4,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  },
  
  // Orbital view with more connected particles
  orbit: {
    fpsLimit: 60,
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#8c9eff", "#536dfe", "#c5cae9", "#ffffff"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 2.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 600
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 200,
          line_linked: {
            opacity: 0.4
          }
        },
        bubble: {
          distance: 200,
          size: 5,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  },
  
  // Cosmic with special effects like comets
  cosmic: {
    fpsLimit: 60,
    particles: {
      number: {
        value: 120,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#ffffff", "#8c9eff", "#ff9e80", "#ffcc80", "#b39ddb"]
      },
      shape: {
        type: ["circle", "star"],
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        }
      },
      opacity: {
        value: 0.6,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "random",
        opacity: 0.15,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "repulse"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 200,
          line_linked: {
            opacity: 0.4
          }
        },
        bubble: {
          distance: 250,
          size: 6,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.8
        },
        push: {
          particles_nb: 8
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  },
  
  // Nebula effect with colored particles
  nebula: {
    fpsLimit: 60,
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ["#673ab7", "#9c27b0", "#3f51b5", "#2196f3", "#009688"]
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        }
      },
      opacity: {
        value: 0.4,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 100,
        color: "#9c27b0",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "bubble"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 200,
          line_linked: {
            opacity: 0.4
          }
        },
        bubble: {
          distance: 200,
          size: 8,
          duration: 2,
          opacity: 0.6,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.8
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  },
  
  // Warp speed effect with particles moving in one direction
  warpSpeed: {
    fpsLimit: 60,
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        }
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 20,
        direction: "bottom",
        random: false,
        straight: true,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false
        },
        onclick: {
          enable: true,
          mode: "repulse"
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        }
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  },
  
  // Minimal sparse stars for subtle effects
  minimal: {
    fpsLimit: 60,
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: false
        }
      },
      size: {
        value: 1.5,
        random: true,
        anim: {
          enable: false
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 0.2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false
        },
        onclick: {
          enable: false
        },
        resize: true
      }
    },
    retina_detect: true,
    background: {
      color: "transparent",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover"
    }
  }
};

// Special effects configuration
const SPECIAL_EFFECTS = {
  comets: {
    particles: {
      number: {
        value: 5,
        density: {
          enable: false
        }
      },
      color: {
        value: "#f5f5f5"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.8,
        random: false
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 10,
        direction: "top-right",
        random: true,
        straight: true,
        out_mode: "out",
        bounce: false,
        trail: {
          enable: true,
          length: 30,
          fill: { color: "#61dafb" }
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false
        },
        onclick: {
          enable: false
        },
        resize: true
      }
    }
  },
  
  slowGlow: {
    particles: {
      number: {
        value: 25,
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: ["#8c9eff", "#64b5f6", "#ffcc80"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: true,
          speed: 0.2,
          opacity_min: 0.2,
          sync: false
        }
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          size_min: 2,
          sync: false
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 0.2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "bounce",
        bounce: true
      }
    }
  }
};

/**
 * Enhanced SpaceParticles Component with multiple presets and interactive options
 * @param {Object} props - Component properties
 * @param {string} props.preset - Preset configuration: 'deepSpace', 'orbit', 'cosmic', 'nebula', 'warpSpeed', 'minimal'
 * @param {boolean} props.interactive - Enable interactive effects with mouse
 * @param {number} props.density - Particle density multiplier (0.5 to 2)
 * @param {number} props.speed - Particle movement speed multiplier (0.5 to 2)
 * @param {number} props.opacity - Overall particle opacity (0.1 to 1)
 * @param {string} props.specialEffect - Add special effect: 'comets', 'slowGlow', or none
 * @param {boolean} props.highPerformance - Reduce effects for better performance on low-end devices
 * @param {Object} props.style - Additional styles for the container
 */
const SpaceParticles = ({
  preset = 'deepSpace',
  interactive = true,
  density = 1,
  speed = 1,
  opacity = 1,
  specialEffect = null,
  highPerformance = false,
  style = {}
}) => {
  const theme = useTheme();
  const isLowPowerDevice = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Adjust for high performance mode or low power devices
  const shouldReduceMotion = highPerformance || isLowPowerDevice;
  
  // Initialize state for the particle configuration
  const [particlesConfig, setParticlesConfig] = useState(null);
  
  // Prepare configuration with user preferences
  useEffect(() => {
    // Get the base preset
    const basePreset = PARTICLE_PRESETS[preset] || PARTICLE_PRESETS.deepSpace;
    
    // Create a deep copy we can modify
    const configCopy = JSON.parse(JSON.stringify(basePreset));
    
    // Adjust particle density
    const originalValue = configCopy.particles.number.value;
    configCopy.particles.number.value = Math.floor(originalValue * density);
    
    // Adjust movement speed
    if (configCopy.particles.move && configCopy.particles.move.enable) {
      configCopy.particles.move.speed = configCopy.particles.move.speed * speed;
    }
    
    // Adjust opacity
    if (configCopy.particles.opacity) {
      configCopy.particles.opacity.value = 
        configCopy.particles.opacity.value * opacity;
    }
    
    // Disable interactivity if not interactive
    if (!interactive) {
      configCopy.interactivity.events.onhover.enable = false;
      configCopy.interactivity.events.onclick.enable = false;
    }
    
    // Apply performance optimizations if needed
    if (shouldReduceMotion) {
      configCopy.particles.number.value = Math.floor(configCopy.particles.number.value * 0.5);
      configCopy.particles.move.speed = configCopy.particles.move.speed * 0.7;
      configCopy.fpsLimit = 30;
      
      // Disable animations
      if (configCopy.particles.opacity.anim) {
        configCopy.particles.opacity.anim.enable = false;
      }
      if (configCopy.particles.size.anim) {
        configCopy.particles.size.anim.enable = false;
      }
    }
    
    // Add special effects if requested
    if (specialEffect && SPECIAL_EFFECTS[specialEffect]) {
      // Combine effects with main configuration
      configCopy.emitters = [SPECIAL_EFFECTS[specialEffect].particles];
      
      if (SPECIAL_EFFECTS[specialEffect].particles) {
        // Add as separate particles group
        configCopy.particlesGroups = {
          specialEffect: SPECIAL_EFFECTS[specialEffect].particles
        };
      }
    }
    
    // Set the final configuration
    setParticlesConfig(configCopy);
  }, [preset, interactive, density, speed, opacity, specialEffect, shouldReduceMotion]);
  
  // Initialize tsParticles
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', ...style }}>
      {particlesConfig && (
        <Particles
          id="space-particles"
          init={particlesInit}
          options={particlesConfig}
        />
      )}
    </div>
  );
};

export default SpaceParticles;