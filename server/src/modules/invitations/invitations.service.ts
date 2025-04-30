// server/src/modules/invitations/invitations.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Invitation } from './entities/invitation.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { v4 as uuidv4 } from 'uuid';
import { InvitationRepository } from './repositories/invitation.repository';

@Injectable()
export class InvitationsService {
  constructor(
    private invitationRepository: InvitationRepository
  ) {}

  async create(createInvitationDto: CreateInvitationDto): Promise<Invitation> {
    // Check if there's already an active invitation for this email
    const existingInvitations = await this.invitationRepository.findByEmail(createInvitationDto.email);

    // If there are existing invitations, delete them
    if (existingInvitations.length > 0) {
      await this.invitationRepository.remove(existingInvitations);
    }

    return this.invitationRepository.create(createInvitationDto);
  }

  async findAll(): Promise<Invitation[]> {
    return this.invitationRepository.findAll();
  }

  async findOne(id: string): Promise<Invitation> {
    const invitation = await this.invitationRepository.findOne(id);
    if (!invitation) {
      throw new NotFoundException(`Invitation with ID ${id} not found`);
    }
    return invitation;
  }

  async findByToken(token: string): Promise<Invitation> {
    const invitation = await this.invitationRepository.findByToken(token);
    
    if (!invitation) {
      throw new NotFoundException('Invalid or expired invitation token');
    }
    
    // Check if invitation has been used
    if (invitation.used) {
      throw new NotFoundException('Invitation has already been used');
    }
    
    // Check if invitation has expired
    const now = new Date();
    if (invitation.expiresAt < now) {
      throw new NotFoundException('Invitation has expired');
    }
    
    return invitation;
  }

  async resend(id: string): Promise<Invitation> {
    const invitation = await this.findOne(id);
    
    // Generate new token and reset expiration
    invitation.token = uuidv4();
    invitation.expiresAt = new Date();
    invitation.expiresAt.setDate(invitation.expiresAt.getDate() + 7);
    
    return this.invitationRepository.save(invitation);
  }

  async remove(id: string): Promise<void> {
    const invitation = await this.findOne(id);
    await this.invitationRepository.remove(invitation);
  }

  async markAsUsed(token: string): Promise<Invitation> {
    const invitation = await this.findByToken(token);
    invitation.used = true;
    return this.invitationRepository.save(invitation);
  }
}