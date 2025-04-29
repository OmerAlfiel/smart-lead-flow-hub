// server/src/modules/tasks/tasks.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  findAll(@Query('userId') userId?: string, @Query('leadId') leadId?: string) {
    if (userId) {
      return this.tasksService.findByUser(userId);
    }
    
    if (leadId) {
      return this.tasksService.findByLead(leadId);
    }
    
    return this.tasksService.findAll();
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue tasks' })
  @ApiResponse({ status: 200, description: 'Return overdue tasks' })
  findOverdueTasks(@Query('userId') userId: string) {
    return this.tasksService.findOverdueTasks(userId);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today\'s tasks' })
  @ApiResponse({ status: 200, description: 'Return today\'s tasks' })
  findTodayTasks(@Query('userId') userId: string) {
    return this.tasksService.findTodayTasks(userId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming tasks' })
  @ApiResponse({ status: 200, description: 'Return upcoming tasks' })
  findUpcomingTasks(@Query('userId') userId: string) {
    return this.tasksService.findUpcomingTasks(userId);
  }

  @Get('completed')
  @ApiOperation({ summary: 'Get completed tasks' })
  @ApiResponse({ status: 200, description: 'Return completed tasks' })
  findCompletedTasks(@Query('userId') userId: string) {
    return this.tasksService.findCompletedTasks(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/toggle-completion')
  @ApiOperation({ summary: 'Toggle task completion status' })
  @ApiResponse({ status: 200, description: 'Task completion status toggled' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  toggleCompletion(@Param('id') id: string) {
    return this.tasksService.toggleCompletion(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}