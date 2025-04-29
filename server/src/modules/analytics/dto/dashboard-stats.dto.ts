// server/src/modules/analytics/dto/dashboard-stats.dto.ts
export class DashboardStatsDto {
  totalLeads: number;
  activePipeline: number;
  conversionRate: number;
  avgDealSize: number;
  leadGrowth: any[];
  statusDistribution: any[];
  recentActivities: any[];
}