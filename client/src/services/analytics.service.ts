// client/src/services/analytics.service.ts
import api from '@/services/api';

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

export interface DashboardStats {
  totalLeads: number;
  activePipeline: number;
  conversionRate: number;
  avgDealSize: number;
  leadGrowth: { name: string; leads: number }[];
  statusDistribution: { name: string; value: number; color: string }[];
  recentActivities: any[];
}

export interface LeadSourceData {
  name: string;
  value: number;
}

export interface ConversionRateBySource {
  name: string;
  rate: number;
}

export interface TimeToConvertData {
  month: string;
  days: number;
}

export interface TeamPerformanceData {
  name: string;
  leads: number;
  won: number;
}

export interface ConversionFunnelData {
  name: string;
  value: number;
}

export interface LeadSourcesOverTimeData {
  name: string;
  [key: string]: any;
}

export interface LeadQualityData {
  name: string;
  score: number;
}

export interface SourceEffectivenessData {
  name: string;
  costPerLead: number;
  roi: number;
}

export interface ResponseTimeData {
  name: string;
  hours: number;
}

export interface DealSizeData {
  name: string;
  value: number;
}

export interface GrowthMetrics {
  leadGrowthRate: number;
  conversionGrowthRate: number;
  pipelineGrowthRate: number;
  dealSizeGrowthRate: number;
}

export interface AvgDealSizeData {
  value: number;
  change: number;
}

const AnalyticsService = {
  getLeadStats: async (): Promise<LeadStats> => {
    const response = await api.get('/analytics/lead-summary');
    return response.data;
  },
  
  getLeadsByPeriod: async (period: 'day' | 'week' | 'month' | 'year'): Promise<ActivityData[]> => {
    const response = await api.get(`/analytics/leads/by-period?period=${period}`);
    return response.data;
  },
  
  getConversionRates: async (): Promise<ConversionData[]> => {
    const response = await api.get('/analytics/conversion-rates');
    return response.data;
  },
  
  getActivityHeatmap: async (): Promise<Record<string, number>> => {
    const response = await api.get('/analytics/activity/heatmap');
    return response.data;
  },
  
  getDashboardStats: async (userId?: string): Promise<DashboardStats> => {
    const response = await api.get('/analytics/dashboard-stats', {
      params: userId ? { userId } : {}
    });
    return response.data;
  },
  
  getLeadSources: async (): Promise<LeadSourceData[]> => {
    const response = await api.get('/analytics/lead-sources');
    return response.data;
  },
  
  getConversionRatesBySource: async (): Promise<ConversionRateBySource[]> => {
    const response = await api.get('/analytics/conversion-rates-by-source');
    return response.data;
  },
  
  getTimeToConvert: async (): Promise<TimeToConvertData[]> => {
    const response = await api.get('/analytics/time-to-convert');
    return response.data;
  },
  
  getTeamPerformance: async (): Promise<TeamPerformanceData[]> => {
    const response = await api.get('/analytics/team-performance');
    return response.data;
  },
  
  getConversionFunnel: async (): Promise<ConversionFunnelData[]> => {
    const response = await api.get('/analytics/conversion-funnel');
    return response.data;
  },
  
  getCampaignPerformance: async (campaignId?: string): Promise<any> => {
    const response = await api.get('/analytics/campaign-performance', {
      params: campaignId ? { campaignId } : {}
    });
    return response.data;
  },
  
  getLeadSourcesOverTime: async (): Promise<LeadSourcesOverTimeData[]> => {
    const response = await api.get('/analytics/lead-sources-over-time');
    return response.data;
  },
  
  getLeadQualityBySource: async (): Promise<LeadQualityData[]> => {
    const response = await api.get('/analytics/lead-quality-by-source');
    return response.data;
  },
  
  getSourceEffectiveness: async (): Promise<SourceEffectivenessData[]> => {
    const response = await api.get('/analytics/source-effectiveness');
    return response.data;
  },
  
  getResponseTime: async (): Promise<ResponseTimeData[]> => {
    const response = await api.get('/analytics/response-time');
    return response.data;
  },
  
  getDealSize: async (): Promise<DealSizeData[]> => {
    const response = await api.get('/analytics/deal-size');
    return response.data;
  },
  
  getGrowthMetrics: async (): Promise<GrowthMetrics> => {
    const response = await api.get('/analytics/growth-metrics');
    return response.data;
  },
  
  getAvgDealSize: async (): Promise<AvgDealSizeData> => {
    const response = await api.get('/analytics/avg-deal-size');
    return response.data;
  }
};

export default AnalyticsService;