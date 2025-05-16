import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, avatar } = req.body;
      
      // Validate input
      if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email and password are required' });
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }
      
      // Password strength validation
      if (password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 characters long' });
        return;
      }
      
      // Create user
      const user = await userService.register({
        name,
        email,
        password,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      });
      
      res.status(201).json({ user });
    } catch (error: any) {
      if (error.message === 'User already exists with this email') {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
  },
  
  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      
      // Login user
      const { user, token } = await userService.login(email, password);
      
      res.status(200).json({ user, token });
    } catch (error: any) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
  },
  
  /**
   * Get authenticated user
   */
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      // User is attached to request by auth middleware
      res.status(200).json({ user: req.user });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
  },
  
  /**
   * Update user avatar
   */
  async updateAvatar(req: Request, res: Response): Promise<void> {
    try {
      // User is attached to request by auth middleware
      const userId = req.user?.id;
      const { avatarUrl } = req.body;
      
      // Validate input
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      if (!avatarUrl) {
        res.status(400).json({ message: 'Avatar URL is required' });
        return;
      }
      
      // URL validation
      try {
        new URL(avatarUrl);
      } catch (error) {
        res.status(400).json({ message: 'Invalid avatar URL format' });
        return;
      }
      
      // Update user avatar
      const updatedUser = await userService.updateAvatar(userId, avatarUrl);
      
      res.status(200).json({ user: updatedUser });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Failed to update avatar', error: error.message });
    }
  }
};