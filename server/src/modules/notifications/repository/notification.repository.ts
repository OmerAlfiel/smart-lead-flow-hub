// server/src/modules/notifications/repositories/notification.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return this.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('notification.isRead = :isRead', { isRead: false })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('user.id = :userId', { userId })
      .execute();
  }
}