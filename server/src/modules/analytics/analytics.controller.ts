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
}