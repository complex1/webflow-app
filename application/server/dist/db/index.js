"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.closeDB = exports.getDB = exports.initDB = void 0;
const database_1 = require("./database");
Object.defineProperty(exports, "initDB", { enumerable: true, get: function () { return database_1.initDB; } });
Object.defineProperty(exports, "getDB", { enumerable: true, get: function () { return database_1.getDB; } });
Object.defineProperty(exports, "closeDB", { enumerable: true, get: function () { return database_1.closeDB; } });
Object.defineProperty(exports, "AppDataSource", { enumerable: true, get: function () { return database_1.AppDataSource; } });
