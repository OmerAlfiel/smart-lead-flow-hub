// server/src/modules/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
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
    // Query the database to get lead counts by source
    const results = await this.leadsRepository.createQueryBuilder('lead')
      .select('lead.source as source')
      .addSelect('COUNT(lead.id) as count')
      .groupBy('lead.source')
      .getRawMany();
    
    // If no results, return default sources with zero counts
    if (!results || results.length === 0) {
      return [
        { name: 'Website', value: 0 },
        { name: 'Referral', value: 0 },
        { name: 'Social Media', value: 0 },
        { name: 'Email', value: 0 },
        { name: 'Events', value: 0 },
        { name: 'Other', value: 0 },
      ];
    }
    
    // Transform the results to the expected format
    return results.map(result => ({
      name: result.source || 'Unknown',
      value: parseInt(result.count) || 0
    }));
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

  async getConversionRatesBySource() {
    // Get lead sources
    const sources = await this.getLeadSources();
    
    // Calculate conversion rates for each source
    const results = [];
    
    for (const source of sources) {
      // Find total leads for this source
      const totalLeadsForSource = source.value;
      
      // Find won leads for this source
      const wonLeadsForSource = await this.leadsRepository.count({
        where: {
          source: source.name,
          status: 'won'
        }
      });
      
      // Calculate conversion rate
      const rate = totalLeadsForSource > 0 ? Math.round((wonLeadsForSource / totalLeadsForSource) * 100) : 0;
      
      results.push({
        name: source.name,
        rate
      });
    }
    
    return results;
  }
  
  async getTimeToConvert() {
    // This would normally calculate the average time between lead creation and conversion
    // For now, we'll return sample data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Generate data for the last 7 months
    const results = [];
    
    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      
      // Simulate a gradual improvement in conversion time
      // In a real implementation, this would query the database for actual conversion times
      const days = 45 - (i * 3) + Math.floor(Math.random() * 5);
      
      results.push({
        month: monthNames[monthIndex],
        days
      });
    }
    
    return results;
  }
  
  async getTeamPerformance() {
    // Query the database to get lead counts by user (assigned to)
    const userLeads = await this.leadsRepository.createQueryBuilder('lead')
      .leftJoin('lead.assignedTo', 'user')
      .select('user.firstName as firstName, user.lastName as lastName')
      .addSelect('COUNT(lead.id) as totalLeads')
      .groupBy('user.firstName, user.lastName')
      .getRawMany();
    
    // Query the database to get won lead counts by user
    const userWonLeads = await this.leadsRepository.createQueryBuilder('lead')
      .leftJoin('lead.assignedTo', 'user')
      .select('user.firstName as firstName, user.lastName as lastName')
      .addSelect('COUNT(lead.id) as wonLeads')
      .where('lead.status = :status', { status: 'won' })
      .groupBy('user.firstName, user.lastName')
      .getRawMany();
    
    // Combine the results
    const teamPerformance = userLeads.map(userLead => {
      const fullName = `${userLead.firstName || ''} ${userLead.lastName || ''}`.trim();
      const name = fullName || 'Unassigned';
      const leads = parseInt(userLead.totalLeads) || 0;
      
      // Find matching won leads
      const wonData = userWonLeads.find(
        wonLead => 
          wonLead.firstName === userLead.firstName && 
          wonLead.lastName === userLead.lastName
      );
      
      const won = wonData ? parseInt(wonData.wonLeads) || 0 : 0;
      
      return { name, leads, won };
    });
    
    // If no results, return default team performance
    if (!teamPerformance || teamPerformance.length === 0) {
      return [
        { name: 'Alice', leads: 0, won: 0 },
        { name: 'Bob', leads: 0, won: 0 },
        { name: 'Charlie', leads: 0, won: 0 },
        { name: 'Diana', leads: 0, won: 0 },
      ];
    }
    
    return teamPerformance;
  }
  
  async getConversionFunnel() {
    // Get counts for each stage
    const newLeads = await this.leadsRepository.count({
      where: { status: 'new' }
    });
    
    const contactedLeads = await this.leadsRepository.count({
      where: { status: 'contacted' }
    });
    
    const qualifiedLeads = await this.leadsRepository.count({
      where: { status: 'qualified' }
    });
    
    const proposalLeads = await this.leadsRepository.count({
      where: { status: 'proposal' }
    });
    
    const negotiationLeads = await this.leadsRepository.count({
      where: { status: 'negotiation' }
    });
    
    const wonLeads = await this.leadsRepository.count({
      where: { status: 'won' }
    });
    
    const lostLeads = await this.leadsRepository.count({
      where: { status: 'lost' }
    });
    
    // Calculate total leads at each stage for the funnel
    const totalLeads = newLeads + contactedLeads + qualifiedLeads + proposalLeads + negotiationLeads + wonLeads + lostLeads;
    
    // For a proper funnel, we want to show how many leads made it to each stage
    // This is different from the current implementation which shows cumulative counts
    return [
      { name: 'All Leads', value: totalLeads },
      { name: 'Contacted', value: contactedLeads + qualifiedLeads + proposalLeads + negotiationLeads + wonLeads + lostLeads },
      { name: 'Qualified', value: qualifiedLeads + proposalLeads + negotiationLeads + wonLeads + lostLeads },
      { name: 'Proposal', value: proposalLeads + negotiationLeads + wonLeads + lostLeads },
      { name: 'Negotiation', value: negotiationLeads + wonLeads + lostLeads },
      { name: 'Won', value: wonLeads }
    ];
  }

  async getLeadSourcesOverTime() {
    try {
      // Get all lead sources
      const sources = await this.getLeadSources();
      const sourceNames = sources.map(source => source.name);
      
      // Generate data for the last 6 months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Create month range for the last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
        months.push({
          name: monthNames[monthIndex],
          month: monthIndex,
          year: year
        });
      }
      
      // Initialize result array with month names
      const results = months.map(month => ({ name: month.name }));
      
      // For each source, get the lead count per month
      for (const sourceName of sourceNames) {
        // Convert source name to a valid property name (lowercase, no spaces)
        const sourceKey = sourceName.toLowerCase().replace(/\s+/g, '_');
        
        // Get leads for this source
        const sourceLeads = await this.leadsRepository.find({
          where: { source: sourceName },
          select: ['createdAt']
        });
        
        // Group leads by month
        const leadsByMonth = {};
        months.forEach(month => {
          const monthKey = `${month.year}-${month.month}`;
          leadsByMonth[monthKey] = 0;
        });
        
        // Count leads for each month
        sourceLeads.forEach(lead => {
          const leadDate = new Date(lead.createdAt);
          const monthKey = `${leadDate.getFullYear()}-${leadDate.getMonth()}`;
          
          if (leadsByMonth[monthKey] !== undefined) {
            leadsByMonth[monthKey]++;
          }
        });
        
        // Add source data to results
        results.forEach((result, index) => {
          const month = months[index];
          const monthKey = `${month.year}-${month.month}`;
          result[sourceKey] = leadsByMonth[monthKey] || 0;
        });
      }
      
      return results;
    } catch (error) {
      console.error('Error getting lead sources over time:', error);
      return [];
    }
  }
  
  async getLeadQualityBySource() {
    // In a real implementation, this would calculate lead quality scores from actual data
    // For now, we'll return sample data based on the actual sources we have
    const sources = await this.getLeadSources();
    
    return sources.map(source => {
      // Generate a quality score between 50 and 90
      const score = 50 + Math.floor(Math.random() * 40);
      
      return {
        name: source.name,
        score
      };
    });
  }
  
  async getSourceEffectiveness() {
    // In a real implementation, this would calculate effectiveness metrics from actual data
    // For now, we'll return sample data based on the actual sources we have
    const sources = await this.getLeadSources();
    const conversionRates = await this.getConversionRatesBySource();
    
    return sources.map(source => {
      const conversionRate = conversionRates.find(cr => cr.name === source.name)?.rate || 0;
      
      // Calculate cost per lead (fictional data)
      const costPerLead = 50 + Math.floor(Math.random() * 150);
      
      // Calculate ROI based on conversion rate and cost
      const roi = conversionRate > 0 ? (conversionRate / 100) * 1000 / costPerLead : 0;
      
      return {
        name: source.name,
        costPerLead,
        roi: Math.round(roi * 100) / 100
      };
    });
  }

  async getResponseTime() {
    // Query the database to get response time data
    // This would typically calculate the time between lead creation and first contact
    try {
      // Get all users who have been assigned leads
      const users = await this.leadsRepository.createQueryBuilder('lead')
        .leftJoin('lead.assignedTo', 'user')
        .select('DISTINCT user.firstName as firstName, user.lastName as lastName')
        .where('user.firstName IS NOT NULL')
        .getRawMany();
      
      // If no users found, return default data
      if (!users || users.length === 0) {
        return [
          { name: 'Alice', hours: 1.5 },
          { name: 'Bob', hours: 3.2 },
          { name: 'Charlie', hours: 2.1 },
          { name: 'Diana', hours: 1.8 }
        ];
      }
      
      // For each user, calculate their average response time
      const responseTimeData = users.map(user => {
        const name = `${user.firstName} ${user.lastName}`;
        // Generate a realistic response time between 1 and 5 hours
        // In a real implementation, this would calculate from actual timestamps
        const hours = 1 + Math.random() * 4;
        
        return {
          name,
          hours: Math.round(hours * 10) / 10 // Round to 1 decimal place
        };
      });
      
      return responseTimeData;
    } catch (error) {
      console.error('Error getting response time data:', error);
      return [];
    }
  }
  
  async getDealSize() {
    // Query the database to get deal size data by user
    try {
      // Get all users who have won deals
      const users = await this.leadsRepository.createQueryBuilder('lead')
        .leftJoin('lead.assignedTo', 'user')
        .select('DISTINCT user.firstName as firstName, user.lastName as lastName')
        .where('user.firstName IS NOT NULL')
        .andWhere('lead.status = :status', { status: 'won' })
        .getRawMany();
      
      // If no users found, return default data
      if (!users || users.length === 0) {
        return [
          { name: 'Alice', value: 12500 },
          { name: 'Bob', value: 9800 },
          { name: 'Charlie', value: 15200 },
          { name: 'Diana', value: 11000 }
        ];
      }
      
      // For each user, calculate their average deal size
      const dealSizeData = users.map(user => {
        const name = `${user.firstName} ${user.lastName}`;
        // Generate a realistic deal size between 8000 and 16000
        // In a real implementation, this would calculate from actual deal values
        const value = 8000 + Math.random() * 8000;
        
        return {
          name,
          value: Math.round(value / 100) * 100 // Round to nearest 100
        };
      });
      
      return dealSizeData;
    } catch (error) {
      console.error('Error getting deal size data:', error);
      return [];
    }
  }

  async getGrowthMetrics() {
    try {
      // Calculate growth metrics by comparing current period with previous period
      const currentDate = new Date();
      const previousMonthEnd = new Date(currentDate);
      previousMonthEnd.setDate(0); // Last day of previous month
      
      const twoMonthsAgoEnd = new Date(previousMonthEnd);
      twoMonthsAgoEnd.setDate(0); // Last day of two months ago
      
      // Current month leads
      const currentMonthLeads = await this.leadsRepository.count({
        where: {
          createdAt: MoreThan(previousMonthEnd)
        }
      });
      
      // Previous month leads
      const previousMonthLeads = await this.leadsRepository.count({
        where: {
          createdAt: Between(twoMonthsAgoEnd, previousMonthEnd)
        }
      });
      
      // Current month won leads
      const currentMonthWon = await this.leadsRepository.count({
        where: {
          status: 'won',
          updatedAt: MoreThan(previousMonthEnd)
        }
      });
      
      // Previous month won leads
      const previousMonthWon = await this.leadsRepository.count({
        where: {
          status: 'won',
          updatedAt: Between(twoMonthsAgoEnd, previousMonthEnd)
        }
      });
      
      // Current month active pipeline
      const currentPipeline = await this.leadsRepository.count({
        where: [
          { status: 'contacted', updatedAt: MoreThan(previousMonthEnd) },
          { status: 'qualified', updatedAt: MoreThan(previousMonthEnd) },
          { status: 'proposal', updatedAt: MoreThan(previousMonthEnd) },
          { status: 'negotiation', updatedAt: MoreThan(previousMonthEnd) }
        ]
      });
      
      // Previous month active pipeline
      const previousPipeline = await this.leadsRepository.count({
        where: [
          { status: 'contacted', updatedAt: Between(twoMonthsAgoEnd, previousMonthEnd) },
          { status: 'qualified', updatedAt: Between(twoMonthsAgoEnd, previousMonthEnd) },
          { status: 'proposal', updatedAt: Between(twoMonthsAgoEnd, previousMonthEnd) },
          { status: 'negotiation', updatedAt: Between(twoMonthsAgoEnd, previousMonthEnd) }
        ]
      });
      
      // Calculate growth rates
      const leadGrowthRate = previousMonthLeads > 0 
        ? Math.round(((currentMonthLeads - previousMonthLeads) / previousMonthLeads) * 100) 
        : 0;
      
      const conversionGrowthRate = previousMonthWon > 0 
        ? Math.round(((currentMonthWon - previousMonthWon) / previousMonthWon) * 100) 
        : 0;
      
      const pipelineGrowthRate = previousPipeline > 0 
        ? Math.round(((currentPipeline - previousPipeline) / previousPipeline) * 100) 
        : 0;
      
      // For deal size growth, we'll use a simulated value for now
      // In a real implementation, this would calculate from actual deal values
      const dealSizeGrowthRate = -5; // Example: -5% change
      
      return {
        leadGrowthRate,
        conversionGrowthRate,
        pipelineGrowthRate,
        dealSizeGrowthRate
      };
    } catch (error) {
      console.error('Error calculating growth metrics:', error);
      return {
        leadGrowthRate: 0,
        conversionGrowthRate: 0,
        pipelineGrowthRate: 0,
        dealSizeGrowthRate: 0
      };
    }
  }
  
  async getAvgDealSize() {
    try {
      // In a real implementation, this would calculate from actual deal values in the database
      // For now, we'll use a simulated value
      const wonLeads = await this.leadsRepository.find({
        where: { status: 'won' }
      });
      
      // If we have won leads, calculate an average deal size
      // In a real implementation, each lead would have a value field
      let avgDealSize = 8492; // Default value
      
      // Calculate a realistic change percentage
      const change = -5; // Example: -5% change
      
      return {
        value: avgDealSize,
        change
      };
    } catch (error) {
      console.error('Error calculating average deal size:', error);
      return {
        value: 8492,
        change: 0
      };
    }
  }
}