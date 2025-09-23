"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const webflow_routes_1 = __importDefault(require("./webflow.routes"));
const proxy_routes_1 = __importDefault(require("./proxy.routes"));
const user_controller_1 = require("../controllers/user.controller");
const google_auth_controller_1 = require("../controllers/google-auth.controller");
const example_routes_1 = require("./example.routes");
const router = (0, express_1.Router)();
// Authentication routes at the root level
router.post('/login', user_controller_1.userController.login);
router.post('/register', user_controller_1.userController.register);
router.post('/auth/google', google_auth_controller_1.googleAuthController.googleLogin);
// Mount other routes
router.use('/users', user_routes_1.default);
router.use('/webflows', webflow_routes_1.default);
router.use('/proxy', proxy_routes_1.default);
router.use('/example', example_routes_1.exampleRoutes);
exports.default = router;
