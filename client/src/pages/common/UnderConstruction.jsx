/* client/src/pages/common/UnderConstruction.jsx */
import React from 'react';
import PropTypes from 'prop-types'; // <--- NEW IMPORT
import { Box, Typography, Paper } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const UnderConstruction = ({ title }) => {
  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '24px',
          border: '2px dashed #ccc',
          backgroundColor: '#fafafa'
        }}
      >
        <ConstructionIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
          This module is currently in development.
        </Typography>
      </Paper>
    </Box>
  );
};

// === PROP VALIDATION ===
UnderConstruction.propTypes = {
  title: PropTypes.string.isRequired,
};

export default UnderConstruction;