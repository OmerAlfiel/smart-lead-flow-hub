// server/src/modules/audit-logs/repositories/audit-log.repository.ts
import { DataSource, Repository, Between } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuditLog, EntityType, ActionType } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogRepository extends Repository<AuditLog> {
  constructor(private dataSource: DataSource) {
    super(AuditLog, dataSource.createEntityManager());
  }

  async findByEntity(entityType: EntityType, entityId: string): Promise<AuditLog[]> {
    return this.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user')
      .where('auditLog.entityType = :entityType', { entityType })
      .andWhere('auditLog.entityId = :entityId', { entityId })
      .orderBy('auditLog.createdAt', 'DESC')
      .getMany();
  }

  async findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<AuditLog[]> {
    const query = this.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user')
      .where('auditLog.userId = :userId', { userId })
      .orderBy('auditLog.createdAt', 'DESC');

    if (startDate && endDate) {
      query.andWhere('auditLog.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return query.getMany();
  }

  async findByAction(action: ActionType, startDate?: Date, endDate?: Date): Promise<AuditLog[]> {
    const query = this.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user')
      .where('auditLog.action = :action', { action })
      .orderBy('auditLog.createdAt', 'DESC');

    if (startDate && endDate) {
      query.andWhere('auditLog.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return query.getMany();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user')
      .where('auditLog.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('auditLog.createdAt', 'DESC')
      .getMany();
  }
}