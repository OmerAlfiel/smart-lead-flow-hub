// server/src/modules/activities/repositories/activity.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Activity } from '../entities/activity.entity';

@Injectable()
export class ActivityRepository extends Repository<Activity> {
  constructor(private dataSource: DataSource) {
    super(Activity, dataSource.createEntityManager());
  }

  async findRecentActivities(limit: number = 10): Promise<Activity[]> {
    return this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user')
      .orderBy('activity.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findByUser(userId: string, limit: number = 20): Promise<Activity[]> {
    return this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('activity.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findByEntityType(entityType: string, limit: number = 20): Promise<Activity[]> {
    return this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user')
      .where('activity.entityType = :entityType', { entityType })
      .orderBy('activity.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }
}