// server/src/modules/users/users.controller.ts
import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserProfileDto } from './dto/user-profile.dto';
import { plainToClass } from 'class-transformer';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Get()
@ApiOperation({ summary: 'Get all users' })
@ApiResponse({ status: 200, description: 'Return all users' })
async findAll(@Query('email') email?: string, @Query('role') role?: string) {
  const users = await this.usersService.findAll({ email, role });
  return users.map(user => plainToClass(UserProfileDto, user));
}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the current user profile' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.id);
    return plainToClass(UserProfileDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return plainToClass(UserProfileDto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(@Request() req, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Only admins can change roles or update other users
    if (req.user.id !== id && req.user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to update this user');
    }
    
    // Only admins can change roles
    if (updateUserDto.role && req.user.role !== 'admin') {
      throw new ForbiddenException('Only admins can change user roles');
    }
    
    const user = await this.usersService.update(id, updateUserDto);
    return plainToClass(UserProfileDto, user);
  }
  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async changePassword(
    @Request() req,
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    // Only the user themselves can change their password
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only change your own password');
    }
    
    await this.usersService.updatePassword(
      id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    
    return { success: true, message: 'Password changed successfully' };
  }

  // server/src/modules/users/users.controller.ts
  // Add this method to the UsersController class
  @Patch(':id/role')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.usersService.updateRole(id, updateRoleDto.role);
  }



  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Request() req, @Param('id') id: string) {
    // Only admins can delete users or users can delete themselves
    if (req.user.id !== id && req.user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to delete this user');
    }
    
    await this.usersService.remove(id);
    return { success: true, message: 'User deleted successfully' };
  }
}