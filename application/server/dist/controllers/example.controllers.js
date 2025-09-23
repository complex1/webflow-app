"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleController = exports.getUserDetail = exports.loginUser = exports.validateToken = exports.registerUser = void 0;
// User Registration
const registerUser = (req, res) => {
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
exports.registerUser = registerUser;
// Validate User Token
const validateToken = (req, res) => {
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
exports.validateToken = validateToken;
// User Login
const loginUser = (req, res) => {
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
exports.loginUser = loginUser;
// Get User Details
const getUserDetail = (req, res) => {
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
exports.getUserDetail = getUserDetail;
exports.exampleController = {
    registerUser: exports.registerUser,
    validateToken: exports.validateToken,
    loginUser: exports.loginUser,
    getUserDetail: exports.getUserDetail
};
