import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../types/express';

export const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      (req as RequestWithUser).user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
