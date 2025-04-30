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
import { CreateNoteDto } from '../notes/dto/create-note.dto';
import { Note } from '../notes/entities/note.entity';

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
    
    return savedLead;
  }

  async findAll(status?: string): Promise<Lead[]> {
    if (status) {
      return this.leadRepository.findByStatus(status);
    }
    return this.leadsRepository.find();
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({ 
      where: { id },
      relations: ['assignedTo']
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async findOneWithNotes(id: string): Promise<Lead & { notes: Note[] }> {
    const lead = await this.findOne(id);
    const notes = await this.notesService.findByLead(id);
    return { ...lead, notes };
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
    try {
      await this.usersService.findOne(userId);
    } catch (error) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
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

  // New methods for notes integration
  async getLeadNotes(leadId: string): Promise<Note[]> {
    await this.findOne(leadId); // Validate lead exists
    return this.notesService.findByLead(leadId);
  }

  async addNoteToLead(createNoteDto: CreateNoteDto): Promise<Note> {
    await this.findOne(createNoteDto.leadId); // Validate lead exists
    return this.notesService.create(createNoteDto);
  }

  async removeNoteFromLead(noteId: string): Promise<void> {
    return this.notesService.remove(noteId);
  }
}