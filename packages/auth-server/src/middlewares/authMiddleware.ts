import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (requiredScopes: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const hasRequiredScopes = requiredScopes.every(scope => decoded.scopes.includes(scope));

    if (!hasRequiredScopes) {
      return res.status(403).send('Forbidden');
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

export default authMiddleware;