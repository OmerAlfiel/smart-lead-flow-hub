// server/src/modules/invitations/repositories/invitation.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource, MoreThan } from 'typeorm';
import { Invitation } from '../entities/invitation.entity';
import { CreateInvitationDto } from '../dto/create-invitation.dto';

@Injectable()
export class InvitationRepository {
  private repository: Repository<Invitation>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Invitation);
  }

  async create(createInvitationDto: CreateInvitationDto): Promise<Invitation> {
    const invitation = this.repository.create(createInvitationDto);
    return this.repository.save(invitation);
  }

  async findAll(): Promise<Invitation[]> {
    return this.repository.find({
      where: { used: false },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Invitation> {
    return this.repository.findOne({ where: { id } });
  }

  async findByToken(token: string): Promise<Invitation | null> {
    return this.repository.findOne({ where: { token, used: false } });
  }

  async findByEmail(email: string): Promise<Invitation[]> {
    return this.repository.find({ where: { email, used: false } });
  }

  async findActiveInvitations(): Promise<Invitation[]> {
    const now = new Date();
    return this.repository.find({
      where: {
        used: false,
        expiresAt: MoreThan(now)
      }
    });
  }

  async save(invitation: Invitation): Promise<Invitation> {
    return this.repository.save(invitation);
  }

async remove(invitation: Invitation | Invitation[]): Promise<Invitation | Invitation[]> {
  if (Array.isArray(invitation)) {
    // If it's an array, use the array overload
    return this.repository.remove(invitation);
  } else {
    // If it's a single entity, use the single entity overload
    return this.repository.remove(invitation);
  }
}
}