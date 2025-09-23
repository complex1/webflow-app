"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const google_auth_controller_1 = require("../controllers/google-auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', user_controller_1.userController.register);
router.post('/login', user_controller_1.userController.login);
router.post('/auth/google', google_auth_controller_1.googleAuthController.googleLogin);
// Protected routes
router.get('/user', auth_middleware_1.authMiddleware.verifyToken, user_controller_1.userController.getUser);
router.put('/user/avatar', auth_middleware_1.authMiddleware.verifyToken, user_controller_1.userController.updateAvatar);
exports.default = router;
