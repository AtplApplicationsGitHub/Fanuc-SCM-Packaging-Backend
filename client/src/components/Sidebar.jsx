/* client/src/components/Sidebar.jsx */
import React from 'react';
import PropTypes from 'prop-types'; // <--- NEW IMPORT
import { Drawer, List, ListItemButton, Tooltip, useTheme, Divider, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout'; 

// === IMPORT CONFIG ===
import { NAVIGATION } from '../config/navigationConfig';

const RAIL_WIDTH = 80;
const CIRCLE_SIZE = 48; 
const YELLOW = '#FED100';
const BLACK = '#000000';

// === 1. SMALLER HELPER FUNCTIONS (Low Complexity) ===

const getBackgroundColor = (isDark, active) => {
    if (!active) return 'transparent';
    return isDark ? `${BLACK} !important` : `${YELLOW} !important`;
};

const getTextColor = (isDark, active, isLogout) => {
    if (isLogout) return isDark ? '#ff5252' : '#d32f2f';
    if (active) return isDark ? YELLOW : BLACK;
    return isDark ? BLACK : '#ffffff';
};

const getHoverBg = (isDark, active, isLogout) => {
    if (isLogout) return '#d32f2f !important';
    if (active) return isDark ? '#1a1a1a !important' : '#eab308 !important';
    return isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';
};

// === 2. MAIN STYLE AGGREGATOR (Complexity: 0) ===
const getButtonStyles = (isDark, active, isLogout) => ({
    backgroundColor: getBackgroundColor(isDark, active),
    color: getTextColor(isDark, active, isLogout),
    hoverBg: getHoverBg(isDark, active, isLogout)
});

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const lightShadow = `0px 0px 15px rgba(0, 0, 0, 0.2), 0px 0px 35px rgba(0, 0, 0, 0.35)`;
  const darkShadow = `0px 0px 20px rgba(254, 209, 0, 0.5), 0px 0px 45px rgba(254, 209, 0, 0.3)`;

  const userRole = sessionStorage.getItem('user_role');
  const authorizedItems = NAVIGATION.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const renderSidebarButton = (label, icon, onClick, active = false, isLogout = false) => {
    // Call the aggregator
    const styles = getButtonStyles(isDark, active, isLogout);

    return (
      <Box 
          key={label}
          sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexShrink: 0 
          }}
      >
          <Tooltip 
              title={label} placement="right" arrow
              slotProps={{
                  popper: { sx: { zIndex: 3000 }, modifiers: [{ name: 'offset', options: { offset: [0, 14] } }] },
                  tooltip: { sx: { fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', padding: '8px 12px', borderRadius: '4px', bgcolor: `${YELLOW} !important`, color: `${BLACK} !important`, boxShadow: '0px 4px 12px rgba(0,0,0,0.4)' } },
                  arrow: { sx: { color: `${YELLOW} !important`, '&::before': { boxShadow: 'none', zIndex: 3001 } } },
              }}
          >
              <ListItemButton
                  onClick={onClick}
                  disableGutters 
                  sx={{
                      width: `${CIRCLE_SIZE}px`,
                      minWidth: `${CIRCLE_SIZE}px`,
                      maxWidth: `${CIRCLE_SIZE}px`,
                      height: `${CIRCLE_SIZE}px`,
                      minHeight: `${CIRCLE_SIZE}px`,
                      maxHeight: `${CIRCLE_SIZE}px`,
                      aspectRatio: '1 / 1',
                      borderRadius: '50%',
                      flexShrink: 0, 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',

                      backgroundColor: styles.backgroundColor,
                      color: styles.color,

                      '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: styles.hoverBg,
                      }
                  }}
              >
                  {icon}
              </ListItemButton>
          </Tooltip>
      </Box>
    );
  };

  return (
    <Drawer
      variant="persistent" anchor="left" open={open}
      sx={{
        zIndex: 2000,
        '& .MuiDrawer-docked': { height: '100%' },
        '& .MuiDrawer-paper': {
          width: RAIL_WIDTH, left: '20px', top: '110px', bottom: '30px', height: 'auto', maxHeight: 'calc(100vh - 160px)', margin: 'auto 0',
          borderRadius: '40px !important', display: 'flex', flexDirection: 'column', 
          border: 'none !important', 
          overflowY: 'auto !important', 
          overflowX: 'hidden !important',
          '&::-webkit-scrollbar': { display: 'none' }, 
          backgroundColor: isDark ? `${YELLOW} !important` : `${BLACK} !important`,
          boxShadow: isDark ? `${darkShadow} !important` : `${lightShadow} !important`,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease !important',
          opacity: open ? 1 : 0, transform: open ? 'translateX(0)' : 'translateX(-120px)',
        },
      }}
    >
      <List sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3, pt: 4, pb: 2 }}>
            {authorizedItems.map((item) => 
                renderSidebarButton(item.label, item.icon, () => navigate(item.path), location.pathname === item.path)
            )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, pb: 3 }}>
            <Divider sx={{ width: '40%', borderColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)', borderWidth: '1px' }} />
            {renderSidebarButton('Logout', <LogoutIcon />, handleLogout, false, true)}
        </Box>
      </List>
    </Drawer>
  );
};

// === PROP VALIDATION ===
Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default Sidebar;