// server/src/modules/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { NotificationRepository } from './repository/notification.repository';


@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationPreference])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository],
  exports: [NotificationsService, NotificationRepository],
})
export class NotificationsModule {}