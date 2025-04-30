// client/src/services/leads.service.ts
import api from './api';
import { Lead } from '@/types/leads';

export interface CreateLeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  value?: number;
  source?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  id: string;
}

const LeadsService = {
  getAllLeads: async (): Promise<Lead[]> => {
    const response = await api.get('/leads');
    return response.data;
  },
  
  getLeadById: async (id: string): Promise<Lead> => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },
  
  createLead: async (data: CreateLeadData): Promise<Lead> => {
    const response = await api.post('/leads', data);
    return response.data;
  },
  
  updateLead: async (data: UpdateLeadData): Promise<Lead> => {
    const { id, ...updateData } = data;
    const response = await api.patch(`/leads/${id}`, updateData);
    return response.data;
  },
  
  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  }
};

export default LeadsService;