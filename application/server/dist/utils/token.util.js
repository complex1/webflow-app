"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_config_1 = require("../config/auth.config");
/**
 * Utility functions for handling auth tokens
 */
exports.tokenUtil = {
    /**
     * Generate JWT token for a user
     */
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, auth_config_1.JWT_SECRET, { expiresIn: '7d' });
    },
    /**
     * Verify a JWT token
     */
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, auth_config_1.JWT_SECRET);
        }
        catch (error) {
            return null;
        }
    }
};
