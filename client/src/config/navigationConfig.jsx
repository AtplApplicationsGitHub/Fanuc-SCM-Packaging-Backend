/* client/src/config/navigationConfig.jsx */
import { ROLES } from '../constants/roles';

// Icons
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'; 
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'; 
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; 
import InfoIcon from '@mui/icons-material/Info'; 
import AssessmentIcon from '@mui/icons-material/Assessment'; 
import PeopleIcon from '@mui/icons-material/People'; 
import InventoryIcon from '@mui/icons-material/Inventory';

export const NAVIGATION = [
  // Module 2
  {
    label: 'Robot Booking',
    path: '/booking-request',
    icon: <PrecisionManufacturingIcon />,
    allowedRoles: [ROLES.SALES_ENGINEER, ROLES.SCM_ADMIN],
  },

  // Module 3
  {
    label: 'Approvals',
    path: '/approvals',
    icon: <ThumbUpAltIcon />,
    allowedRoles: [ROLES.SALES_MANAGER],
  },

  // Module 4
  {
    label: 'Allocation',
    path: '/allocation',
    icon: <AssignmentTurnedInIcon />,
    allowedRoles: [ROLES.SCM_ADMIN],
  },

  // Module 5
  {
    label: 'RBR Info',
    path: '/rbr-info',
    icon: <InfoIcon />,
    allowedRoles: [ROLES.SALES_ENGINEER, ROLES.SALES_MANAGER, ROLES.SCM_ADMIN, ROLES.MANAGEMENT],
  },

  // Module 10 (Inventory - Prerequisite for Booking)
  {
    label: 'Inventory',
    path: '/inventory',
    icon: <InventoryIcon />,
    allowedRoles: [ROLES.SCM_ADMIN],
  },

  // Module 6
  {
    label: 'Reports',
    path: '/reports',
    icon: <AssessmentIcon />,
    allowedRoles: [ROLES.SCM_ADMIN, ROLES.MANAGEMENT],
  },

  // Module 8
  {
    label: 'Users',
    path: '/users',
    icon: <PeopleIcon />,
    allowedRoles: [ROLES.SCM_ADMIN],
  },
];