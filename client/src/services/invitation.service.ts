import api from './api';

export interface CreateInvitationData {
  email: string;
  role: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  used: boolean;
  expiresAt: string;
  createdAt: string;
}

const InvitationService = {
  createInvitation: async (data: CreateInvitationData): Promise<{ token: string }> => {
    const response = await api.post('/invitations', data);
    return response.data;
  },
  
  getInvitations: async (): Promise<Invitation[]> => {
    const response = await api.get('/invitations');
    return response.data;
  },
  
  deleteInvitation: async (id: string): Promise<void> => {
    await api.delete(`/invitations/${id}`);
  },
  
  resendInvitation: async (id: string): Promise<{ token: string }> => {
    const response = await api.post(`/invitations/${id}/resend`);
    return response.data;
  }
};

export default InvitationService;