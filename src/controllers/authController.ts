import { Request, Response } from 'express';
import authService from '../services/authService';

const authController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const user = await authService.registerUser(req.body);
      res.status(201).json({ user });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  loginUser: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const token = await authService.loginUser(username, password);
      res.status(200).json({ token });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  },
};

export default authController;
