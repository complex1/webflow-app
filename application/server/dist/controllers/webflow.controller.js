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
exports.WebflowController = void 0;
const webflow_service_1 = require("../services/webflow.service");
class WebflowController {
    constructor() {
        this.webflowService = new webflow_service_1.WebflowService();
        this.getAllWebflows = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const webflows = yield this.webflowService.findAll();
                res.status(200).json(webflows);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching webflows', error });
            }
        });
        this.getWebflowById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params || null;
                const webflow = yield this.webflowService.findById(id);
                if (!webflow) {
                    res.status(404).json({ message: `Webflow with id ${id} not found` });
                    return;
                }
                res.status(200).json(webflow);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching webflow', error });
            }
        });
        this.getUserWebflows = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Assuming user ID is available in req.user from auth middleware
                const userId = req.user.id;
                const folderId = req.query.folderId;
                const webflows = yield this.webflowService.findByUser(userId, folderId);
                res.status(200).json(webflows);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching user webflows', error });
            }
        });
        this.createWebflow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const webflowData = req.body;
                // Assuming user ID is available in req.user from auth middleware
                webflowData.createdBy = req.user.id;
                const newWebflow = yield this.webflowService.create(webflowData);
                res.status(201).json(newWebflow);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating webflow', error });
            }
        });
        this.updateWebflow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const webflowData = req.body;
                // Ensure user can't change the createdBy field
                delete webflowData.createdBy;
                const updatedWebflow = yield this.webflowService.update(id, webflowData);
                if (!updatedWebflow) {
                    res.status(404).json({ message: `Webflow with id ${id} not found` });
                    return;
                }
                res.status(200).json(updatedWebflow);
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating webflow', error });
            }
        });
        this.deleteWebflow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const isDeleted = yield this.webflowService.delete(id);
                if (!isDeleted) {
                    res.status(404).json({ message: `Webflow with id ${id} not found` });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting webflow', error });
            }
        });
        this.getWebflowsByTags = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { tags } = req.query;
                if (!tags || !Array.isArray(tags)) {
                    res.status(400).json({ message: 'Tags parameter must be an array' });
                    return;
                }
                const webflows = yield this.webflowService.findByTags(tags);
                res.status(200).json(webflows);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching webflows by tags', error });
            }
        });
        this.getHierarchy = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (!id || typeof id !== 'string') {
                    res.status(400).json({ message: 'ID parameter is required' });
                    return;
                }
                const hierarchy = yield this.webflowService.getHierarchy(id);
                res.status(200).json(hierarchy);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching hierarchy', error });
            }
        });
    }
}
exports.WebflowController = WebflowController;
