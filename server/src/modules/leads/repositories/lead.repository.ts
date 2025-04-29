// server/src/modules/leads/repositories/lead.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Lead } from '../entities/lead.entity';

@Injectable()
export class LeadRepository extends Repository<Lead> {
  constructor(dataSource: DataSource) {
    super(Lead, dataSource.createEntityManager());
  }

  async findByStatus(status: string): Promise<Lead[]> {
    return this.find({ where: { status } });
  }

  async findByAssignedUser(userId: string): Promise<Lead[]> {
    return this.createQueryBuilder('lead')
      .leftJoinAndSelect('lead.assignedTo', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async searchLeads(searchTerm: string): Promise<Lead[]> {
    return this.createQueryBuilder('lead')
      .where('lead.firstName LIKE :term', { term: `%${searchTerm}%` })
      .orWhere('lead.lastName LIKE :term', { term: `%${searchTerm}%` })
      .orWhere('lead.email LIKE :term', { term: `%${searchTerm}%` })
      .orWhere('lead.company LIKE :term', { term: `%${searchTerm}%` })
      .getMany();
  }

  async getLeadsByDateRange(startDate: Date, endDate: Date): Promise<Lead[]> {
    return this.createQueryBuilder('lead')
      .where('lead.createdAt BETWEEN :startDate AND :endDate', { 
        startDate, 
        endDate 
      })
      .getMany();
  }

  async getLeadCountByStatus(): Promise<any[]> {
    return this.createQueryBuilder('lead')
      .select('lead.status, COUNT(lead.id) as count')
      .groupBy('lead.status')
      .getRawMany();
  }

  async getLeadsBySource(): Promise<any[]> {
    return this.createQueryBuilder('lead')
      .select("lead.metadata->>'source' as source, COUNT(lead.id) as count")
      .groupBy("lead.metadata->>'source'")
      .getRawMany();
  }
}