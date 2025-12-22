/* client/src/modules/users/components/CreateUserModal.jsx */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography,
  FormControlLabel, Switch, useTheme, Autocomplete
} from '@mui/material';

// ROLES
const ROLES = [
  'Sales Engineer', 
  'Sales Manager', 
  'SCM Admin', 
  'Management'
];

// Validation Schema
const UserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  password: Yup.string()
    .min(8, 'Must be at least 8 chars')
    .matches(/[A-Z]/, 'Must contain 1 Uppercase')
    .matches(/\d/, 'Must contain 1 Number') // <--- FIXED: Used \d instead of [0-9]
    .matches(/[!@#$%^&*]/, 'Must contain 1 Special Char')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const CreateUserModal = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // Get the actual hex color of the paper to paint over the autofill blue
  const paperColor = theme.palette.background.paper;

  const formik = useFormik({
    initialValues: {
      name: '', email: '', role: '', 
      password: '', confirmPassword: '', 
      is_active: true
    },
    validationSchema: UserSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...dataToSend } = values;
      onSubmit(dataToSend);
      formik.resetForm();
    },
  });

  // Auto-Reset on Open
  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);

  // === STYLE WITH AUTOFILL FIX ===
  const inputStyle = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: isDark ? '#444' : '#ccc' },
        '&:hover fieldset': { borderColor: '#FED100' },
        '&.Mui-focused fieldset': { borderColor: '#FED100' },
        
        // AUTOFILL OVERRIDE
        '& input': {
            '&:-webkit-autofill': {
                // Use the theme's paper color to hide the blue
                WebkitBoxShadow: `0 0 0 1000px ${paperColor} inset`,
                WebkitTextFillColor: isDark ? '#fff' : '#000',
                caretColor: isDark ? '#fff' : '#000',
                borderRadius: 'inherit'
            }
        }
    }
  };

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
            sx: {
                borderRadius: '16px',
                borderLeft: '6px solid #FED100',
                bgcolor: 'background.paper'
            }
        }}
    >
      <DialogTitle sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
        New User Entry
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
            <Box display="flex" flexDirection="column" gap={1}>
                <TextField
                    fullWidth label="Full Name" name="name"
                    {...formik.getFieldProps('name')}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={inputStyle}
                />
                
                <TextField
                    fullWidth label="Email / Username" name="email"
                    {...formik.getFieldProps('email')}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={inputStyle}
                />

                {/* === TYPE-AS-YOU-GO DROPDOWN === */}
                <Autocomplete
                    fullWidth
                    options={ROLES}
                    value={formik.values.role}
                    onChange={(e, value) => formik.setFieldValue('role', value)}
                    onBlur={() => formik.setFieldTouched('role', true)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Role Assignment"
                            name="role"
                            error={formik.touched.role && Boolean(formik.errors.role)}
                            helperText={formik.touched.role && formik.errors.role}
                            sx={inputStyle}
                        />
                    )}
                />

                <Box display="flex" gap={2}>
                    <TextField
                        fullWidth type="password" label="Password" name="password"
                        {...formik.getFieldProps('password')}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        sx={inputStyle}
                    />
                    <TextField
                        fullWidth type="password" label="Confirm" name="confirmPassword"
                        {...formik.getFieldProps('confirmPassword')}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        sx={inputStyle}
                    />
                </Box>

                <FormControlLabel
                    control={
                        <Switch 
                            checked={formik.values.is_active} 
                            onChange={formik.handleChange} 
                            name="is_active" 
                            color="success" 
                        />
                    }
                    label={<Typography fontWeight="bold">Account Active</Typography>}
                />
            </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
                bgcolor: '#FED100', color: 'black', fontWeight: 'bold',
                '&:hover': { bgcolor: '#fff' }
            }}
          >
            Create Record
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// === PROP VALIDATION ===
CreateUserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default CreateUserModal;