import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already exists' : 'Username already exists' 
      });
    }

    // Create new user
    console.log('Creating new user...');
    const user = await User.create({
      username,
      email,
      password,
      userType: req.body.userType || 'individual',
      userRole: req.body.userRole || 'user',
      avatar: req.body.avatar,
    });
    console.log('User created successfully:', user.id);

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );
    console.log('JWT token generated successfully');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        userType: user.userType,
        userRole: user.userRole,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.checkPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        userType: user.userType,
        userRole: user.userRole,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        userType: user.userType,
        userRole: user.userRole,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { username, email, avatar, userType, userRole } = req.body;

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        where: {
          [Op.and]: [
            { id: { [Op.ne]: user.id } },
            {
              [Op.or]: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : []),
              ],
            },
          ],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          error: existingUser.email === email ? 'Email already exists' : 'Username already exists'
        });
      }
    }

    // Update user fields
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (userType) updateData.userType = userType;
    if (userRole) updateData.userRole = userRole;

    await User.update(updateData, { where: { id: user.id } });

    // Fetch updated user
    const updatedUser = await User.findByPk(user.id);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser!.id,
        username: updatedUser!.username,
        email: updatedUser!.email,
        avatar: updatedUser!.avatar,
        userType: updatedUser!.userType,
        userRole: updatedUser!.userRole,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
