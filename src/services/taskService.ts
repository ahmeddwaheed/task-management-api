import { AppError } from '../utils/errorHandler';
import Task from '../models/task';
import { FilterQuery } from 'mongoose';
import { assoc } from 'ramda';

const taskService = {
	getAllTasks: async (userId: string, skip: number, limit: number) => {
    const tasks = await Task.find({ userId })
      .skip(skip)
      .limit(limit);
    const totalTasks = await Task.countDocuments({ userId });

    return { tasks, totalTasks };
  },

  createTask: async (taskData: any, userId: string) => {
    const task = new Task({ ...taskData, userId });
    await task.save();
    return task;
  },

  getTaskById: async (taskId: string, userId: string) => {
    const task = await Task.findOne({ id: taskId, userId });
    if (!task) {
			throw new AppError('Task not found', 404);
    }
    return task;
  },

  updateTaskById: async (taskId: string, taskData: any, userId: string) => {
    const task = await Task.findOneAndUpdate(
      { id: taskId, userId },
      taskData,
      { new: true }
    );
    if (!task) {
			throw new AppError('Task not found', 404);
    }
    return task;
  },

  deleteTaskById: async (taskId: string, userId: string) => {
    const task = await Task.findOneAndDelete({ id: taskId, userId });
    if (!task) {
			throw new AppError('Task not found', 404);
    }
    return task; 
  },

  searchTasksByParams: async (userId: string, searchCriteria: FilterQuery<typeof Task>) => {
    let searchQuery = {};
    const { priority, dueDate, status, title, description } = searchCriteria;

    if (priority) {
      searchQuery = assoc('priority', priority, searchQuery);
    }

    if (dueDate) {
      const parsedDate = typeof dueDate === 'string' ? new Date(dueDate) : null;
      searchQuery = assoc('dueDate', { $gte: parsedDate }, searchQuery);
    }

    if (status) {
      searchQuery = assoc('status', status, searchQuery);
    }

    if (title) {
      searchQuery = assoc('title', { $regex: title, $options: 'i' }, searchQuery);
    }

    if (description) {
      searchQuery = assoc('description', { $regex: description, $options: 'i' }, searchQuery);
    }
    const tasks = await Task.find({ userId, ...searchQuery });
    return tasks;
  },

  filterTasks: async (filters: FilterQuery<typeof Task>) => {
    const tasks = await Task.find(filters);
    return tasks;
},
};

export default taskService;
