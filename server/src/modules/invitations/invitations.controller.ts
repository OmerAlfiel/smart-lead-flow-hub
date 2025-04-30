// server/src/modules/invitations/invitations.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('invitations')
@Controller('invitations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Create a new invitation' })
  @ApiResponse({ status: 201, description: 'The invitation has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have permission for this action.' })
  async create(@Body() createInvitationDto: CreateInvitationDto, @Request() req) {
    // Enhanced security check
    if (!this.canCreateInvitation(req.user, createInvitationDto.role)) {
      throw new ForbiddenException(`You don't have permission to create invitations for role: ${createInvitationDto.role}`);
    }
    
    const invitation = await this.invitationsService.create(createInvitationDto);
    return { token: invitation.token };
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get all active invitations' })
  @ApiResponse({ status: 200, description: 'Return all active invitations.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have permission for this action.' })
  findAll(@Request() req) {
    // If user is a manager, they should only see invitations they created
    // In a real app, you'd track who created each invitation and filter accordingly
    return this.invitationsService.findAll();
  }

  @Post(':id/resend')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Resend an invitation' })
  @ApiResponse({ status: 200, description: 'The invitation has been successfully resent.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have permission for this action.' })
  async resend(@Param('id') id: string, @Request() req) {
    // Get the invitation first to check permissions
    const invitation = await this.invitationsService.findOne(id);
    
    // Check if user has permission to resend this invitation
    if (!this.canManageInvitation(req.user, invitation)) {
      throw new ForbiddenException('You do not have permission to resend this invitation');
    }
    
    const updatedInvitation = await this.invitationsService.resend(id);
    return { token: updatedInvitation.token };
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Delete an invitation' })
  @ApiResponse({ status: 200, description: 'The invitation has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not have permission for this action.' })
  async remove(@Param('id') id: string, @Request() req) {
    // Get the invitation first to check permissions
    const invitation = await this.invitationsService.findOne(id);
    
    // Check if user has permission to delete this invitation
    if (!this.canManageInvitation(req.user, invitation)) {
      throw new ForbiddenException('You do not have permission to delete this invitation');
    }
    
    return this.invitationsService.remove(id);
  }

  // Helper method to check if user can create an invitation for a specific role
  private canCreateInvitation(user: any, roleToCreate: string): boolean {
    // Admins can create any role
    if (user.role === 'admin') return true;
    
    // Managers can only create agent invitations
    if (user.role === 'manager' && roleToCreate === 'agent') return true;
    
    return false;
  }

  // Helper method to check if user can manage (resend/delete) an invitation
  private canManageInvitation(user: any, invitation: any): boolean {
    // Admins can manage any invitation
    if (user.role === 'admin') return true;
    
    // Managers can only manage invitations for agents
    // and ideally only ones they created (would need to track creator)
    if (user.role === 'manager' && invitation.role === 'agent') return true;
    
    return false;
  }
}