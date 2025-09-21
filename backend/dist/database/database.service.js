"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const fs = __importStar(require("fs"));
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
        const tlsInsecure = this.configService.get('MONGODB_TLS_INSECURE') === '1';
        const caFile = this.configService.get('MONGODB_CA_FILE');
        const isSrv = mongoUri.startsWith('mongodb+srv://');
        const mongoOptions = {
            serverApi: mongodb_1.ServerApiVersion.v1,
            ...(isSrv ? { tls: true } : {}),
            ...(caFile && fs.existsSync(caFile) ? { tlsCAFile: caFile } : {}),
            ...(tlsInsecure ? { tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true } : {}),
            retryWrites: true,
            writeConcern: { w: 'majority' },
            readPreference: 'primary',
            appName: 'cv-builder-backend',
            serverSelectionTimeoutMS: 20000,
        };
        this.client = new mongodb_1.MongoClient(mongoUri, mongoOptions);
        try {
            await this.client.connect();
        }
        catch (err) {
            const hint = `\nIf you're using MongoDB Atlas on Windows and see TLS errors, try setting MONGODB_TLS_INSECURE=1 in backend/.env or provide a CA via MONGODB_CA_FILE.`;
            console.error('❌ MongoDB connection failed:', err?.message || err);
            throw new Error(`MongoDB connection failed. ${hint}`);
        }
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