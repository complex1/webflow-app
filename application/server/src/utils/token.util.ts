import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.config';

/**
 * Utility functions for handling auth tokens
 */
export const tokenUtil = {
  /**
   * Generate JWT token for a user
   */
  generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  },
  
  /**
   * Verify a JWT token
   */
  verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return null;
    }
  }
};
