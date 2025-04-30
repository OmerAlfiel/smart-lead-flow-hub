// client/src/services/analytics.service.ts
import api from './api';

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  totalValue: number;
}

export interface ActivityData {
  date: string;
  count: number;
}

export interface ConversionData {
  stage: string;
  count: number;
  rate: number;
}

const AnalyticsService = {
  getLeadStats: async (): Promise<LeadStats> => {
    const response = await api.get('/analytics/leads/stats');
    return response.data;
  },
  
  getLeadsByPeriod: async (period: 'day' | 'week' | 'month' | 'year'): Promise<ActivityData[]> => {
    const response = await api.get(`/analytics/leads/by-period?period=${period}`);
    return response.data;
  },
  
  getConversionRates: async (): Promise<ConversionData[]> => {
    const response = await api.get('/analytics/leads/conversion-rates');
    return response.data;
  },
  
  getActivityHeatmap: async (): Promise<Record<string, number>> => {
    const response = await api.get('/analytics/activity/heatmap');
    return response.data;
  }
};

export default AnalyticsService;