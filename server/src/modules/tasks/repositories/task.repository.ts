// server/src/modules/tasks/repositories/task.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';


@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async findByLead(leadId: string): Promise<Task[]> {
    return this.createQueryBuilder('task')
      .leftJoinAndSelect('task.lead', 'lead')
      .where('lead.id = :leadId', { leadId })
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async findOverdueTasks(userId: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('task.completed = :completed', { completed: false })
      .andWhere('task.dueDate < :today', { today })
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async findTodayTasks(userId: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('task.completed = :completed', { completed: false })
      .andWhere('task.dueDate >= :today', { today })
      .andWhere('task.dueDate < :tomorrow', { tomorrow })
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async findUpcomingTasks(userId: string): Promise<Task[]> {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('task.completed = :completed', { completed: false })
      .andWhere('task.dueDate >= :tomorrow', { tomorrow })
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async findCompletedTasks(userId: string): Promise<Task[]> {
    return this.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('task.completed = :completed', { completed: true })
      .orderBy('task.updatedAt', 'DESC')
      .getMany();
  }
}