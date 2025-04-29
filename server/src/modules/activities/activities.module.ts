// server/src/modules/activities/activities.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';

import { Activity } from './entities/activity.entity';
import { ActivityRepository } from './repositories/activity.repository';
import { ActivitiesController } from './activities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivityRepository],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}