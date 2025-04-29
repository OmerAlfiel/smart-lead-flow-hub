// server/src/modules/activities/activities.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityRepository } from './repositories/activity.repository';
import { CreateActivityDto } from './dto/create-activity.dto';


@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
    private activityRepository: ActivityRepository,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = this.activitiesRepository.create({
      ...createActivityDto,
      user: createActivityDto.userId ? { id: createActivityDto.userId } : null,
    });
    
    return this.activitiesRepository.save(activity);
  }

  async findRecentActivities(limit: number = 10): Promise<Activity[]> {
    return this.activityRepository.findRecentActivities(limit);
  }

  async findByUser(userId: string, limit: number = 20): Promise<Activity[]> {
    return this.activityRepository.findByUser(userId, limit);
  }

  async findByEntityType(entityType: string, limit: number = 20): Promise<Activity[]> {
    return this.activityRepository.findByEntityType(entityType, limit);
  }
}