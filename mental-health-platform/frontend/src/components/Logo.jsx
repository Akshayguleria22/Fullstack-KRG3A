import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Psychology, Favorite } from '@mui/icons-material';

const Logo = ({ size = 'medium', showText = true }) => {
  const sizes = {
    small: { icon: 24, text: 'h6' },
    medium: { icon: 32, text: 'h5' },
    large: { icon: 48, text: 'h4' },
  };

  const { icon, text } = sizes[size];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      {/* Animated Logo Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            position: 'relative',
            width: icon * 1.8,
            height: icon * 1.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          }}
        >
          {/* Pulsing Background Effect */}
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              opacity: 0.5,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Brain Icon */}
          <Psychology
            sx={{
              fontSize: icon,
              color: 'white',
              position: 'relative',
              zIndex: 1,
            }}
          />
          
          {/* Heart Icon - Animated */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              zIndex: 2,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Favorite
              sx={{
                fontSize: icon * 0.4,
                color: '#ff4d6d',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              }}
            />
          </motion.div>
        </Box>
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography
            variant={text}
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            MindWell
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: '1px',
              marginTop: -0.5,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Your Mental Wellness Partner
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default Logo;
