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
exports.authMiddleware = void 0;
const user_service_1 = require("../services/user.service");
const token_util_1 = require("../utils/token.util");
exports.authMiddleware = {
    verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get token from Authorization header
                const authHeader = req.headers.authorization;
                const origin = req.headers.origin;
                if (req.baseUrl === '/api/proxy' && req.method === 'POST' && (origin === 'http://localhost:3000' || origin === 'https://apiflux.in')) {
                    // Bypass token verification for this route
                    return next();
                }
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    res.status(401).json({ message: 'Authentication required', errorCode: 'INVALID_TOKEN' });
                    return;
                }
                const token = authHeader.split(' ')[1];
                // Verify token
                const decoded = token_util_1.tokenUtil.verifyToken(token);
                if (!decoded || !decoded.userId) {
                    res.status(401).json({ message: 'Invalid token', errorCode: 'INVALID_TOKEN' });
                    return;
                }
                // Get user from database
                const user = yield user_service_1.userService.getUserById(decoded.userId);
                if (!user) {
                    res.status(401).json({ message: 'User not found', errorCode: 'INVALID_TOKEN' });
                    return;
                }
                // Attach user to request object
                req.user = user;
                next();
            }
            catch (error) {
                res.status(401).json({ message: 'Authentication failed', errorCode: 'INVALID_TOKEN' });
                return;
            }
        });
    }
};
