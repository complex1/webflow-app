import { Request, Response } from 'express';


// User Registration
export const registerUser = (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  
  // Mock validation
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and name are required'
    });
  }
  
  // Create new user (mock)
  const newUser = {
    id: Date.now(),
    email,
    name,
    password, // In real app, this would be hashed
    token: `mock-jwt-token-${Date.now()}`,
  };
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      token: newUser.token
    }
  });
};

// Validate User Token
export const validateToken = (req: Request, res: Response) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token is required'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      message: 'User is validated successfully',
    }
  });
};

// User Login
export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token: `mock-jwt-token-${Date.now()}`,
    }
  });
};

// Get User Details
export const getUserDetail = (req: Request, res: Response) => {
  
  res.status(200).json({
    success: true,
    message: 'User details retrieved successfully',
    data: {
      id: Date.now(),
      email: 'user@example.com',
      name: 'John Doe'
    }
  });
};


export const exampleController = {
  registerUser,
  validateToken,
  loginUser,
  getUserDetail
};