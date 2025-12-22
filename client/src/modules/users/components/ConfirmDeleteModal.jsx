import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, useTheme
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, userName }) => {
  const theme = useTheme();
  
  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
            sx: {
                borderRadius: '16px',
                borderTop: '6px solid #d32f2f', // Red Top Border for Danger
                bgcolor: 'background.paper'
            }
        }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f', fontWeight: 'bold' }}>
        <WarningIcon />
        CONFIRM DELETION
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" fontWeight="500">
            Are you sure you want to delete <Box component="span" fontWeight="800">{userName}</Box>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. The user will lose all access immediately.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            Cancel
        </Button>
        <Button 
            onClick={onConfirm} 
            variant="contained" 
            color="error"
            sx={{ fontWeight: 'bold', borderRadius: '8px' }}
        >
            Delete User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;