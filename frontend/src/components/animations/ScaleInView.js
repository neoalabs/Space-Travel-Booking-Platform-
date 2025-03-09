// src/components/animations/ScaleInView.js
import React from 'react';
import { motion } from 'framer-motion';

const ScaleInView = ({ children, delay = 0, duration = 0.5, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScaleInView;