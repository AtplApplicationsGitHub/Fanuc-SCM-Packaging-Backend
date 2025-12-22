/* client/src/components/Navbar.jsx */
import React, { useContext } from 'react';
import PropTypes from 'prop-types'; // <--- NEW IMPORT
import { AppBar, Toolbar, Box, ToggleButton, ToggleButtonGroup, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../context/ThemeContext';
// === LOGIC IMPORT ===
import { useLocation } from 'react-router-dom';

const Navbar = ({ handleDrawerToggle }) => {
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  // === LOGIC HOOK ===
  const location = useLocation();

  const fanucCrimson = '#FED100'; 
  const fanucYellow = '#FED100';
  
  // High-intensity "Light" Yellow for the edge highlight
  const electricYellow = '#FFFDE7'; 

  // CHECK: Are we on the Login Page?
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        zIndex: 1201, 
        borderRadius: '0 0 32px 32px !important', 
        backgroundColor: `${fanucYellow} !important`,
        boxShadow: 'none !important',
        border: 'none !important',
        
        // === ELECTRIC GLIP ===
        borderBottom: `6px solid ${isDark ? electricYellow : '#454545'} !important`,
        
        // The "Glow" logic: only active in dark mode
        filter: isDark 
          ? `drop-shadow(0px 8px 15px rgba(254, 209, 0, 0.5))` 
          : 'none',
          
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px !important', px: 4 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* CONTROL ZONE (Hidden on Login Page) */}
          {!isLoginPage && (
              <IconButton 
                onClick={handleDrawerToggle}
                sx={{ 
                    backgroundColor: '#000000 !important', 
                    color: `${fanucCrimson} !important`, 
                    borderRadius: '12px',
                    width: '46px',
                    height: '46px',
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                    '&:hover': { 
                      backgroundColor: '#1A1A1A !important',
                      transform: 'scale(1.05)' 
                    },
                    transition: 'all 0.2s ease'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '22px' }}>
                    <Box sx={{ width: '100%', height: '3px', bgcolor: 'currentColor', borderRadius: '4px' }} />
                    <Box sx={{ width: '65%', height: '3px', bgcolor: 'currentColor', borderRadius: '4px' }} />
                    <Box sx={{ width: '100%', height: '3px', bgcolor: 'currentColor', borderRadius: '4px' }} />
                </Box>
              </IconButton>
          )}

          {/* BEVELED SPLITTER (Hidden on Login Page) */}
          {!isLoginPage && (
              <Box sx={{ 
                height: '46px', 
                width: '2px', 
                mx: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRight: '1.5px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1px'
              }} />
          )}

          {/* LOGO ZONE */}
          <img 
            src="/logo.svg" 
            alt="FANUC India" 
            style={{ height: '42px', width: 'auto', display: 'block' }} 
          />
        </Box>

        {/* THEME TOGGLE */}
        <Box> 
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && toggleColorMode()}
            sx={{
              height: '38px',
              backgroundColor: isDark ? '#222222' : '#454545', 
              borderRadius: '50px', 
              padding: '2px',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '50px', 
                padding: '0 16px',
                color: 'rgba(254, 209, 0, 0.4)', 
                '&.Mui-selected': { 
                  backgroundColor: '#111 !important', 
                  color: fanucYellow 
                }
              }
            }}
          >
            <ToggleButton value="light"><Brightness7Icon sx={{ fontSize: '1.2rem' }} /></ToggleButton>
            <ToggleButton value="dark"><Brightness4Icon sx={{ fontSize: '1.2rem' }} /></ToggleButton>
          </ToggleButtonGroup>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

// === PROP VALIDATION ===
Navbar.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Navbar;