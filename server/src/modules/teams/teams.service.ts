// server/src/modules/teams/teams.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMember, TeamMemberRole } from './entities/team-member.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamRepository } from './repositories/team.repository';
import { TeamMemberRepository } from './repositories/team-member.repository';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMembersRepository: Repository<TeamMember>,
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamsRepository.create({
      name: createTeamDto.name,
      description: createTeamDto.description,
      ownerId: createTeamDto.ownerId,
    });
    
    return this.teamsRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      relations: ['owner'],
    });
  }

  async findByUser(userId: string): Promise<Team[]> {
    return this.teamRepository.findByUser(userId);
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findWithMembers(id);
    
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, userId: string): Promise<Team> {
    const team = await this.findOne(id);
    
    // Check if user is the owner or admin
    if (team.ownerId !== userId && !await this.isTeamAdmin(id, userId)) {
      throw new ForbiddenException('You do not have permission to update this team');
    }
    
    if (updateTeamDto.name) {
      team.name = updateTeamDto.name;
    }
    
    if (updateTeamDto.description !== undefined) {
      team.description = updateTeamDto.description;
    }
    
    if (updateTeamDto.ownerId) {
      // Only the current owner can transfer ownership
      if (team.ownerId !== userId) {
        throw new ForbiddenException('Only the team owner can transfer ownership');
      }
      team.ownerId = updateTeamDto.ownerId;
    }
    
    return this.teamsRepository.save(team);
  }

  async remove(id: string, userId: string): Promise<void> {
    const team = await this.findOne(id);
    
    // Only the owner can delete the team
    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only the team owner can delete the team');
    }
    
    await this.teamsRepository.softRemove(team);
  }

  async addMember(teamId: string, addTeamMemberDto: AddTeamMemberDto, userId: string): Promise<TeamMember> {
    const team = await this.findOne(teamId);
    
    // Check if user is the owner or admin
    if (team.ownerId !== userId && !await this.isTeamAdmin(teamId, userId)) {
      throw new ForbiddenException('You do not have permission to add members to this team');
    }
    
    // Check if user is already a member
    const existingMember = await this.teamMemberRepository.findByUserAndTeam(
      addTeamMemberDto.userId,
      teamId
    );
    
    if (existingMember) {
      throw new ConflictException('User is already a member of this team');
    }
    
    const teamMember = this.teamMembersRepository.create({
      teamId,
      userId: addTeamMemberDto.userId,
      role: addTeamMemberDto.role,
    });
    
    return this.teamMembersRepository.save(teamMember);
  }

  async updateMember(
    teamId: string,
    memberId: string,
    updateTeamMemberDto: UpdateTeamMemberDto,
    userId: string
  ): Promise<TeamMember> {
    const team = await this.findOne(teamId);
    
    // Check if user is the owner or admin
    if (team.ownerId !== userId && !await this.isTeamAdmin(teamId, userId)) {
      throw new ForbiddenException('You do not have permission to update members in this team');
    }
    
    const teamMember = await this.teamMembersRepository.findOne({
      where: { id: memberId, teamId },
    });
    
    if (!teamMember) {
      throw new NotFoundException(`Team member with ID ${memberId} not found in team ${teamId}`);
    }
    
    teamMember.role = updateTeamMemberDto.role;
    
    return this.teamMembersRepository.save(teamMember);
  }

  async removeMember(teamId: string, memberId: string, userId: string): Promise<void> {
    const team = await this.findOne(teamId);
    
    // Check if user is the owner or admin
    if (team.ownerId !== userId && !await this.isTeamAdmin(teamId, userId)) {
      throw new ForbiddenException('You do not have permission to remove members from this team');
    }
    
    const teamMember = await this.teamMembersRepository.findOne({
      where: { id: memberId, teamId },
    });
    
    if (!teamMember) {
      throw new NotFoundException(`Team member with ID ${memberId} not found in team ${teamId}`);
    }
    
    // Cannot remove the owner from the team
    if (teamMember.userId === team.ownerId) {
      throw new ForbiddenException('Cannot remove the team owner from the team');
    }
    
    await this.teamMembersRepository.remove(teamMember);
  }

  async getMembers(teamId: string): Promise<TeamMember[]> {
    return this.teamMemberRepository.findByTeam(teamId);
  }

  private async isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
    const teamMember = await this.teamMemberRepository.findByUserAndTeam(userId, teamId);
    return teamMember?.role === TeamMemberRole.ADMIN;
  }
}