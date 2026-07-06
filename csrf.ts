import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';

export const csrfMiddleware = csrf({
  cookie: {
    key: 'csrfToken',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
});

export const csrfErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
};
