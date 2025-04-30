// client/src/services/tasks.service.ts
import api from '@/services/api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  relatedTo?: {
    type: 'lead' | 'deal';
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  relatedTo?: {
    type: 'lead' | 'deal';
    id: string;
  };
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string;
}

const TasksService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  
  updateTask: async (data: UpdateTaskData): Promise<Task> => {
    const { id, ...updateData } = data;
    const response = await api.patch(`/tasks/${id}`, updateData);
    return response.data;
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};

export default TasksService;