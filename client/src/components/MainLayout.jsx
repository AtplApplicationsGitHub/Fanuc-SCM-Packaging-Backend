/* client/src/components/MainLayout.jsx */
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    Box, Container, useTheme, Dialog, DialogTitle, 
    DialogContent, DialogActions, Button, Typography 
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // === 1. CHANGE: Sidebar defaults to CLOSED (false) ===
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Back Button Warning State
  const [showExitWarning, setShowExitWarning] = useState(false);

  // === THE BACK BUTTON TRAP ===
  useEffect(() => {
    // 1. Push the current state to history stack on mount
    window.history.pushState(null, null, window.location.pathname);

    const handlePopState = (event) => {
      // 2. Browser Back Button was clicked!
      // A. Push state again to "Undo" the URL change visually
      window.history.pushState(null, null, window.location.pathname);
      
      // B. Show our Custom Warning
      setShowExitWarning(true);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location]); // Re-arm trap on route change

  // === HANDLE CONFIRM LOGOUT ===
  const handleConfirmExit = () => {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar handleDrawerToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <Sidebar open={isSidebarOpen} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 4, 
            zIndex: 1, 
            // Margin adjusts dynamically based on sidebar state
            marginLeft: isSidebarOpen ? '120px' : '20px', 
            transition: 'margin 0.3s ease-in-out',
          }}
        >
          <Container maxWidth={false}><Outlet /></Container>
        </Box>
      </Box>

      {/* === EXIT WARNING MODAL === */}
      <Dialog 
        open={showExitWarning} 
        onClose={() => setShowExitWarning(false)}
        PaperProps={{
            sx: {
                borderRadius: '16px',
                borderTop: '6px solid #d32f2f', // Red Warning Top
                bgcolor: 'background.paper',
                minWidth: '320px'
            }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f', fontWeight: 'bold' }}>
            <WarningIcon />
            SECURITY WARNING
        </DialogTitle>
        <DialogContent>
            <Typography variant="body1" fontWeight="600">
                You are attempting to leave the secure session.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Going back will sign you out immediately. You will not be able to return without logging in again.
            </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button 
                onClick={() => setShowExitWarning(false)} 
                variant="outlined"
                sx={{ fontWeight: 'bold', color: 'text.primary', borderColor: 'divider' }}
            >
                Stay Logged In
            </Button>
            <Button 
                onClick={handleConfirmExit} 
                variant="contained" 
                color="error"
                sx={{ fontWeight: 'bold' }}
            >
                Sign Out & Leave
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;