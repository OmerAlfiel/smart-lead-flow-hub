// server/src/modules/invitations/invitations.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
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
  async create(@Body() createInvitationDto: CreateInvitationDto, @Request() req) {
    // If user is a manager, they can only create agent invitations
    if (req.user.role === 'manager' && createInvitationDto.role !== 'agent') {
      throw new ForbiddenException('Managers can only create invitations for agents');
    }
    
    const invitation = await this.invitationsService.create(createInvitationDto);
    return { token: invitation.token };
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get all active invitations' })
  @ApiResponse({ status: 200, description: 'Return all active invitations.' })
  findAll(@Request() req) {
    // If user is a manager, they can only see invitations they created
    // For simplicity, we'll just return all invitations for now
    // In a real app, you'd track who created each invitation and filter accordingly
    return this.invitationsService.findAll();
  }

  @Post(':id/resend')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Resend an invitation' })
  @ApiResponse({ status: 200, description: 'The invitation has been successfully resent.' })
  async resend(@Param('id') id: string) {
    const invitation = await this.invitationsService.resend(id);
    return { token: invitation.token };
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Delete an invitation' })
  @ApiResponse({ status: 200, description: 'The invitation has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.invitationsService.remove(id);
  }
}