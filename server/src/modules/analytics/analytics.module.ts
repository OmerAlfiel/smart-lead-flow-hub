// server/src/modules/analytics/analytics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Lead } from '../leads/entities/lead.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { LeadsModule } from '../leads/leads.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Campaign]),
    LeadsModule,
    CampaignsModule,
    ActivitiesModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}