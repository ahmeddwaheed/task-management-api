import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'You Are not Authorized' });
    }

    const token = authHeader.split(' ')[1]; // Assuming Bearer token format

    // 2. Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // 3. Attach user ID to request object for later use
    req.cookies.user = { id: decoded.id }; 

    // 4. Proceed to next middleware/route handler
    next();

  } catch (err) {
    // Handle JWT verification errors
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export default authMiddleware;
