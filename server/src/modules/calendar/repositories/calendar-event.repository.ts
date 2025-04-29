// server/src/modules/calendar/repositories/calendar-event.repository.ts
import { DataSource, Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CalendarEvent } from '../entities/calendar-event.entity';

@Injectable()
export class CalendarEventRepository extends Repository<CalendarEvent> {
  constructor(private dataSource: DataSource) {
    super(CalendarEvent, dataSource.createEntityManager());
  }

  async findByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<CalendarEvent[]> {
    const query = this.createQueryBuilder('event')
      .where(
        '(event.startTime BETWEEN :startDate AND :endDate) OR ' +
        '(event.endTime BETWEEN :startDate AND :endDate) OR ' +
        '(event.startTime <= :startDate AND event.endTime >= :endDate)',
        { startDate, endDate }
      )
      .andWhere('event.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('event.createdBy', 'user')
      .leftJoinAndSelect('event.lead', 'lead')
      .orderBy('event.startTime', 'ASC');

    if (userId) {
      query.andWhere('event.createdById = :userId', { userId });
    }

    return query.getMany();
  }

  async findByUser(userId: string): Promise<CalendarEvent[]> {
    return this.createQueryBuilder('event')
      .where('event.createdById = :userId', { userId })
      .andWhere('event.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('event.lead', 'lead')
      .orderBy('event.startTime', 'ASC')
      .getMany();
  }

  async findByLead(leadId: string): Promise<CalendarEvent[]> {
    return this.createQueryBuilder('event')
      .where('event.leadId = :leadId', { leadId })
      .andWhere('event.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('event.createdBy', 'user')
      .orderBy('event.startTime', 'ASC')
      .getMany();
  }

  async findUpcomingEvents(userId: string, limit: number = 5): Promise<CalendarEvent[]> {
    const now = new Date();
    
    return this.createQueryBuilder('event')
      .where('event.createdById = :userId', { userId })
      .andWhere('event.startTime >= :now', { now })
      .andWhere('event.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('event.lead', 'lead')
      .orderBy('event.startTime', 'ASC')
      .limit(limit)
      .getMany();
  }

  async findByExternalId(externalId: string, source: string): Promise<CalendarEvent | null> {
    return this.createQueryBuilder('event')
      .where('event.externalEventId = :externalId', { externalId })
      .andWhere('event.source = :source', { source })
      .getOne();
  }
}