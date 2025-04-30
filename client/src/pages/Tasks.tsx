// client/src/pages/Tasks.tsx
import React, { useState, useEffect } from 'react';
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
import TasksService, { Task, CreateTaskData } from '@/services/tasks.service';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<CreateTaskData>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string>('');
  
  const { toast } = useToast();

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await TasksService.getAllTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending'
    });
    setIsAddTaskOpen(true);
  };

  const handleSaveTask = async () => {
    if (!newTask.title) {
      toast({
        title: "Task title required",
        description: "Please enter a title for the task",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a minimal valid task with only the required fields
      const taskData = {
        title: newTask.title,
        priority: newTask.priority || 'medium',
        completed: false
      };
      
      // Add optional fields only if they have valid values
      if (newTask.description) {
        taskData['description'] = newTask.description;
      }
      
      if (newTask.dueDate) {
        // Ensure date is in ISO format
        taskData['dueDate'] = new Date(newTask.dueDate).toISOString();
      }
      
      console.log('Sending minimal task data to server:', taskData);
      
      const createdTask = await TasksService.createTask(taskData as any);
      setTasks([...tasks, createdTask]);
      setIsAddTaskOpen(false);
      
      toast({
        title: "Task added",
        description: "The task has been added successfully"
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Convert status to completed boolean
      const isCompleted = task.status === 'completed';
      const newCompleted = !isCompleted;
      
      // Create a minimal valid update payload
      const updateData = {
        id: taskId,
        completed: newCompleted
      };
      
      console.log('Sending task update to server:', updateData);
      
      await TasksService.updateTask(updateData);
      
      // Update local state with the new status
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, status: newCompleted ? 'completed' : 'pending' } : t
      ));
      
      toast({
        title: newCompleted ? "Task completed" : "Task marked as incomplete",
        description: `"${task.title}" has been updated`
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    try {
      await TasksService.deleteTask(taskToDelete);
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
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
    task.status !== 'completed' && 
    task.dueDate && 
    new Date(task.dueDate) < new Date()
  );
  
  const todayTasks = tasks.filter(task => 
    task.status !== 'completed' && 
    task.dueDate && 
    new Date(task.dueDate).toDateString() === new Date().toDateString()
  );
  
  const upcomingTasks = tasks.filter(task => 
    task.status !== 'completed' && 
    task.dueDate && 
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate).toDateString() !== new Date().toDateString()
  );
  
  const completedTasks = tasks.filter(task => task.status === 'completed');

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
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading tasks...</p>
          </div>
        ) : (
          <>
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
                          checked={task.status === 'completed'}
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
                            {task.relatedTo && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {task.relatedTo.type}: {task.relatedTo.id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
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
                          checked={task.status === 'completed'}
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
                            {task.relatedTo && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {task.relatedTo.type}: {task.relatedTo.id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
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
                          checked={task.status === 'completed'}
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
                            {task.relatedTo && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {task.relatedTo.type}: {task.relatedTo.id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
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
                          checked={true}
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
                            {task.relatedTo && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 opacity-50">
                                {task.relatedTo.type}: {task.relatedTo.id}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
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
          </>
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
              <Label htmlFor="relatedTo">Associated Lead ID (optional)</Label>
              <Input 
                id="relatedTo"
                value={newTask.relatedTo?.id || ''}
                onChange={(e) => setNewTask({
                  ...newTask, 
                  relatedTo: { 
                    type: 'lead', 
                    id: e.target.value 
                  }
                })}
                placeholder="Enter lead ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Tasks;