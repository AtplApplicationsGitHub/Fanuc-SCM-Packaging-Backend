/* client/src/theme/theme.js */
// === 1. DEFINE YOUR BRAND COLORS ===
const BRAND = {
  yellow: '#FED100',
  yellowDark: '#EAB308',
  black: '#000000',
  darkGrey: '#1A1A1A',
  mediumGrey: '#333333',
  lightGrey: '#F4F6F8',
  white: '#FFFFFF',
  textGreyLight: '#666666',
  textGreyDark: '#AAAAAA',
  borderDark: '#666666', // The visible rail color in Dark Mode
  borderLight: '#000000' // The visible rail color in Light Mode
};

// === 2. DEFINE THE MODES ===
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    // PRIMARY ACTION COLOR (THE YELLOW)
    primary: {
      main: BRAND.yellow,
      dark: BRAND.yellowDark,
      contrastText: BRAND.black, 
    },
    // SECONDARY / ACCENT
    secondary: {
      main: BRAND.black,
      light: '#333',
    },
    // BACKGROUNDS
    background: {
      default: mode === 'dark' ? BRAND.black : BRAND.lightGrey,
      paper: mode === 'dark' ? BRAND.darkGrey : BRAND.white,
    },
    // TEXT COLORS
    text: {
      primary: mode === 'dark' ? BRAND.white : BRAND.black,
      secondary: mode === 'dark' ? BRAND.textGreyDark : BRAND.textGreyLight,
    },
    // BORDERS (DIVIDERS)
    divider: mode === 'dark' ? BRAND.mediumGrey : '#e0e0e0',
  },
  
  // === 3. GLOBAL COMPONENT OVERRIDES ===
  components: {
    
    // --- BUTTONS ---
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        },
      },
    },

    // --- CARDS / PAPER (THE SLAB FIX) ---
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => {
          // Define contrast colors for the slab effect
          // Light Mode = Black Slab
          // Dark Mode = Dark Grey Slab (#333) so it pops against Black BG
          const borderColor = theme.palette.mode === 'dark' ? '#333' : '#000';
          const slabColor = theme.palette.mode === 'dark' ? '#333' : '#000';

          return {
            border: `2px solid ${borderColor}`,
            // 0px Blur = Hard Edge (Slab effect)
            boxShadow: `0 8px 0 ${slabColor} !important`, 
            borderRadius: '16px',
            overflow: 'hidden' 
          };
        },
      },
    },

    // --- TABLE CELLS (THE RAIL LOGIC) ---
    MuiTableCell: {
        styleOverrides: {
          // 1. HEADERS (The Control Panel)
          head: ({ theme }) => ({
            color: theme.palette.primary.main, // Always Yellow Text
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            backgroundColor: '#000', // Always Black Header
            
            // The High Visibility Bottom Rail
            borderBottom: `4px solid ${theme.palette.mode === 'dark' ? BRAND.borderDark : BRAND.borderLight}`,
          }),
          
          // 2. BODY CELLS (The Data)
          body: ({ theme }) => ({
            fontWeight: 600,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },

    // --- TABLE ROWS ---
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
            // FIX: Only hover on BODY rows, not HEAD rows
          '&:not(.MuiTableRow-head):hover': {
            backgroundColor: theme.palette.action.hover, 
          }
        })
      }
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
  },
});