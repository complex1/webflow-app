"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webflow_controller_1 = require("../controllers/webflow.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const webflowController = new webflow_controller_1.WebflowController();
// Apply authentication middleware to all routes
router.use(auth_middleware_1.authMiddleware.verifyToken);
// GET all webflows
router.get('/', webflowController.getAllWebflows);
// GET webflows for current user
router.get('/my', webflowController.getUserWebflows);
// GET webflows by tags
router.get('/tags', webflowController.getWebflowsByTags);
// GET hierarchy for a specific webflow/folder
router.get('/hierarchy', webflowController.getHierarchy);
// GET a specific webflow by ID
router.get('/:id', webflowController.getWebflowById);
// CREATE a new webflow
router.post('/', webflowController.createWebflow);
// UPDATE an existing webflow
router.put('/:id', webflowController.updateWebflow);
// DELETE a webflow
router.delete('/:id', webflowController.deleteWebflow);
exports.default = router;
