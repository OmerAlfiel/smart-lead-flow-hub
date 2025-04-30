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
    let settings = await this.userSettingsRepository.findOne({ where: { userId } });
    
    if (!settings) {
      // Create default settings if none exist
      settings = this.userSettingsRepository.create({ userId });
      await this.userSettingsRepository.save(settings);
    }
    
    return settings;
  }

  async updateUserSettings(userId: string, updateDto: UpdateUserSettingsDto): Promise<UserSettings> {
    const settings = await this.getUserSettings(userId);
    
    // Update only the provided fields
    Object.assign(settings, updateDto);
    
    return this.userSettingsRepository.save(settings);
  }

  // Notification Settings
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    let settings = await this.notificationSettingsRepository.findOne({ where: { userId } });
    
    if (!settings) {
      // Create default settings if none exist
      settings = this.notificationSettingsRepository.create({ userId });
      await this.notificationSettingsRepository.save(settings);
    }
    
    return settings;
  }

  async updateNotificationSettings(userId: string, updateDto: UpdateNotificationSettingsDto): Promise<NotificationSettings> {
    const settings = await this.getNotificationSettings(userId);
    
    // Update only the provided fields
    Object.assign(settings, updateDto);
    
    return this.notificationSettingsRepository.save(settings);
  }

  // Integration Settings
  async getIntegrationSettings(userId: string): Promise<IntegrationSettings> {
    let settings = await this.integrationSettingsRepository.findOne({ where: { userId } });
    
    if (!settings) {
      // Create default settings if none exist
      settings = this.integrationSettingsRepository.create({ userId });
      await this.integrationSettingsRepository.save(settings);
    }
    
    return settings;
  }

  async updateIntegrationSettings(userId: string, updateDto: UpdateIntegrationSettingsDto): Promise<IntegrationSettings> {
    const settings = await this.getIntegrationSettings(userId);
    
    // Update only the provided fields
    Object.assign(settings, updateDto);
    
    return this.integrationSettingsRepository.save(settings);
  }

  // App Settings (global)
  async getAppSettings(): Promise<AppSettings> {
    let settings = await this.appSettingsRepository.findOne({ where: {} });
    
    if (!settings) {
      // Create default app settings if none exist
      settings = this.appSettingsRepository.create();
      await this.appSettingsRepository.save(settings);
    }
    
    return settings;
  }

  async updateAppSettings(updateDto: UpdateAppSettingsDto): Promise<AppSettings> {
    const settings = await this.getAppSettings();
    
    // Update only the provided fields
    Object.assign(settings, updateDto);
    
    return this.appSettingsRepository.save(settings);
  }
}