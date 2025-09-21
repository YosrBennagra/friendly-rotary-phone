"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvsController = void 0;
const common_1 = require("@nestjs/common");
const cvs_service_1 = require("./cvs.service");
const cv_dto_1 = require("./dto/cv.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CvsController = class CvsController {
    cvsService;
    constructor(cvsService) {
        this.cvsService = cvsService;
    }
    create(req, createCvDto) {
        return this.cvsService.create(req.user.id, createCvDto);
    }
    findAll(req) {
        return this.cvsService.findAllByUser(req.user.id);
    }
    findOne(id, req) {
        return this.cvsService.findOne(id, req.user.id);
    }
    update(id, req, updateCvDto) {
        return this.cvsService.update(id, req.user.id, updateCvDto);
    }
    remove(id, req) {
        return this.cvsService.remove(id, req.user.id);
    }
    duplicate(id, req) {
        return this.cvsService.duplicate(id, req.user.id);
    }
    updateVisibility(id, req, body) {
        return this.cvsService.updateVisibility(id, req.user.id, body.isPublic);
    }
};
exports.CvsController = CvsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cv_dto_1.CreateCvDto]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, cv_dto_1.UpdateCvDto]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Patch)(':id/visibility'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CvsController.prototype, "updateVisibility", null);
exports.CvsController = CvsController = __decorate([
    (0, common_1.Controller)('cvs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cvs_service_1.CvsService])
], CvsController);
//# sourceMappingURL=cvs.controller.js.map