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
exports.WebflowService = void 0;
const typeorm_1 = require("typeorm");
const webflow_entity_1 = require("../entities/webflow.entity");
const db_1 = require("../db");
class WebflowService {
    constructor() {
        this.webflowRepository = db_1.AppDataSource.getRepository(webflow_entity_1.Webflow);
    }
    // Helper method to transform entity to public DTO
    toPublic(webflow) {
        return {
            id: webflow.id,
            name: webflow.name,
            description: webflow.description,
            icon: webflow.icon,
            tags: webflow.tags,
            openApiDocConfig: webflow.openApiDocConfig,
            createdAt: webflow.createdAt,
            parentId: webflow.parentId,
            isFolder: webflow.isFolder,
        };
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const webflows = yield this.webflowRepository.find();
            return webflows.map(webflow => this.toPublic(webflow));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const webflow = yield this.webflowRepository.findOne({ where: { id } });
            if (!webflow)
                return null;
            return webflow; // Return the full entity for internal use
        });
    }
    findByUser(userId, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle null, undefined, or empty string parentId cases
            const whereCondition = {
                createdBy: userId,
                parentId: !parentId || parentId.trim() === '' ? (0, typeorm_1.IsNull)() : parentId
            };
            const webflows = yield this.webflowRepository.find({ where: whereCondition });
            // Transform entities to public objects, excluding sensitive or unnecessary data
            return webflows.map(webflow => this.toPublic(webflow));
        });
    }
    create(webflowDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const webflow = this.webflowRepository.create(webflowDto);
            const savedWebflow = yield this.webflowRepository.save(webflow);
            return this.toPublic(savedWebflow);
        });
    }
    update(id, webflowDto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webflowRepository.update(id, webflowDto);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webflowRepository.delete(id);
            return typeof result.affected === 'number' && result.affected > 0;
        });
    }
    findByTags(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            // This is a simplified approach - in a real app, you might want to use a more sophisticated query
            const webflows = yield this.webflowRepository.find();
            // Filter by tags and transform to public format
            return webflows
                .filter(webflow => {
                if (!webflow.tags)
                    return false;
                return tags.some(tag => webflow.tags.includes(tag));
            })
                .map(webflow => this.toPublic(webflow));
        });
    }
    getHierarchy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const hierarchy = [];
            let currentId = id;
            // Backtrack through the hierarchy
            while (currentId) {
                const webflow = yield this.webflowRepository.findOne({ where: { id: currentId } });
                if (!webflow) {
                    break; // Item not found, stop backtracking
                }
                // Add current item to the beginning of the hierarchy array
                hierarchy.unshift(this.toPublic(webflow));
                // Move to parent
                currentId = webflow.parentId || '';
            }
            return hierarchy;
        });
    }
}
exports.WebflowService = WebflowService;
