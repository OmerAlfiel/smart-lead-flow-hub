// server/src/modules/analytics/analytics.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('lead-summary')
  @ApiOperation({ summary: 'Get lead summary statistics' })
  @ApiResponse({ status: 200, description: 'Return lead summary' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getLeadSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getLeadSummary(startDate, endDate);
  }

  @Get('campaign-performance')
  @ApiOperation({ summary: 'Get campaign performance metrics' })
  @ApiResponse({ status: 200, description: 'Return campaign performance' })
  @ApiQuery({ name: 'campaignId', required: false })
  getCampaignPerformance(@Query('campaignId') campaignId?: string) {
    return this.analyticsService.getCampaignPerformance(campaignId);
  }

  @Get('conversion-rates')
  @ApiOperation({ summary: 'Get conversion rates' })
  @ApiResponse({ status: 200, description: 'Return conversion rates' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getConversionRates(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getConversionRates(startDate, endDate);
  }

  @Get('lead-sources')
  @ApiOperation({ summary: 'Get lead sources distribution' })
  @ApiResponse({ status: 200, description: 'Return lead sources' })
  getLeadSources() {
    return this.analyticsService.getLeadSources();
  }

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Return dashboard statistics' })
  @ApiQuery({ name: 'userId', required: false })
  getDashboardStats(@Query('userId') userId?: string) {
    return this.analyticsService.getDashboardStats(userId);
  }
  
  @Get('conversion-rates-by-source')
  @ApiOperation({ summary: 'Get conversion rates by lead source' })
  @ApiResponse({ status: 200, description: 'Return conversion rates by source' })
  getConversionRatesBySource() {
    return this.analyticsService.getConversionRatesBySource();
  }
  
  @Get('time-to-convert')
  @ApiOperation({ summary: 'Get average time to convert leads by month' })
  @ApiResponse({ status: 200, description: 'Return time to convert data' })
  getTimeToConvert() {
    return this.analyticsService.getTimeToConvert();
  }
  
  @Get('team-performance')
  @ApiOperation({ summary: 'Get performance metrics by team member' })
  @ApiResponse({ status: 200, description: 'Return team performance data' })
  getTeamPerformance() {
    return this.analyticsService.getTeamPerformance();
  }
  
  @Get('conversion-funnel')
  @ApiOperation({ summary: 'Get conversion funnel data' })
  @ApiResponse({ status: 200, description: 'Return conversion funnel data' })
  getConversionFunnel() {
    return this.analyticsService.getConversionFunnel();
  }
  
  @Get('lead-sources-over-time')
  @ApiOperation({ summary: 'Get lead sources distribution over time' })
  @ApiResponse({ status: 200, description: 'Return lead sources over time' })
  getLeadSourcesOverTime() {
    return this.analyticsService.getLeadSourcesOverTime();
  }
  
  @Get('lead-quality-by-source')
  @ApiOperation({ summary: 'Get lead quality scores by source' })
  @ApiResponse({ status: 200, description: 'Return lead quality by source' })
  getLeadQualityBySource() {
    return this.analyticsService.getLeadQualityBySource();
  }
  
  @Get('source-effectiveness')
  @ApiOperation({ summary: 'Get source effectiveness metrics' })
  @ApiResponse({ status: 200, description: 'Return source effectiveness data' })
  getSourceEffectiveness() {
    return this.analyticsService.getSourceEffectiveness();
  }
  
  @Get('response-time')
  @ApiOperation({ summary: 'Get average response time by team member' })
  @ApiResponse({ status: 200, description: 'Return response time data' })
  getResponseTime() {
    return this.analyticsService.getResponseTime();
  }
  
  @Get('deal-size')
  @ApiOperation({ summary: 'Get average deal size by team member' })
  @ApiResponse({ status: 200, description: 'Return deal size data' })
  getDealSize() {
    return this.analyticsService.getDealSize();
  }
  
  @Get('growth-metrics')
  @ApiOperation({ summary: 'Get growth metrics for leads, conversion, pipeline, and deal size' })
  @ApiResponse({ status: 200, description: 'Return growth metrics' })
  getGrowthMetrics() {
    return this.analyticsService.getGrowthMetrics();
  }
  
  @Get('avg-deal-size')
  @ApiOperation({ summary: 'Get average deal size and change percentage' })
  @ApiResponse({ status: 200, description: 'Return average deal size data' })
  getAvgDealSize() {
    return this.analyticsService.getAvgDealSize();
  }
}