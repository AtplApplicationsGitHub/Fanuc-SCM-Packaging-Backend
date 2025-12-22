/* client/src/components/Sidebar.jsx */
import React from 'react';
import { Drawer, List, ListItemButton, Tooltip, useTheme, Divider, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout'; 

// === IMPORT CONFIG ===
import { NAVIGATION } from '../config/navigationConfig';

const RAIL_WIDTH = 80;
const CIRCLE_SIZE = 48; // Rigid size (48px x 48px)

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const yellow = '#FED100';
  const black = '#000000';

  const lightShadow = `0px 0px 15px rgba(0, 0, 0, 0.2), 0px 0px 35px rgba(0, 0, 0, 0.35)`;
  const darkShadow = `0px 0px 20px rgba(254, 209, 0, 0.5), 0px 0px 45px rgba(254, 209, 0, 0.3)`;

  // 1. GET USER ROLE
  const userRole = sessionStorage.getItem('user_role');

  // 2. FILTER MENU
  const authorizedItems = NAVIGATION.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const renderSidebarButton = (label, icon, onClick, active = false, isLogout = false) => (
    // 1. LAYOUT WRAPPER (Centers the button, but doesn't stretch it)
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
                tooltip: { sx: { fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', padding: '8px 12px', borderRadius: '4px', bgcolor: `${yellow} !important`, color: `${black} !important`, boxShadow: '0px 4px 12px rgba(0,0,0,0.4)' } },
                arrow: { sx: { color: `${yellow} !important`, '&::before': { boxShadow: 'none', zIndex: 3001 } } },
            }}
        >
            {/* 2. THE BUTTON (Geometry Locked) */}
            <ListItemButton
                onClick={onClick}
                disableGutters 
                sx={{
                    // === GEOMETRY LOCKS (Prevents Ovals) ===
                    width: `${CIRCLE_SIZE}px`,
                    minWidth: `${CIRCLE_SIZE}px`, // FORCE WIDTH
                    maxWidth: `${CIRCLE_SIZE}px`,
                    
                    height: `${CIRCLE_SIZE}px`,
                    minHeight: `${CIRCLE_SIZE}px`, // FORCE HEIGHT
                    maxHeight: `${CIRCLE_SIZE}px`,
                    
                    aspectRatio: '1 / 1', // FORCE CIRCLE
                    borderRadius: '50%',
                    flexShrink: 0, 

                    // Alignment
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    
                    // Visuals
                    transition: 'all 0.2s ease',
                    backgroundColor: active 
                        ? (isDark ? `${black} !important` : `${yellow} !important`) 
                        : 'transparent',
                    color: isLogout 
                        ? (isDark ? '#ff5252' : '#d32f2f') 
                        : active ? (isDark ? yellow : black) : (isDark ? black : '#ffffff'),

                    '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: isLogout
                            ? '#d32f2f !important' 
                            : active 
                                ? (isDark ? '#1a1a1a !important' : '#eab308 !important') 
                                : (isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'),
                    }
                }}
            >
                {icon}
            </ListItemButton>
        </Tooltip>
    </Box>
  );

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

          backgroundColor: isDark ? `${yellow} !important` : `${black} !important`,
          boxShadow: isDark ? `${darkShadow} !important` : `${lightShadow} !important`,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease !important',
          opacity: open ? 1 : 0, transform: open ? 'translateX(0)' : 'translateX(-120px)',
        },
      }}
    >
      <List sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        padding: 0, 
        overflow: 'hidden' 
      }}>
        
        {/* === ZONE 1: CENTERED ICONS === */}
        <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 3, 
            pt: 4, // 32px Top Buffer (Prevents hitting the top edge)
            pb: 2
        }}>
            {authorizedItems.map((item) => 
                renderSidebarButton(item.label, item.icon, () => navigate(item.path), location.pathname === item.path)
            )}
        </Box>

        {/* === ZONE 2: LOGOUT (Bottom) === */}
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 1.5,
            pb: 3 // 24px Bottom Buffer (Sits perfectly in the curve)
        }}>
            <Divider sx={{ width: '40%', borderColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)', borderWidth: '1px' }} />
            {renderSidebarButton('Logout', <LogoutIcon />, handleLogout, false, true)}
        </Box>

      </List>
    </Drawer>
  );
};

export default Sidebar;