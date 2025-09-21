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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const config_1 = require("@nestjs/config");
let DatabaseService = class DatabaseService {
    configService;
    client;
    db;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        const mongoUri = this.configService.get('MONGODB_URI');
        const dbName = this.configService.get('DATABASE_NAME');
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        if (!dbName) {
            throw new Error('DATABASE_NAME is not defined in environment variables');
        }
        this.client = new mongodb_1.MongoClient(mongoUri);
        await this.client.connect();
        this.db = this.client.db(dbName);
        console.log('✅ Connected to MongoDB');
    }
    async onModuleDestroy() {
        await this.client?.close();
        console.log('❌ Disconnected from MongoDB');
    }
    transformDocument(doc) {
        if (!doc)
            return null;
        const transformed = { ...doc };
        if (transformed._id) {
            transformed.id = transformed._id.toString();
            delete transformed._id;
        }
        return transformed;
    }
    get users() {
        return this.db.collection('users');
    }
    async createUser(userData) {
        const now = new Date();
        const user = {
            ...userData,
            createdAt: now,
            updatedAt: now,
        };
        const result = await this.users.insertOne(user);
        const createdUser = await this.users.findOne({ _id: result.insertedId });
        if (!createdUser) {
            throw new Error('Failed to create user');
        }
        return this.transformDocument(createdUser);
    }
    async findUserById(id) {
        const user = await this.users.findOne({ _id: new mongodb_1.ObjectId(id) });
        return user ? this.transformDocument(user) : null;
    }
    async findUserByEmail(email) {
        const user = await this.users.findOne({ email });
        return user ? this.transformDocument(user) : null;
    }
    async updateUser(id, updates) {
        await this.users.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } });
        return this.findUserById(id);
    }
    async deleteUser(id) {
        const result = await this.users.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return result.deletedCount > 0;
    }
    get cvs() {
        return this.db.collection('cvs');
    }
    async createCV(cvData) {
        const now = new Date();
        const cv = {
            ...cvData,
            createdAt: now,
            updatedAt: now,
        };
        const result = await this.cvs.insertOne(cv);
        const createdCV = await this.cvs.findOne({ _id: result.insertedId });
        if (!createdCV) {
            throw new Error('Failed to create CV');
        }
        return this.transformDocument(createdCV);
    }
    async findCVById(id) {
        const cv = await this.cvs.findOne({ _id: new mongodb_1.ObjectId(id) });
        return cv ? this.transformDocument(cv) : null;
    }
    async findCVsByUserId(userId) {
        const cvs = await this.cvs.find({ userId }).toArray();
        return cvs.map(cv => this.transformDocument(cv));
    }
    async updateCV(id, updates) {
        await this.cvs.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } });
        return this.findCVById(id);
    }
    async deleteCV(id) {
        const result = await this.cvs.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return result.deletedCount > 0;
    }
    get versions() {
        return this.db.collection('versions');
    }
    async createVersion(versionData) {
        const version = {
            ...versionData,
            createdAt: new Date(),
        };
        const result = await this.versions.insertOne(version);
        const createdVersion = await this.versions.findOne({ _id: result.insertedId });
        if (!createdVersion) {
            throw new Error('Failed to create version');
        }
        return this.transformDocument(createdVersion);
    }
    async findVersionsByCVId(cvId) {
        const versions = await this.versions.find({ cvId }).toArray();
        return versions.map(version => this.transformDocument(version));
    }
    get shareTokens() {
        return this.db.collection('shareTokens');
    }
    async createShareToken(tokenData) {
        const shareToken = {
            ...tokenData,
            createdAt: new Date(),
        };
        const result = await this.shareTokens.insertOne(shareToken);
        const createdToken = await this.shareTokens.findOne({ _id: result.insertedId });
        if (!createdToken) {
            throw new Error('Failed to create share token');
        }
        return this.transformDocument(createdToken);
    }
    async findShareTokenByToken(token) {
        const shareToken = await this.shareTokens.findOne({ token });
        return shareToken ? this.transformDocument(shareToken) : null;
    }
    async deleteShareToken(token) {
        const result = await this.shareTokens.deleteOne({ token });
        return result.deletedCount > 0;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map