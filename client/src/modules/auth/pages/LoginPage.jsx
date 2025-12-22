/* client/src/modules/auth/pages/LoginPage.jsx */
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, Button, TextField, Paper, Alert, CssBaseline, Container, Typography, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar'; 
import { loginUser } from '../services/authService';
import { getHomeRoute } from '../../../utils/roleRedirect';

const ELEMENT_RADIUS = '16px';

// === HELPER: EXTRACTED STYLES (Reduces Cognitive Complexity) ===
const getInputStyles = (isDark) => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: isDark ? '#0A0A0A' : '#ffffff',
      borderRadius: ELEMENT_RADIUS, 
      transition: 'all 0.2s ease',
      '& fieldset': { borderColor: isDark ? '#333' : '#000000', borderWidth: '1px' },
      '&:hover fieldset': { borderColor: isDark ? '#666' : '#000000', borderWidth: '2px' },
      '&.Mui-focused fieldset': { borderColor: '#FED100 !important', borderWidth: '2px' },
      
      // === AUTOFILL OVERRIDE ===
      '& input': { 
        color: isDark ? '#fff' : '#000', 
        padding: '16px 20px', 
        fontSize: '1rem', 
        fontWeight: 600,

        // TARGETS CHROME/EDGE AUTOFILL
        '&:-webkit-autofill': {
            // Paint over the blue background
            WebkitBoxShadow: `0 0 0 1000px ${isDark ? '#0A0A0A' : '#ffffff'} inset`,
            WebkitTextFillColor: isDark ? '#fff' : '#000',
            caretColor: isDark ? '#fff' : '#000',
            borderRadius: 'inherit'
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: isDark ? '#888' : '#000000', fontWeight: 600, 
      '&.Mui-focused': { color: isDark ? '#FED100' : '#000000', fontWeight: 800 }
    }
});

const LoginPage = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  // Call the helper function instead of defining the object inline
  const roundedInputStyle = getInputStyles(isDark);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setErrorMsg(null);
      try {
        const data = await loginUser(values);
        
        if (data.tokens && data.tokens.access) {
            sessionStorage.setItem('access_token', data.tokens.access);
            sessionStorage.setItem('refresh_token', data.tokens.refresh);
            sessionStorage.setItem('user_role', data.user.role_name); 
            
            const targetPath = getHomeRoute(data.user.role_name);
            navigate(targetPath, { replace: true });
            
        } else {
            setErrorMsg('Login succeeded but no token received.');
        }

      } catch (err) {
        console.error("Login Error:", err);
        setErrorMsg('Invalid email or password.');
      }
    },
  });

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: isDark ? '#0A0A0A' : '#F4F6F8' }}>
      <CssBaseline />
      <Navbar />
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Container maxWidth="xs"> 
            <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', backgroundColor: isDark ? '#1A1A1A' : '#ffffff', border: isDark ? '3px solid #000' : '3px solid #000000', boxShadow: '0 8px 0 #000000' }}>
            <Box sx={{ width: '100%', bgcolor: '#FED100', px: 3, py: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #000' }}>
                <Box sx={{ backgroundColor: '#000', padding: '12px 36px', borderRadius: '50px', boxShadow: '0 6px 0 rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#FED100', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: '"Roboto", sans-serif', lineHeight: 1, fontSize: '1.8rem' }}>Sign In</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                {[1, 2, 3].map((item) => (<Box key={item} sx={{ width: '14px', height: '14px', backgroundColor: '#000', borderRadius: '50%', opacity: 1, boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)' }} />))}
                </Box>
            </Box>
            <Box sx={{ p: 4, pt: 6 }}>
                {errorMsg && <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: ELEMENT_RADIUS }}>{errorMsg}</Alert>}
                <Box component="form" onSubmit={formik.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}> 
                    <TextField fullWidth id="email" name="email" label="Email or Username" variant="outlined" sx={roundedInputStyle} value={formik.values.email} onChange={formik.handleChange} />
                    <TextField fullWidth id="password" name="password" label="Password" type="password" variant="outlined" sx={roundedInputStyle} value={formik.values.password} onChange={formik.handleChange} />
                </Box>
                <Button type="submit" fullWidth variant="contained" disableElevation disabled={formik.isSubmitting} sx={{ mt: 6, height: '56px', borderRadius: ELEMENT_RADIUS, fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: isDark ? '#FED100' : '#000', color: isDark ? '#000' : '#FED100', border: 'none', '&:hover': { backgroundColor: isDark ? '#EAB308' : '#333', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}>
                    {formik.isSubmitting ? 'Authenticating...' : 'Access System'}
                </Button>
                </Box>
            </Box>
            </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;