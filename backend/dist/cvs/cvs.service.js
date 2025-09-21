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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let CvsService = class CvsService {
    database;
    constructor(database) {
        this.database = database;
    }
    async findAllByUser(userId) {
        const cvs = await this.database.findCVsByUserId(userId);
        const cvsWithVersions = await Promise.all(cvs.map(async (cv) => {
            const versions = await this.database.findVersionsByCVId(cv.id);
            const latestVersion = versions.length > 0 ? versions[0] : null;
            return {
                id: cv.id,
                title: cv.title,
                slug: cv.slug,
                isPublic: cv.isPublic,
                template: cv.template,
                createdAt: cv.createdAt,
                updatedAt: cv.updatedAt,
                versions: latestVersion ? [{ id: latestVersion.id, createdAt: latestVersion.createdAt }] : [],
            };
        }));
        return cvsWithVersions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    async findOne(id, userId) {
        const cv = await this.database.findCVById(id);
        if (!cv) {
            throw new common_1.NotFoundException('CV not found');
        }
        if (cv.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const versions = await this.database.findVersionsByCVId(id);
        const versionsWithLabels = versions
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map(version => ({
            id: version.id,
            label: version.label,
            createdAt: version.createdAt,
        }));
        return {
            ...cv,
            versions: versionsWithLabels,
        };
    }
    async create(userId, createCvDto) {
        const slug = createCvDto.slug || this.generateSlug(createCvDto.title);
        const cv = await this.database.createCV({
            userId,
            title: createCvDto.title,
            slug,
            template: createCvDto.template || 'CLASSIC',
            isPublic: false,
            theme: createCvDto.theme || {
                fontFamily: 'Inter',
                accentColor: '#3b82f6',
                spacing: 'normal',
                showIcons: true,
                compactMode: false,
            },
            data: createCvDto.data || {
                header: {
                    fullName: '',
                    title: '',
                    email: '',
                    phone: '',
                    location: '',
                    website: '',
                    github: '',
                    linkedin: '',
                    avatarUrl: '',
                    summaryRichText: '',
                },
                experience: [],
                education: [],
                projects: [],
                skills: { groups: [] },
                certifications: [],
                languages: [],
                interests: [],
                customSections: [],
            },
        });
        await this.database.createVersion({
            cvId: cv.id,
            label: 'Initial version',
            snapshot: {
                template: cv.template,
                theme: cv.theme,
                data: cv.data,
            },
        });
        return cv;
    }
    async update(id, userId, updateCvDto) {
        await this.findOne(id, userId);
        const updatedCv = await this.database.updateCV(id, {
            ...updateCvDto,
            updatedAt: new Date(),
        });
        return updatedCv;
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        const deleted = await this.database.deleteCV(id);
        if (!deleted) {
            throw new common_1.NotFoundException('CV not found');
        }
        return { message: 'CV deleted successfully' };
    }
    async duplicate(id, userId) {
        const originalCv = await this.findOne(id, userId);
        const newCv = await this.database.createCV({
            userId,
            title: `${originalCv.title} (Copy)`,
            slug: `${originalCv.slug}-copy-${Date.now()}`,
            template: originalCv.template,
            isPublic: false,
            theme: originalCv.theme,
            data: originalCv.data,
        });
        await this.database.createVersion({
            cvId: newCv.id,
            label: 'Duplicated version',
            snapshot: {
                template: newCv.template,
                theme: newCv.theme,
                data: newCv.data,
            },
        });
        return newCv;
    }
    async updateVisibility(id, userId, isPublic) {
        await this.findOne(id, userId);
        return this.database.updateCV(id, { isPublic });
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
};
exports.CvsService = CvsService;
exports.CvsService = CvsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CvsService);
//# sourceMappingURL=cvs.service.js.map