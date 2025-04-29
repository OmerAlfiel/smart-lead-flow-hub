
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  value?: number;
  source?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  notes?: Note[];
}

export interface Note {
  id: string;
  leadId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  negotiation: number;
  won: number;
  lost: number;
}
