// server/src/modules/leads/leads.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadRepository } from './repositories/lead.repository';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    private leadRepository: LeadRepository,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadsRepository.create(createLeadDto);
    return this.leadsRepository.save(lead);
  }

  async findAll(status?: string): Promise<Lead[]> {
    if (status) {
      return this.leadRepository.findByStatus(status);
    }
    return this.leadsRepository.find();
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);
    this.leadsRepository.merge(lead, updateLeadDto);
    return this.leadsRepository.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadsRepository.softRemove(lead);
  }

  async searchLeads(searchTerm: string): Promise<Lead[]> {
    return this.leadRepository.searchLeads(searchTerm);
  }

  async getLeadsByAssignedUser(userId: string): Promise<Lead[]> {
    return this.leadRepository.findByAssignedUser(userId);
  }

  async getLeadsByDateRange(startDate: Date, endDate: Date): Promise<Lead[]> {
    return this.leadRepository.getLeadsByDateRange(startDate, endDate);
  }

  async getLeadCountByStatus(): Promise<any[]> {
    return this.leadRepository.getLeadCountByStatus();
  }

  async getLeadsBySource(): Promise<any[]> {
    return this.leadRepository.getLeadsBySource();
  }
}