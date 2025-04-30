// server/src/modules/settings/settings.controller.ts
import { Controller, Get, Patch, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdateIntegrationSettingsDto } from './dto/update-integration-settings.dto';
import { UpdateAppSettingsDto } from './dto/update-app-settings.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // User Settings
  @Get('user')
  @ApiOperation({ summary: 'Get user settings' })
  @ApiResponse({ status: 200, description: 'Return user settings' })
  async getUserSettings(@Request() req) {
    return this.settingsService.getUserSettings(req.user.id);
  }

  @Patch('user')
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({ status: 200, description: 'User settings updated successfully' })
  async updateUserSettings(@Request() req, @Body() updateDto: UpdateUserSettingsDto) {
    return this.settingsService.updateUserSettings(req.user.id, updateDto);
  }

  // Notification Settings
  @Get('notifications')
  @ApiOperation({ summary: 'Get notification settings' })
  @ApiResponse({ status: 200, description: 'Return notification settings' })
  async getNotificationSettings(@Request() req) {
    return this.settingsService.getNotificationSettings(req.user.id);
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update notification settings' })
  @ApiResponse({ status: 200, description: 'Notification settings updated successfully' })
  async updateNotificationSettings(@Request() req, @Body() updateDto: UpdateNotificationSettingsDto) {
    return this.settingsService.updateNotificationSettings(req.user.id, updateDto);
  }

  // Integration Settings
  @Get('integrations')
  @ApiOperation({ summary: 'Get integration settings' })
  @ApiResponse({ status: 200, description: 'Return integration settings' })
  async getIntegrationSettings(@Request() req) {
    return this.settingsService.getIntegrationSettings(req.user.id);
  }

  @Patch('integrations')
  @ApiOperation({ summary: 'Update integration settings' })
  @ApiResponse({ status: 200, description: 'Integration settings updated successfully' })
  async updateIntegrationSettings(@Request() req, @Body() updateDto: UpdateIntegrationSettingsDto) {
    return this.settingsService.updateIntegrationSettings(req.user.id, updateDto);
  }

  // App Settings
  @Get('app')
  @ApiOperation({ summary: 'Get app settings' })
  @ApiResponse({ status: 200, description: 'Return app settings' })
  async getAppSettings() {
    return this.settingsService.getAppSettings();
  }

  @Patch('app')
  @Roles('admin')
  @ApiOperation({ summary: 'Update app settings' })
  @ApiResponse({ status: 200, description: 'App settings updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateAppSettings(@Body() updateDto: UpdateAppSettingsDto) {
    return this.settingsService.updateAppSettings(updateDto);
  }
}