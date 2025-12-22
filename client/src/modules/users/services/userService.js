/*
  client/src/modules/users/services/userService.js
*/
import api from '../../../api/axios';

const BASE_URL = '/users/';

export const getAllUsers = async () => {
  try {
    const response = await api.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const createUser = async (userData) => {
    try {
      const response = await api.post(BASE_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Failed to create user", error);
      throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
      const response = await api.patch(`${BASE_URL}${id}/`, userData);
      return response.data;
    } catch (error) {
      console.error("Failed to update user", error);
      throw error;
    }
};

export const toggleUserStatus = async (id, currentStatus) => {
  try {
    const response = await api.patch(`${BASE_URL}${id}/`, {
      is_active: !currentStatus
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user status", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}${id}/`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete user", error);
      throw error;
    }
};