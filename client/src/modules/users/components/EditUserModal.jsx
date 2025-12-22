/* client/src/modules/users/components/EditUserModal.jsx */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types'; // <--- NEW IMPORT
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography,
  FormControlLabel, Switch, useTheme, Autocomplete
} from '@mui/material';

const ROLES = ['Sales Engineer', 'Sales Manager', 'SCM Admin', 'Management'];

const EditUserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  password: Yup.string().min(8, 'Must be at least 8 chars'), 
});

const EditUserModal = ({ open, onClose, onSubmit, user }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const paperColor = theme.palette.background.paper;

  const formik = useFormik({
    initialValues: {
      name: '', email: '', role: '', 
      password: '', is_active: true
    },
    validationSchema: EditUserSchema,
    onSubmit: (values) => {
      const dataToSend = { ...values };
      if (!dataToSend.password) delete dataToSend.password;
      onSubmit(user.id, dataToSend);
    },
  });

  // Load User Data
  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        is_active: user.active,
        password: '' 
      });
    }
  }, [user]);

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
        Edit User: {user?.name}
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
                    // Handles the case where the role might be null initially
                    isOptionEqualToValue={(option, value) => option === value || value === ''}
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

                <TextField
                    fullWidth type="password" 
                    label="New Password (Optional)" 
                    placeholder="Leave blank to keep current"
                    name="password"
                    {...formik.getFieldProps('password')}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx={inputStyle}
                />

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
            Update Record
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// === PROP VALIDATION ===
EditUserModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        active: PropTypes.bool
    }), // 'user' can be null initially, so not marked isRequired, or handled by defaultProps if needed
};

export default EditUserModal;