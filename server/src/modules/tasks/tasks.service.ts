// server/src/modules/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private taskRepository: TaskRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      assignedTo: createTaskDto.assignedToId ? { id: createTaskDto.assignedToId } : null,
      lead: createTaskDto.leadId ? { id: createTaskDto.leadId } : null,
    });
    
    return this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['assignedTo', 'lead'],
      order: { dueDate: 'ASC' },
    });
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUser(userId);
  }

  async findByLead(leadId: string): Promise<Task[]> {
    return this.taskRepository.findByLead(leadId);
  }

  async findOverdueTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findOverdueTasks(userId);
  }

  async findTodayTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findTodayTasks(userId);
  }

  async findUpcomingTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findUpcomingTasks(userId);
  }

  async findCompletedTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findCompletedTasks(userId);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedTo', 'lead'],
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    // Handle relations
    if (updateTaskDto.assignedToId !== undefined) {
      task.assignedTo = updateTaskDto.assignedToId ? { id: updateTaskDto.assignedToId } as any : null;
      delete updateTaskDto.assignedToId;
    }
    
    if (updateTaskDto.leadId !== undefined) {
      task.lead = updateTaskDto.leadId ? { id: updateTaskDto.leadId } as any : null;
      delete updateTaskDto.leadId;
    }
    
    this.tasksRepository.merge(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async toggleCompletion(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.completed = !task.completed;
    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.softRemove(task);
  }
}