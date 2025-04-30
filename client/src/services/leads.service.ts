// client/src/services/leads.service.ts

import api from '@/services/api';
import { Lead, Note } from '@/types/leads';

export interface CreateLeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  value?: number;
  source?: string;
  notes?: string;
}

export interface UpdateLeadData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  value?: number;
  source?: string;
  notes?: string | Note[];
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
    
    // Ensure we're sending the right data format
    const cleanedData = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email,
      phone: updateData.phone,
      company: updateData.company,
      status: updateData.status,
      value: updateData.value,
      source: updateData.source,
      // Server expects notes as a string
      notes: typeof updateData.notes === 'string' ? updateData.notes : undefined
    };
    
    // Only include defined fields
    const finalData = Object.fromEntries(
      Object.entries(cleanedData).filter(([_, value]) => value !== undefined)
    );
    
    console.log('Sending to server:', finalData);
    const response = await api.patch(`/leads/${id}`, finalData);
    return response.data;
  },
  
  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  }
};

export default LeadsService;