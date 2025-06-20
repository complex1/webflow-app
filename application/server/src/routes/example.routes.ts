const express = require('express');
const router = express.Router();
const { registerUser, validateToken, loginUser, getUserDetail } = require('../controllers/example.controllers');

// User registration
router.post('/register', registerUser);

// Validate user token
router.post('/validate', validateToken);

// User login
router.post('/login', loginUser);

// Get user details
router.get('/user', getUserDetail);

export const exampleRoutes = router;
