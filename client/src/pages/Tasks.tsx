
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  leadId?: string;
  leadName?: string;
  completed: boolean;
}

const Tasks: React.FC = () => {
  // Mock data for tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up with Michael Johnson',
      description: 'Send proposal details and schedule a demo',
      dueDate: '2025-05-02',
      priority: 'high',
      leadId: '123',
      leadName: 'Michael Johnson',
      completed: false
    },
    {
      id: '2',
      title: 'Prepare presentation for Acme Inc',
      description: 'Review requirements and prepare slides',
      dueDate: '2025-05-05',
      priority: 'medium',
      leadId: '456',
      leadName: 'Acme Inc',
      completed: false
    },
    {
      id: '3',
      title: 'Call Sarah Smith',
      description: 'Discuss new product features',
      dueDate: '2025-05-01',
      priority: 'low',
      leadId: '789',
      leadName: 'Sarah Smith',
      completed: true
    }
  ]);
  
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    completed: false
  });
  
  const { toast } = useToast();

  const handleAddTask = () => {
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      completed: false
    });
    setIsAddTaskOpen(true);
  };

  const handleSaveTask = () => {
    if (!newTask.title) {
      toast({
        title: "Task title required",
        description: "Please enter a title for the task",
        variant: "destructive"
      });
      return;
    }

    const taskToAdd: Task = {
      id: uuidv4(),
      title: newTask.title || '',
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority as 'low' | 'medium' | 'high',
      leadId: newTask.leadId,
      leadName: newTask.leadName,
      completed: false
    };

    setTasks([...tasks, taskToAdd]);
    setIsAddTaskOpen(false);
    
    toast({
      title: "Task added",
      description: "The task has been added successfully"
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    
    toast({
      title: task?.completed ? "Task marked as incomplete" : "Task completed",
      description: `"${task?.title}" has been updated`
    });
  };

  const deleteTask = (taskId: string) => {
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    setTasks(filteredTasks);
    
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter tasks
  const overdueTasks = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < new Date()
  );
  
  const todayTasks = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate).toDateString() === new Date().toDateString()
  );
  
  const upcomingTasks = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate).toDateString() !== new Date().toDateString()
  );
  
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your follow-ups and activities related to leads.
            </p>
          </div>
          <Button onClick={handleAddTask}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Task
          </Button>
        </div>
        
        {overdueTasks.length > 0 && (
          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700">Overdue</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {overdueTasks.map(task => (
                <div key={task.id} className="py-4 flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div>
                      <label 
                        htmlFor={`task-${task.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {task.title}
                      </label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.leadName && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {task.leadName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {todayTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Today</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {todayTasks.map(task => (
                <div key={task.id} className="py-4 flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div>
                      <label 
                        htmlFor={`task-${task.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {task.title}
                      </label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        {task.leadName && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {task.leadName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {upcomingTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {upcomingTasks.map(task => (
                <div key={task.id} className="py-4 flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div>
                      <label 
                        htmlFor={`task-${task.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {task.title}
                      </label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.leadName && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {task.leadName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {completedTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {completedTasks.map(task => (
                <div key={task.id} className="py-4 flex items-start justify-between opacity-70">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div>
                      <label 
                        htmlFor={`task-${task.id}`}
                        className="font-medium cursor-pointer line-through"
                      >
                        {task.title}
                      </label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-through">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.leadName && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 opacity-50">
                            {task.leadName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task and associate it with a lead if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Follow up with client"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea 
                id="description"
                value={newTask.description || ''}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Add details about this task"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate || ''}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => setNewTask({...newTask, priority: value as 'low' | 'medium' | 'high'})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadName">Associated Lead (optional)</Label>
              <Input 
                id="leadName"
                value={newTask.leadName || ''}
                onChange={(e) => setNewTask({...newTask, leadName: e.target.value})}
                placeholder="Enter lead name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tasks;
