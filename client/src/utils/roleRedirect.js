/* client/src/utils/roleRedirect.js */
import { ROLES } from '../constants/roles';

export const getHomeRoute = (role) => {
  if (!role) return '/login';

  switch (role) {
    case ROLES.SCM_ADMIN:
      return '/users'; // Admin Home
    
    case ROLES.SALES_ENGINEER:
      return '/booking-request'; // Engineer Home (Module 2)
    
    case ROLES.SALES_MANAGER:
      return '/approvals'; // Manager Home (Module 3)
    
    case ROLES.MANAGEMENT:
      return '/reports'; // Management Home (Module 6)
      
    default:
      return '/rbr-info'; // Fallback for anyone else (Module 5)
  }
};