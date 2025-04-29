import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      ...createNotificationDto,
      user: { id: createNotificationDto.userId },
    });
    return this.notificationsRepository.save(notification);
  }

  async findAll(userId?: string): Promise<Notification[]> {
    if (userId) {
      return this.notificationsRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
    }
    return this.notificationsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    
    // Handle user reference if userId is provided
    if (updateNotificationDto.userId) {
      updateNotificationDto['user'] = { id: updateNotificationDto.userId };
      delete updateNotificationDto.userId;
    }
    
    this.notificationsRepository.merge(notification, updateNotificationDto);
    return this.notificationsRepository.save(notification);
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationsRepository.softRemove(notification);
  }
}