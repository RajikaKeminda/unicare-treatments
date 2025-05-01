import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
            };
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // //TODO: Hardcoded user id for now

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    req.user = { _id: token ?? "66e66e6e6e6e6e6e6e6e6e6e" };
    next();

    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };
    //     req.user = { _id: decoded._id };
    //     next();
    // } catch (error) {
    //     res.status(403).json({
    //         success: false,
    //         error: 'Invalid or expired token',
    //     });
    //     return;
    // }
}; 