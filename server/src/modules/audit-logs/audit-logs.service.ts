// server/src/modules/audit-logs/audit-logs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, EntityType, ActionType } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
    private auditLogRepository: AuditLogRepository,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create(createAuditLogDto);
    return this.auditLogsRepository.save(auditLog);
  }

  async findAll(query: QueryAuditLogsDto): Promise<AuditLog[]> {
    const { entityType, entityId, action, userId, startDate, endDate } = query;
    
    let startDateTime: Date | undefined;
    let endDateTime: Date | undefined;
    
    if (startDate) {
      startDateTime = new Date(startDate);
    }
    
    if (endDate) {
      endDateTime = new Date(endDate);
    }
    
    if (entityType && entityId) {
      return this.auditLogRepository.findByEntity(entityType as EntityType, entityId);
    }
    
    if (userId) {
      return this.auditLogRepository.findByUser(userId, startDateTime, endDateTime);
    }
    
    if (action) {
      return this.auditLogRepository.findByAction(action as ActionType, startDateTime, endDateTime);
    }
    
    if (startDateTime && endDateTime) {
      return this.auditLogRepository.findByDateRange(startDateTime, endDateTime);
    }
    
    return this.auditLogsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findOne(id: string): Promise<AuditLog> {
    return this.auditLogsRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });
  }

  async findByEntity(entityType: EntityType, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByEntity(entityType, entityId);
  }

  async findByUser(userId: string, startDate?: Date, endDate?: Date): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUser(userId, startDate, endDate);
  }

  async findByAction(action: ActionType, startDate?: Date, endDate?: Date): Promise<AuditLog[]> {
    return this.auditLogRepository.findByAction(action, startDate, endDate);
  }
}