// src/components/common/SpaceParticles.js
import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const SpaceParticles = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="space-particles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: true,
            speed: 0.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.4,
            random: true,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: 3,
            random: true,
          },
        },
        detectRetina: true,
      }}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
        top: 0,
        left: 0,
      }}
    />
  );
};

export default SpaceParticles;