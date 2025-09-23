"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("../services/user.service");
exports.userController = {
    /**
     * Register a new user
     */
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const user = yield user_service_1.userService.register({
                    name,
                    email,
                    password,
                    avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
                });
                res.status(201).json({ user });
            }
            catch (error) {
                if (error.message === 'User already exists with this email') {
                    res.status(409).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Failed to register user', error: error.message });
            }
        });
    },
    /**
     * Login user
     */
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Validate input
                if (!email || !password) {
                    res.status(400).json({ message: 'Email and password are required' });
                    return;
                }
                // Login user
                const { user, token } = yield user_service_1.userService.login(email, password);
                res.status(200).json({ user, token });
            }
            catch (error) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }
        });
    },
    /**
     * Get authenticated user
     */
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // User is attached to request by auth middleware
                res.status(200).json({ user: req.user });
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to fetch user', error: error.message });
            }
        });
    },
    /**
     * Update user avatar
     */
    updateAvatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // User is attached to request by auth middleware
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
                }
                catch (error) {
                    res.status(400).json({ message: 'Invalid avatar URL format' });
                    return;
                }
                // Update user avatar
                const updatedUser = yield user_service_1.userService.updateAvatar(userId, avatarUrl);
                res.status(200).json({ user: updatedUser });
            }
            catch (error) {
                if (error.message === 'User not found') {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Failed to update avatar', error: error.message });
            }
        });
    }
};
