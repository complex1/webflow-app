import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userService } from "../services/user.service";

const JWT_SECRET = process.env.JWT_SECRET || "workflow-app-secret-key";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authentication required", errorCode: 'INVALID_TOKEN' });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Invalid token", errorCode: 'INVALID_TOKEN' });
      return;
    }

    // Get user from database
    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: "User not found", errorCode: 'INVALID_TOKEN' });
      return;
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed", errorCode: 'INVALID_TOKEN' });
    return;
  }
};
