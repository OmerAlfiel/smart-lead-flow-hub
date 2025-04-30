// server/src/modules/settings/settings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from './entities/user-settings.entity';
import { NotificationSettings } from './entities/notification-settings.entity';
import { IntegrationSettings } from './entities/integration-settings.entity';
import { AppSettings } from './entities/app-settings.entity';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdateIntegrationSettingsDto } from './dto/update-integration-settings.dto';
import { UpdateAppSettingsDto } from './dto/update-app-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
    @InjectRepository(NotificationSettings)
    private notificationSettingsRepository: Repository<NotificationSettings>,
    @InjectRepository(IntegrationSettings)
    private integrationSettingsRepository: Repository<IntegrationSettings>,
    @InjectRepository(AppSettings)
    private appSettingsRepository: Repository<AppSettings>,
  ) {}

  // User Settings
  async getUserSettings(userId: string): Promise<UserSettings> {
    const settings = await this.userSettingsRepository.findOne({ where: { userId } });
    
    if (!settings) {
      // Create default settings if none exist
      return this.createDefaultUserSettings(userId);
    }
    
    return settings;
  }

  async updateUserSettings(userId: string, updateDto: UpdateUserSettingsDto): Promise<UserSettings> {
    const settings = await this.getUserSettings(userId);
    
    // Update settings with new values
    Object.assign(settings, updateDto);
    
    return this.userSettingsRepository.save(settings);
  }

  private async createDefaultUserSettings(userId: string): Promise<UserSettings> {
    const settings = this.userSettingsRepository.create({
      userId,
      theme: 'light',
      language: 'en',
      timezone: 'UTC'
    });
    
    return this.userSettingsRepository.save(settings);
  }

  // Notification Settings
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    const settings = await this.notificationSettingsRepository.findOne({ where: { userId } });
    
    if (!settings) {
      // Create default notification settings if none exist
      return this.createDefaultNotificationSettings(userId);
    }
    
    return settings;
  }

  async updateNotificationSettings(userId: string, updateDto: UpdateNotificationSettingsDto): Promise<NotificationSettings> {
    const settings = await this.getNotificationSettings(userId);
    
    // Update settings with new values
    Object.assign(settings, updateDto);
    
    return this.notificationSettingsRepository.save(settings);
  }

  private async createDefaultNotificationSettings(userId: string): Promise<NotificationSettings> {
    const settings = this.notificationSettingsRepository.create({
      userId,
      emailNewLead: true,
      emailLeadUpdate: true,
      emailTaskReminders: true,
      emailReports: true,
      pushNewLead: true,
      pushLeadUpdate: false,
      pushTaskReminders: true,
      pushReports: false
    });
    
    return this.notificationSettingsRepository.save(settings);
  }

  // Integration Settings
  async getIntegrationSettings(userId: string): Promise<IntegrationSettings> {
    const settings = await this.integrationSettingsRepository.findOne({ where: { userId } });
    
    if (!settings) {
      // Create default integration settings if none exist
      return this.createDefaultIntegrationSettings(userId);
    }
    
    return settings;
  }

  async updateIntegrationSettings(userId: string, updateDto: UpdateIntegrationSettingsDto): Promise<IntegrationSettings> {
    const settings = await this.getIntegrationSettings(userId);
    
    // Update settings with new values
    Object.assign(settings, updateDto);
    
    return this.integrationSettingsRepository.save(settings);
  }

  private async createDefaultIntegrationSettings(userId: string): Promise<IntegrationSettings> {
    const settings = this.integrationSettingsRepository.create({
      userId,
      google: false,
      office365: false,
      slack: false,
      zoom: false,
      hubspot: false,
      salesforce: false
    });
    
    return this.integrationSettingsRepository.save(settings);
  }

  // App Settings
  async getAppSettings(): Promise<AppSettings> {
    const settings = await this.appSettingsRepository.findOne({ where: {} });
    
    if (!settings) {
      // Create default app settings if none exist
      return this.createDefaultAppSettings();
    }
    
    return settings;
  }

  async updateAppSettings(updateDto: UpdateAppSettingsDto): Promise<AppSettings> {
    const settings = await this.getAppSettings();
    
    // Update settings with new values
    Object.assign(settings, updateDto);
    
    return this.appSettingsRepository.save(settings);
  }

  private async createDefaultAppSettings(): Promise<AppSettings> {
    const settings = this.appSettingsRepository.create({
      companyName: 'Smart Lead Flow Hub',
      enableRegistration: true,
      invitationExpiryDays: 7,
      customFields: {}
    });
    
    return this.appSettingsRepository.save(settings);
  }
}