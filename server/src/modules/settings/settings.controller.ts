// server/src/modules/settings/settings.controller.ts
import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SettingsService } from './settings.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdateIntegrationSettingsDto } from './dto/update-integration-settings.dto';
import { UpdateAppSettingsDto } from './dto/update-app-settings.dto';

// Define the roles enum to match what's in the User entity
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent'
}

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // User Settings
  @Get('user')
  async getUserSettings(@Request() req) {
    return this.settingsService.getUserSettings(req.user.id);
  }

  @Patch('user')
  async updateUserSettings(@Request() req, @Body() updateDto: UpdateUserSettingsDto) {
    return this.settingsService.updateUserSettings(req.user.id, updateDto);
  }

  // Notification Settings
  @Get('notifications')
  async getNotificationSettings(@Request() req) {
    return this.settingsService.getNotificationSettings(req.user.id);
  }

  @Patch('notifications')
  async updateNotificationSettings(
    @Request() req,
    @Body() updateDto: UpdateNotificationSettingsDto,
  ) {
    return this.settingsService.updateNotificationSettings(req.user.id, updateDto);
  }

  // Integration Settings
  @Get('integrations')
  async getIntegrationSettings(@Request() req) {
    return this.settingsService.getIntegrationSettings(req.user.id);
  }

  @Patch('integrations')
  async updateIntegrationSettings(
    @Request() req,
    @Body() updateDto: UpdateIntegrationSettingsDto,
  ) {
    return this.settingsService.updateIntegrationSettings(req.user.id, updateDto);
  }

  // App Settings (admin only)
  @Get('app')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAppSettings() {
    return this.settingsService.getAppSettings();
  }

  @Patch('app')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateAppSettings(@Body() updateDto: UpdateAppSettingsDto) {
    return this.settingsService.updateAppSettings(updateDto);
  }
}