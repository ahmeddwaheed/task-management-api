import { NextFunction, Request, Response } from "express";
import taskService from "../services/taskService";
import { AppError, ValidationError } from "../utils/errorHandler";
import { taskSchema } from "../validations/task";

const taskController = {
	getAllTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
			const { user } = req.cookies;
			if (!user?.id) {
				throw new AppError("User not found in session", 401);
			}
			const userId = user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const { tasks, totalTasks } = await taskService.getAllTasks(userId, skip, limit);
      res.status(201).json({
        tasks,
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
      });
    } catch (err) {
      next(err);
    }
  },

	createTask: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { user } = req.cookies;
			if (!user?.id) {
				throw new AppError("User not found in session", 401);
			}
			const userId = user.id;
			const { title, description, status, priority, dueDate } = req.body;
			const { error, value } = await taskSchema.validate({ title, description, status, priority, dueDate });

			if (error) {
        throw new ValidationError(error.message);
      }
			const createdTask = await taskService.createTask(value, userId);
			res.status(201).json({ message: "Task created successfully", createdTask });
    } catch (err) {
			next(err);
    }
	},


	getTaskById: async (req: Request, res: Response, next: NextFunction) => {
    try {
			const { user } = req.cookies;
			if (!user?.id) {
				throw new AppError("User not found in session", 401);
			}
			const userId = user.id;
			const taskId = req.params.taskId;
			const task = await taskService.getTaskById(taskId, userId);
			res.status(200).json(task);
    } catch (err: any) {
			next(err); 
    }
},

	updateTaskById: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { user } = req.cookies;
			if (!user?.id) {
				throw new AppError("User not found in session", 401);
			}
			const userId = user.id;
			const taskId = req.params.taskId;

			const { error, value } = taskSchema.validate(req.body);
			if (error) {
				throw new ValidationError(error.details[0].message);
			}

			const updatedTask = await taskService.updateTaskById(
				taskId,
				value,
				userId
			);
			res.status(200).json({ message: "Task updated successfully", updatedTask });
		} catch (err) {
			next(err);
		}
	},

	deleteTaskById: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { user } = req.cookies;
			if (!user?.id) {
				throw new AppError("User not found in session", 401);
			}
			const userId = user.id;
			const taskId = req.params.taskId;
			await taskService.deleteTaskById(taskId, userId);
			res.status(200).json({ message: 'Task deleted successfully' });
			
		} catch (err) {
			next(err);
		}
	},

	searchTasks: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { user } = req.cookies;
			if (!user?.id) {
				throw new AppError("User not found in session", 401);
			}
			const userId = user.id;
			const { priority, dueDate, status, title, description } = req.query;

			const tasks = await taskService.searchTasksByParams(userId, { priority, dueDate, status, title, description });
			res.status(200).json(tasks);
		} catch (err) {
			next(err);
		}
	},

	filterTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
			const { user } = req.cookies;
			if (!user?.id) {
				throw new AppError("User not found in session", 401);
			}
			const userId = user.id;
			const { status, priority } = req.query;
			const filters = {
				userId,
				...(status && { status }),
				...(priority && { priority }),
			};

			const tasks = await taskService.filterTasks(filters);
			res.json(tasks);
		} catch (err) {
			next(err);
		}
	}
};

export default taskController;
