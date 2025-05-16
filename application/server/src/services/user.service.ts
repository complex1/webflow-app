import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../db';
import { UserEntity } from '../entities/user.entity';
import { User, UserResponse } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'workflow-app-secret-key';
const SALT_ROUNDS = 10;

/**
 * User service for handling user-related operations using SQLite
 */
export const userService = {
  /**
   * Create a new user
   */
  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserResponse> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    
    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    // Create new user
    const newUser = userRepository.create({
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
    });
    
    // Save user to database
    await userRepository.save(newUser);
    
    // Return user without password
    const { password, ...userResponse } = newUser;
    return userResponse;
  },
  
  /**
   * Login user and return JWT token
   */
  async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    
    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user without password
    const { password: _, ...userResponse } = user;
    return { user: userResponse, token };
  },
  
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponse | null> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    
    // Find user by ID
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      return null;
    }
    
    // Return user without password
    const { password, ...userResponse } = user;
    return userResponse;
  },
  
  /**
   * Update user avatar
   */
  async updateAvatar(userId: string, avatarUrl: string): Promise<UserResponse> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    
    // Find user by ID
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user avatar
    user.avatar = avatarUrl;
    
    // Save updated user to database
    await userRepository.save(user);
    
    // Return user without password
    const { password, ...userResponse } = user;
    return userResponse;
  },
  
  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const userRepository = AppDataSource.getRepository(UserEntity);
    
    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) {
      return null;
    }
    
    // Return user without password
    const { password, ...userResponse } = user;
    return userResponse;
  }
};