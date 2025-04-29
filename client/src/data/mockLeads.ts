
import { Lead, LeadStatus } from '@/types/leads';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create dates
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Generate mock leads
export const generateMockLeads = (count: number = 12): Lead[] => {
  const statusOptions: LeadStatus[] = [
    'new',
    'contacted',
    'qualified',
    'proposal',
    'negotiation',
    'won',
    'lost',
  ];

  const companies = [
    'Acme Inc',
    'Globex Corporation',
    'Soylent Corp',
    'Initech',
    'Umbrella Corporation',
    'Massive Dynamic',
    'Stark Industries',
    'Wayne Enterprises',
    'Cyberdyne Systems',
    'Oscorp Industries',
  ];

  const sources = [
    'Website',
    'LinkedIn',
    'Referral',
    'Cold Call',
    'Trade Show',
    'Email Campaign',
    'Google Ads',
    'Facebook',
    'Twitter',
    'Partner',
  ];

  const mockLeads: Lead[] = [];

  for (let i = 0; i < count; i++) {
    const id = uuidv4();
    const firstName = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Patricia'][Math.floor(Math.random() * 10)];
    const lastName = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'][Math.floor(Math.random() * 10)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const company = companies[Math.floor(Math.random() * companies.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const value = Math.floor(Math.random() * 100000) + 5000;
    const source = sources[Math.floor(Math.random() * sources.length)];
    const daysOffset = Math.floor(Math.random() * 60);
    const createdAt = daysAgo(daysOffset);
    const updatedAt = daysAgo(Math.floor(Math.random() * daysOffset));

    mockLeads.push({
      id,
      name,
      email,
      phone: `+1 ${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000)}`,
      company,
      status,
      value,
      source,
      createdAt,
      updatedAt,
    });
  }

  return mockLeads;
};

// Export a set of mock leads
export const mockLeads = generateMockLeads();

// Calculate lead statistics
export const calculateLeadStats = (leads: Lead[]) => {
  const stats = {
    total: leads.length,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
  };

  leads.forEach((lead) => {
    stats[lead.status] += 1;
  });

  return stats;
};
