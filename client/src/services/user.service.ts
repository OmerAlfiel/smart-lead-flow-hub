import api from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  
  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },
  
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  }
};

export default UserService;