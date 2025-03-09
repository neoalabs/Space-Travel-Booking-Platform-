// src/components/animations/FadeInView.js
import React from 'react';
import { motion } from 'framer-motion';

const FadeInView = ({ children, delay = 0, duration = 0.5, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeInView;