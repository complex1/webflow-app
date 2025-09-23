"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const proxy_controller_1 = require("../controllers/proxy.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
/**
 * @route POST /api/proxy
 * @description Proxy API request through the server
 * @access Private - requires authentication token
 */
router.post('/', auth_middleware_1.authMiddleware.verifyToken, proxy_controller_1.proxyController.handleProxyRequest);
exports.default = router;
