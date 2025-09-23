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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const db_1 = require("../db");
const user_entity_1 = require("../entities/user.entity");
const token_util_1 = require("../utils/token.util");
const SALT_ROUNDS = 10;
/**
 * User service for handling user-related operations using SQLite
 */
exports.userService = {
    /**
     * Create a new user
     */
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity);
            // Check if user already exists
            const existingUser = yield userRepository.findOne({ where: { email: userData.email } });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }
            // Hash the password
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, SALT_ROUNDS);
            // Create new user
            const newUser = userRepository.create(Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, userData), { password: hashedPassword }));
            // Save user to database
            yield userRepository.save(newUser);
            // Return user without password
            const { password } = newUser, userResponse = __rest(newUser, ["password"]);
            return userResponse;
        });
    },
    /**
     * Login user and return JWT token
     */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity);
            // Find user by email
            const user = yield userRepository.findOne({ where: { email } });
            if (!user) {
                throw new Error('Invalid email or password');
            }
            // Check password
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }
            // Generate JWT token
            const token = token_util_1.tokenUtil.generateToken(user.id);
            // Return user without password
            const { password: _ } = user, userResponse = __rest(user, ["password"]);
            return { user: userResponse, token };
        });
    },
    /**
     * Login with Google
     */
    loginWithGoogle(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity);
            // Find user by email
            const user = yield userRepository.findOne({ where: { email } });
            if (!user) {
                throw new Error('No user found with this email');
            }
            // Generate JWT token
            const token = token_util_1.tokenUtil.generateToken(user.id);
            // Return user without password
            const { password: _ } = user, userResponse = __rest(user, ["password"]);
            return { user: userResponse, token };
        });
    },
    /**
     * Register with Google
     */
    registerWithGoogle(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity);
            // Check if user already exists
            const existingUser = yield userRepository.findOne({ where: { email: userData.email } });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }
            // Generate a random password for users registered with Google
            // They won't use this password, but we need something in the database
            const randomPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = yield bcryptjs_1.default.hash(randomPassword, SALT_ROUNDS);
            // Create new user
            const newUser = userRepository.create({
                id: (0, uuid_1.v4)(),
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                avatar: userData.avatar,
            });
            // Save user to database
            yield userRepository.save(newUser);
            // Return user without password
            const { password } = newUser, userResponse = __rest(newUser, ["password"]);
            return userResponse;
        });
    },
    /**
     * Get user by ID
     */
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity);
            // Find user by ID
            const user = yield userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return null;
            }
            // Return user without password
            const { password } = user, userResponse = __rest(user, ["password"]);
            return userResponse;
        });
    },
    /**
     * Update user avatar
     */
    updateAvatar(userId, avatarUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity);
            // Find user by ID
            const user = yield userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }
            // Update user avatar
            user.avatar = avatarUrl;
            // Save updated user to database
            yield userRepository.save(user);
            // Return user without password
            const { password } = user, userResponse = __rest(user, ["password"]);
            return userResponse;
        });
    },
    /**
     * Get user by email
     */
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.AppDataSource.getRepository(user_entity_1.UserEntity);
            // Find user by email
            const user = yield userRepository.findOne({ where: { email } });
            if (!user) {
                return null;
            }
            // Return user without password
            const { password } = user, userResponse = __rest(user, ["password"]);
            return userResponse;
        });
    }
};
