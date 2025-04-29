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
    // Create a clean object with only the properties that match the Lead entity
    const leadData: Partial<Lead> = {
      firstName: createLeadDto.firstName,
      lastName: createLeadDto.lastName,
      email: createLeadDto.email,
      phone: createLeadDto.phone,
      company: createLeadDto.company,
      status: createLeadDto.status,
      score: createLeadDto.score,
      metadata: createLeadDto.metadata,
      // Map notes string to notesText
      notesText: createLeadDto.notes,
    };
    
    // If assignedToId is provided, set it up properly
    if (createLeadDto.assignedToId) {
      leadData.assignedTo = { id: createLeadDto.assignedToId } as any;
    }
    
    const lead = this.leadsRepository.create(leadData);
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
    
    // Create a clean update object
    const updateData: Partial<Lead> = {};
    
    // Map standard fields
    if (updateLeadDto.firstName !== undefined) updateData.firstName = updateLeadDto.firstName;
    if (updateLeadDto.lastName !== undefined) updateData.lastName = updateLeadDto.lastName;
    if (updateLeadDto.email !== undefined) updateData.email = updateLeadDto.email;
    if (updateLeadDto.phone !== undefined) updateData.phone = updateLeadDto.phone;
    if (updateLeadDto.company !== undefined) updateData.company = updateLeadDto.company;
    if (updateLeadDto.status !== undefined) updateData.status = updateLeadDto.status;
    if (updateLeadDto.score !== undefined) updateData.score = updateLeadDto.score;
    if (updateLeadDto.metadata !== undefined) updateData.metadata = updateLeadDto.metadata;
    
    // Map notes to notesText
    if (updateLeadDto.notes !== undefined) {
      updateData.notesText = updateLeadDto.notes;
    }
    
    // Map assignedToId if needed
    if (updateLeadDto.assignedToId !== undefined) {
      updateData.assignedTo = { id: updateLeadDto.assignedToId } as any;
    }
    
    // Update the lead
    Object.assign(lead, updateData);
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