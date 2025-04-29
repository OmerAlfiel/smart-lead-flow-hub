// server/src/modules/teams/teams.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request,
  ForbiddenException
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'The team has been successfully created.' })
  create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    // Set the current user as the owner if not specified
    if (!createTeamDto.ownerId) {
      createTeamDto.ownerId = req.user.id;
    } else if (createTeamDto.ownerId !== req.user.id && req.user.role !== 'admin') {
      // Only admins can create teams with a different owner
      throw new ForbiddenException('You do not have permission to set a different owner');
    }
    
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'Return all teams.' })
  findAll(@Request() req) {
    // If user is admin, return all teams, otherwise return only teams the user is a member of
    if (req.user.role === 'admin') {
      return this.teamsService.findAll();
    } else {
      return this.teamsService.findByUser(req.user.id);
    }
  }

  @Get('my-teams')
  @ApiOperation({ summary: 'Get teams for the current user' })
  @ApiResponse({ status: 200, description: 'Return teams for the current user.' })
  findMyTeams(@Request() req) {
    return this.teamsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiResponse({ status: 200, description: 'Return the team.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiParam({ name: 'id', description: 'ID of the team' })
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a team' })
  @ApiResponse({ status: 200, description: 'The team has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiParam({ name: 'id', description: 'ID of the team' })
  update(
    @Param('id') id: string, 
    @Body() updateTeamDto: UpdateTeamDto,
    @Request() req
  ) {
    return this.teamsService.update(id, updateTeamDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiResponse({ status: 200, description: 'The team has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiParam({ name: 'id', description: 'ID of the team' })
  remove(@Param('id') id: string, @Request() req) {
    return this.teamsService.remove(id, req.user.id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get team members' })
  @ApiResponse({ status: 200, description: 'Return team members.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiParam({ name: 'id', description: 'ID of the team' })
  getMembers(@Param('id') id: string) {
    return this.teamsService.getMembers(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to the team' })
  @ApiResponse({ status: 201, description: 'The member has been successfully added to the team.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiResponse({ status: 409, description: 'User is already a member of this team.' })
  @ApiParam({ name: 'id', description: 'ID of the team' })
  addMember(
    @Param('id') id: string,
    @Body() addTeamMemberDto: AddTeamMemberDto,
    @Request() req
  ) {
    return this.teamsService.addMember(id, addTeamMemberDto, req.user.id);
  }

  @Patch(':id/members/:memberId')
  @ApiOperation({ summary: 'Update a team member' })
  @ApiResponse({ status: 200, description: 'The team member has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Team or member not found.' })
  @ApiParam({ name: 'id', description: 'ID of the team' })
  @ApiParam({ name: 'memberId', description: 'ID of the team member' })
  updateMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @Request() req
  ) {
    return this.teamsService.updateMember(id, memberId, updateTeamMemberDto, req.user.id);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from the team' })
  @ApiResponse({ status: 200, description: 'The member has been successfully removed from the team.' })
  @ApiResponse({ status: 404, description: 'Team or member not found.' })
  @ApiParam({ name: 'id', description: 'ID of the team' })
  @ApiParam({ name: 'memberId', description: 'ID of the team member' })
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Request() req
  ) {
    return this.teamsService.removeMember(id, memberId, req.user.id);
  }
}