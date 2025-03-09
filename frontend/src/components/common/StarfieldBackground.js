// src/components/common/StarfieldBackground.js
import React, { useEffect, useState } from 'react';

const StarfieldBackground = ({ density = 100 }) => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const generatedStars = Array.from({ length: density }, () => ({
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, [density]);
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle 4s infinite alternate ${star.animationDelay}`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: var(--opacity); }
          100% { opacity: calc(var(--opacity) * 0.3); }
        }
      `}</style>
    </div>
  );
};

export default StarfieldBackground;