// server/src/modules/settings/settings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { NotificationSettings } from './entities/notification-settings.entity';
import { IntegrationSettings } from './entities/integration-settings.entity';
import { AppSettings } from './entities/app-settings.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { UserSettings } from './entities/user-settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSettings,
      NotificationSettings,
      IntegrationSettings,
      AppSettings
    ]),
    UsersModule
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService]
})
export class SettingsModule {}