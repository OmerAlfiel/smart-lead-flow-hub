// server/src/modules/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lead } from '../leads/entities/lead.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    @InjectRepository(Campaign)
    private campaignsRepository: Repository<Campaign>,
    private activitiesService: ActivitiesService,
  ) {}

  async getLeadSummary(startDate?: string, endDate?: string) {
    const query = this.leadsRepository.createQueryBuilder('lead');
    
    if (startDate && endDate) {
      query.where({
        createdAt: Between(new Date(startDate), new Date(endDate)),
      });
    }

    const totalLeads = await query.getCount();
    
    const leadsByStatus = await query
      .select('lead.status, COUNT(lead.id) as count')
      .groupBy('lead.status')
      .getRawMany();

    return {
      totalLeads,
      leadsByStatus,
    };
  }

  async getCampaignPerformance(campaignId?: string) {
    const query = this.campaignsRepository.createQueryBuilder('campaign');
    
    if (campaignId) {
      query.where('campaign.id = :campaignId', { campaignId });
    }

    const campaigns = await query.getMany();
    
    // In a real implementation, you would calculate metrics based on related data
    // This is a simplified example
    return campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      metrics: campaign.metrics || {
        sentEmails: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
      },
    }));
  }

  async getConversionRates(startDate?: string, endDate?: string) {
    // In a real implementation, you would calculate conversion rates
    // based on lead status transitions over time
    // This is a simplified example
    return {
      overall: 0.15, // 15% conversion rate
      byStage: {
        'new-to-contacted': 0.65,
        'contacted-to-qualified': 0.40,
        'qualified-to-proposal': 0.35,
        'proposal-to-negotiation': 0.30,
        'negotiation-to-won': 0.25,
      },
    };
  }

  async getLeadSources() {
    // In a real implementation, you would query the metadata field
    // to extract and aggregate lead sources
    // This is a simplified example
    return [
      { source: 'website', count: 45 },
      { source: 'referral', count: 30 },
      { source: 'social_media', count: 25 },
      { source: 'email', count: 15 },
      { source: 'other', count: 10 },
    ];
  }

  async getLeadGrowthByMonth() {
    // Get the current date and calculate the start date (7 months ago)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    // Format the dates to the first day of each month
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    
    // Create an array of month names for the last 7 months
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      months.push({
        name: monthNames[date.getMonth()],
        year: date.getFullYear(),
        month: date.getMonth(),
      });
    }
    
    // Use a more database-agnostic approach instead of DATE_TRUNC
    // Get all leads within the date range
    const leads = await this.leadsRepository.find({
      where: {
        createdAt: Between(startDate, endDate)
      },
      select: ['createdAt']
    });
    
    // Group leads by month manually
    const leadsByMonth = {};
    
    leads.forEach(lead => {
      const leadDate = new Date(lead.createdAt);
      const monthKey = `${leadDate.getFullYear()}-${leadDate.getMonth()}`;
      
      if (!leadsByMonth[monthKey]) {
        leadsByMonth[monthKey] = 0;
      }
      
      leadsByMonth[monthKey]++;
    });
    
    // Map the results to the expected format
    return months.map(month => {
      const monthKey = `${month.year}-${month.month}`;
      return {
        name: month.name,
        leads: leadsByMonth[monthKey] || 0,
      };
    });
  }

  async getLeadStatusDistribution() {
    const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#D97706', '#10B981', '#EF4444'];
    
    // Get counts for each status
    const results = [];
    
    for (const status of statuses) {
      const count = await this.leadsRepository.count({
        where: { status }
      });
      
      results.push({ status, count });
    }
    
    return statuses.map((status, index) => {
      const result = results.find(r => r.status === status);
      return {
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: result ? result.count : 0,
        color: colors[index],
      };
    });
  }

  async getDashboardStats(userId?: string): Promise<DashboardStatsDto> {
    // Implementation to gather all dashboard statistics
    const totalLeads = await this.leadsRepository.count();
    
    const activePipeline = await this.leadsRepository.count({
      where: [
        { status: 'contacted' },
        { status: 'qualified' },
        { status: 'proposal' },
        { status: 'negotiation' }
      ]
    });
    
    const wonLeads = await this.leadsRepository.count({ where: { status: 'won' } });
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
    
    // Mock average deal size for now
    const avgDealSize = 8492;
    
    // Get lead growth data (monthly)
    const leadGrowth = await this.getLeadGrowthByMonth();
    
    // Get status distribution
    const statusDistribution = await this.getLeadStatusDistribution();
    
    // Get recent activities
    const recentActivities = await this.activitiesService.findRecentActivities(5);
    
    return {
      totalLeads,
      activePipeline,
      conversionRate,
      avgDealSize,
      leadGrowth,
      statusDistribution,
      recentActivities
    };
  }
}