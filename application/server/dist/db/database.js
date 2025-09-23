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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.getDB = exports.initDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const user_entity_1 = require("../entities/user.entity");
const webflow_entity_1 = require("../entities/webflow.entity");
// Create data directory if it doesn't exist
const DATA_DIR = path_1.default.join(process.cwd(), 'data');
const DB_PATH = path_1.default.join(DATA_DIR, 'database.sqlite');
// Configure the database connection
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: DB_PATH,
    entities: [user_entity_1.UserEntity, webflow_entity_1.Webflow],
    synchronize: true, // Automatically creates database schema (use only in development)
    logging: process.env.NODE_ENV === 'development',
});
// Database connection functions
let initialized = false;
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!initialized) {
        yield exports.AppDataSource.initialize();
        initialized = true;
        console.log('Database connection established');
    }
    return exports.AppDataSource;
});
exports.initDB = initDB;
const getDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!initialized) {
        return (0, exports.initDB)();
    }
    return exports.AppDataSource;
});
exports.getDB = getDB;
const closeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (initialized && exports.AppDataSource.isInitialized) {
        yield exports.AppDataSource.destroy();
        initialized = false;
        console.log('Database connection closed');
    }
});
exports.closeDB = closeDB;
