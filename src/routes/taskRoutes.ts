import { Router } from 'express';
import taskController from '../controllers/taskController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, taskController.getAllTasks);
router.post('/', authMiddleware, taskController.createTask);
router.get('/search', authMiddleware, taskController.searchTasks);
router.get('/filter', authMiddleware, taskController.filterTasks);
router.get('/:taskId', authMiddleware, taskController.getTaskById);
router.put('/:taskId', authMiddleware, taskController.updateTaskById);
router.delete('/:taskId', authMiddleware, taskController.deleteTaskById);

export default router;