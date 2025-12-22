/* client/src/modules/users/pages/UserManagement.jsx */
import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, 
  useTheme, TablePagination, CircularProgress, Snackbar, Alert, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock'; // <--- NEW IMPORT
import { useNavigate } from 'react-router-dom';

// === SERVICES ===
import { getAllUsers, createUser, updateUser, toggleUserStatus, deleteUser } from '../services/userService';

// === COMPONENTS ===
import CreateUserModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const UserManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // === STATE ===
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Feedback (Notifications)
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6); 

  // === 1. FETCH DATA ===
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiData = await getAllUsers();
      
      const uiFriendlyData = apiData.map(user => ({
          ...user,
          role: user.role_name || 'No Role',
          active: user.is_active,
          // SECURITY MAPPING: Convert backend flag to UI property
          is_protected: user.is_superuser 
      }));
      setUsers(uiFriendlyData);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // === 2. ACTIONS ===

  // CREATE
  const handleCreateUser = async (formData) => {
    try {
      await createUser(formData);
      setNotification({ open: true, message: 'User created successfully', type: 'success' });
      setCreateModalOpen(false);
      fetchUsers(); 
    } catch (error) {
      setNotification({ open: true, message: 'Failed to create user', type: 'error' });
    }
  };

  // UPDATE (EDIT)
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (id, formData) => {
    try {
      await updateUser(id, formData);
      setNotification({ open: true, message: 'User updated successfully', type: 'success' });
      setEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      setNotification({ open: true, message: 'Failed to update user', type: 'error' });
    }
  };

  // TOGGLE STATUS
  const handleStatusClick = async (user) => {
    // SECURITY GUARD: Stop execution if user is protected
    if (user.is_protected) {
        setNotification({ open: true, message: 'Root Administrators cannot be deactivated.', type: 'warning' });
        return;
    }

    try {
        // Optimistic Update (Instant Feedback)
        setUsers(prev => prev.map(u => 
            u.id === user.id ? { ...u, active: !u.active } : u
        ));

        await toggleUserStatus(user.id, user.active);
        setNotification({ open: true, message: `User ${user.active ? 'deactivated' : 'activated'}`, type: 'info' });
    } catch (error) {
        // Revert on failure
        fetchUsers();
        setNotification({ open: true, message: 'Failed to update status', type: 'error' });
    }
  };

  // DELETE
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
        await deleteUser(selectedUser.id);
        setNotification({ open: true, message: 'User deleted successfully', type: 'warning' });
        setDeleteModalOpen(false);
        fetchUsers();
    } catch (error) {
        setNotification({ open: true, message: 'Failed to delete user', type: 'error' });
    }
  };

  // === PAGINATION ===
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const visibleRows = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* HEADER */}
      <Paper 
        elevation={0}
        sx={{ 
            p: 2, px: 3, borderRadius: '12px',
            bgcolor: isDark ? '#1E1E1E' : '#000000', color: '#FFFFFF',
            borderLeft: '6px solid #FED100',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: isDark ? '0 6px 0 #333333 !important' : '0 6px 0 #555555 !important', 
            border: isDark ? '1px solid #333' : 'none'
        }}
      >
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#FED100' }}>
                    User Management
                </Typography>
                <Typography variant="body2" sx={{ color: '#FFFFFF !important', fontWeight: 500, display: { xs: 'none', md: 'block' }, fontFamily: 'monospace' }}>
                    // Access Control & Roles
                </Typography>
            </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)} 
          size="small"
          sx={{
            backgroundColor: '#FED100', color: '#000', fontWeight: 700,
            borderRadius: '20px', px: 3, textTransform: 'uppercase',
            '&:hover': { backgroundColor: '#fff' }
          }}
        >
          Create User
        </Button>
      </Paper>

      {/* TABLE */}
      <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {['Name', 'Email / Username', 'Role', 'Status', 'Actions'].map((head) => (
                  <TableCell key={head}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><CircularProgress sx={{ color: '#FED100' }} /></TableCell></TableRow>
              ) : visibleRows.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>No users found.</TableCell></TableRow>
              ) : (
                visibleRows.map((row, index) => (
                    <TableRow key={row.id} sx={{ '&:last-child td': { border: 0 }, bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default' }}>
                    <TableCell><Typography fontWeight="bold">{row.name}</Typography></TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.email}</TableCell>
                    <TableCell>
                        <Chip label={row.role} size="small" sx={{ borderRadius: '4px', fontWeight: 700, bgcolor: row.role === 'SCM Admin' ? 'primary.main' : (isDark ? '#333' : '#e0e0e0'), color: row.role === 'SCM Admin' ? '#000' : 'text.primary' }} />
                    </TableCell>
                    
                    {/* === STATUS COLUMN (LOCKED IF SUPERUSER) === */}
                    <TableCell>
                        <Tooltip title={row.is_protected ? "Root User Locked" : "Click to Toggle Status"}>
                            <Box 
                                onClick={() => !row.is_protected && handleStatusClick(row)}
                                sx={{ 
                                    display: 'flex', alignItems: 'center', gap: 1, 
                                    cursor: row.is_protected ? 'not-allowed' : 'pointer', 
                                    width: 'fit-content',
                                    p: 0.5, borderRadius: 1,
                                    opacity: row.is_protected ? 0.6 : 1, // Dim if locked
                                    '&:hover': { bgcolor: row.is_protected ? 'transparent' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') } 
                                }}
                            >
                                {/* Logic: Show Lock if protected, otherwise show Dot */}
                                {row.is_protected ? (
                                    <LockIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} />
                                ) : (
                                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: row.active ? '#00c853' : 'text.disabled' }} />
                                )}
                                
                                <Typography variant="caption" sx={{ fontWeight: 700, color: row.active ? '#00c853' : 'text.disabled' }}>
                                    {row.active ? 'ACTIVE' : 'INACTIVE'}
                                </Typography>
                            </Box>
                        </Tooltip>
                    </TableCell>

                    {/* === ACTIONS COLUMN (DISABLED IF SUPERUSER) === */}
                    <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                size="small" 
                                onClick={() => handleEditClick(row)}
                                disabled={row.is_protected} // Disable Edit
                                sx={{ opacity: row.is_protected ? 0.3 : 1 }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            
                            <IconButton 
                                size="small" 
                                sx={{ color: '#C32C30', opacity: row.is_protected ? 0.3 : 1 }} 
                                onClick={() => handleDeleteClick(row)}
                                disabled={row.is_protected} // Disable Delete
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]} component="div" count={users.length}
          rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
            bgcolor: 'background.default',
            '.MuiTablePagination-selectLabel': { fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' },
            '.MuiTablePagination-select': { fontWeight: 700, color: 'primary.main' }
          }}
        />
      </Paper>

      {/* MODALS */}
      <CreateUserModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSubmit={handleCreateUser} 
      />
      
      <EditUserModal 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />
      
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name}
      />
      
      {/* === NOTIFICATIONS === */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({ ...notification, open: false })}
        
        // 1. ANCHOR: Top Center
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        
        // 2. STYLES: Force it down and on top
        sx={{ 
            zIndex: 9999,
            // This targets the container div of the Snackbar
            top: '120px !important', 
            left: '50%',
            transform: 'translateX(-50%)'
        }}
      >
        <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.type} 
            variant="filled" // Makes it solid colored (Green/Red/Blue)
            sx={{ 
                width: '100%', 
                minWidth: '350px',
                fontWeight: 'bold', 
                boxShadow: 6,
                fontSize: '1rem',
                alignItems: 'center'
            }}
        >
            {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;