// server/src/modules/leads/leads.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadRepository } from './repositories/lead.repository';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    private leadRepository: LeadRepository,
    private usersService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private notesService: NotesService,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<any> {
    // Create a clean object with only the properties that match the Lead entity
    const leadData: Partial<Lead> = {
      firstName: createLeadDto.firstName,
      lastName: createLeadDto.lastName,
      email: createLeadDto.email,
      phone: createLeadDto.phone,
      company: createLeadDto.company,
      status: createLeadDto.status,
      score: createLeadDto.score,
      value: createLeadDto.value,
      source: createLeadDto.source,
      metadata: createLeadDto.metadata,
      // Map notes string to notesText
      notesText: createLeadDto.notes,
    };
    
    // If assignedToId is provided, validate it exists first
    if (createLeadDto.assignedToId) {
      try {
        await this.usersService.findOne(createLeadDto.assignedToId);
        leadData.assignedToId = createLeadDto.assignedToId;
      } catch (error) {
        throw new BadRequestException(`User with ID ${createLeadDto.assignedToId} not found`);
      }
    }
    
    const lead = this.leadsRepository.create(leadData);
    const savedLead = await this.leadsRepository.save(lead);
    
    // If notes were provided, create a note entry
    if (createLeadDto.notes && createLeadDto.assignedToId) {
      await this.addNoteToLead({
        leadId: savedLead.id,
        content: createLeadDto.notes,
        createdById: createLeadDto.assignedToId
      });
    }
    
    return this.transformLeadForClient(savedLead);
  }

  async findAll(status?: string): Promise<any[]> {
    let leads: Lead[];
    
    if (status) {
      leads = await this.leadRepository.findByStatus(status);
    } else {
      leads = await this.leadsRepository.find();
    }
    
    // Transform leads to match client expectations
    return leads.map(lead => this.transformLeadForClient(lead));
  }

  async findOne(id: string): Promise<any> {
    const lead = await this.leadsRepository.findOne({ 
      where: { id },
      relations: ['assignedTo']
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return this.transformLeadForClient(lead);
  }

  async findOneWithNotes(id: string): Promise<any> {
    const lead = await this.leadsRepository.findOne({ 
      where: { id },
      relations: ['notes', 'notes.createdBy']
    });
    
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    
    return this.transformLeadForClient(lead);
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<any> {
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
    if (updateLeadDto.value !== undefined) updateData.value = updateLeadDto.value;
    if (updateLeadDto.source !== undefined) updateData.source = updateLeadDto.source;
    if (updateLeadDto.metadata !== undefined) updateData.metadata = updateLeadDto.metadata;
    
    // Map notes to notesText
    if (updateLeadDto.notes !== undefined) {
      updateData.notesText = updateLeadDto.notes;
      
      // If notes were updated and we have a userId, create a new note entry
      if (updateLeadDto.notes && updateLeadDto.assignedToId) {
        await this.addNoteToLead({
          leadId: id,
          content: updateLeadDto.notes,
          createdById: updateLeadDto.assignedToId
        });
      }
    }
    
    // Map assignedToId directly if needed
    if (updateLeadDto.assignedToId !== undefined) {
      try {
        // Try to find the user directly with the repository
        const user = await this.usersRepository.findOne({ 
          where: { id: updateLeadDto.assignedToId } 
        });
        
        if (user) {
          // User found directly in repository
          updateData.assignedToId = updateLeadDto.assignedToId;
        } else {
          // If not found with direct repository, try the service method as fallback
          try {
            const userFromService = await this.usersService.findOne(updateLeadDto.assignedToId);
            if (userFromService) {
              updateData.assignedToId = updateLeadDto.assignedToId;
            }
          } catch (serviceError) {
            console.error(`User with ID ${updateLeadDto.assignedToId} not found in database:`, serviceError);
            throw new BadRequestException(`User with ID ${updateLeadDto.assignedToId} not found. Please verify the user ID is correct.`);
          }
        }
      } catch (error) {
        console.error(`Error validating user with ID ${updateLeadDto.assignedToId}:`, error);
        throw new BadRequestException(`User with ID ${updateLeadDto.assignedToId} not found or cannot be accessed. Please verify the user exists.`);
      }
    }
    
    // Update the lead
    Object.assign(lead, updateData);
    const updatedLead = await this.leadsRepository.save(lead);
    return this.transformLeadForClient(updatedLead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadsRepository.softRemove(lead);
  }

  async searchLeads(searchTerm: string): Promise<any[]> {
    const leads = await this.leadRepository.searchLeads(searchTerm);
    return leads.map(lead => this.transformLeadForClient(lead));
  }

  async getLeadsByAssignedUser(userId: string): Promise<any[]> {
    try {
      await this.usersService.findOne(userId);
    } catch (error) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
    const leads = await this.leadRepository.findByAssignedUser(userId);
    return leads.map(lead => this.transformLeadForClient(lead));
  }

  async getLeadsByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    const leads = await this.leadRepository.getLeadsByDateRange(startDate, endDate);
    return leads.map(lead => this.transformLeadForClient(lead));
  }

  async getLeadCountByStatus(): Promise<any[]> {
    return this.leadRepository.getLeadCountByStatus();
  }

  async getLeadsBySource(): Promise<any[]> {
    return this.leadRepository.getLeadsBySource();
  }

  async getLeadStatsByStatus(): Promise<any> {
    // Get raw counts by status from repository
    const statusCounts = await this.leadRepository.getLeadCountByStatus();
    
    // Initialize the stats object with all statuses set to 0
    const stats = {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      won: 0,
      lost: 0
    };
    
    // Calculate total and populate counts for each status
    statusCounts.forEach(item => {
      const count = parseInt(item.count, 10);
      stats[item.status] = count;
      stats.total += count;
    });
    
    return stats;
  }

  async getLeadNotes(id: string): Promise<any[]> {
    const lead = await this.findOne(id);
    return this.leadsRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.notes', 'note')
      .leftJoinAndSelect('note.createdBy', 'user')
      .where('lead.id = :id', { id })
      .select(['note', 'user.id', 'user.firstName', 'user.lastName', 'user.email'])
      .getOne()
      .then(result => result?.notes || []);
  }

  async addNoteToLead(createNoteDto: any): Promise<any> {
    // This would typically call the NotesService to create a note
    // For now, we'll just return a mock implementation
    return { id: 'mock-note-id', ...createNoteDto, createdAt: new Date().toISOString() };
  }

  async removeNoteFromLead(noteId: string): Promise<void> {
    // This would typically call the NotesService to remove a note
    // For now, we'll just return a mock implementation
    return;
  }

  // Helper method to transform server Lead entity to client-compatible format
  private transformLeadForClient(lead: Lead): any {
    if (!lead) return null;
    
    // Create a copy of the lead object to avoid modifying the original
    const { firstName, lastName, assignedTo, notes, ...rest } = lead;
    
    // Build the transformed lead object
    const transformedLead = {
      ...rest,
      name: `${firstName} ${lastName}`.trim(),
    };
    
    // Handle assignedTo if it exists
    if (assignedTo) {
      transformedLead['assignedTo'] = {
        id: assignedTo.id,
        name: `${assignedTo.firstName} ${assignedTo.lastName}`.trim(),
        email: assignedTo.email
      };
    }
    
    // Handle notes if they exist
    if (notes && notes.length > 0) {
      transformedLead['notes'] = notes.map(note => {
        const { createdBy, ...noteRest } = note;
        return {
          ...noteRest,
          createdBy: createdBy ? {
            id: createdBy.id,
            name: `${createdBy.firstName} ${createdBy.lastName}`.trim(),
            email: createdBy.email
          } : null
        };
      });
    }
    
    return transformedLead;
  }
}