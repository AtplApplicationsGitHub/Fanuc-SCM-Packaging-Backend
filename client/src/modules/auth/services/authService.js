/*
  client/src/modules/auth/services/authService.js
  Status: LIVE (Connected to Django)
*/
import api from '../../../api/axios';

export const loginUser = async (credentials) => {
  try {
    // We use the 'api' instance which already has the base URL
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
};