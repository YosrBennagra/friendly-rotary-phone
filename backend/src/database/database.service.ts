import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db, Collection, ObjectId, ServerApiVersion } from 'mongodb';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

export interface User {
  _id?: ObjectId;
  id?: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  settings?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CV {
  _id?: ObjectId;
  id?: string;
  userId: string;
  title: string;
  slug: string;
  isPublic: boolean;
  template: 'CLASSIC' | 'MODERN' | 'COMPACT';
  theme?: any;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Version {
  _id?: ObjectId;
  id?: string;
  cvId: string;
  label: string;
  snapshot: any;
  createdAt: Date;
}

export interface ShareToken {
  _id?: ObjectId;
  id?: string;
  cvId: string;
  token: string;
  createdAt: Date;
  expiresAt?: Date;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const mongoUri = this.configService.get<string>('MONGODB_URI');
    const dbName = this.configService.get<string>('DATABASE_NAME');
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    if (!dbName) {
      throw new Error('DATABASE_NAME is not defined in environment variables');
    }
    
    // Build TLS-aware options. Some Windows/Node 22 environments require relaxing TLS verification
    const tlsInsecure = this.configService.get<string>('MONGODB_TLS_INSECURE') === '1';
    const caFile = this.configService.get<string>('MONGODB_CA_FILE');

    const isSrv = mongoUri.startsWith('mongodb+srv://');
    const mongoOptions: ConstructorParameters<typeof MongoClient>[1] = {
      serverApi: ServerApiVersion.v1,
      // Use TLS for SRV strings by default (Atlas), allow plain mongodb:// to skip TLS
      ...(isSrv ? { tls: true } : {}),
      // If you provide a custom CA, include it
      ...(caFile && fs.existsSync(caFile) ? { tlsCAFile: caFile } : {}),
      // Only set tlsAllowInvalidCertificates if explicitly requested
      ...(tlsInsecure ? { tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true } : {}),
      retryWrites: true,
      writeConcern: { w: 'majority' },
      readPreference: 'primary',
      appName: 'cv-builder-backend',
      // Reasonable selection timeout to fail fast with clear error
      serverSelectionTimeoutMS: 20000,
    };

    this.client = new MongoClient(mongoUri, mongoOptions);
    try {
      await this.client.connect();
    } catch (err) {
      // Augment error with guidance for Windows OpenSSL/TLS quirks
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

  // Helper method to convert MongoDB _id to string id
  private transformDocument<T extends { _id?: ObjectId; id?: string }>(doc: T | null): T | null {
    if (!doc) return null;
    
    const transformed = { ...doc };
    if (transformed._id) {
      transformed.id = transformed._id.toString();
      delete transformed._id;
    }
    return transformed;
  }

  // User operations
  get users(): Collection<User> {
    return this.db.collection<User>('users');
  }

  async createUser(userData: Omit<User, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
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
    
    return this.transformDocument(createdUser) as User;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.users.findOne({ _id: new ObjectId(id) });
    return user ? this.transformDocument(user) : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.users.findOne({ email });
    return user ? this.transformDocument(user) : null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    await this.users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return this.findUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.users.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // CV operations
  get cvs(): Collection<CV> {
    return this.db.collection<CV>('cvs');
  }

  async createCV(cvData: Omit<CV, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<CV> {
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
    
    return this.transformDocument(createdCV) as CV;
  }

  async findCVById(id: string): Promise<CV | null> {
    const cv = await this.cvs.findOne({ _id: new ObjectId(id) });
    return cv ? this.transformDocument(cv) : null;
  }

  async findCVsByUserId(userId: string): Promise<CV[]> {
    const cvs = await this.cvs.find({ userId }).toArray();
    return cvs.map(cv => this.transformDocument(cv) as CV);
  }

  async updateCV(id: string, updates: Partial<CV>): Promise<CV | null> {
    await this.cvs.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return this.findCVById(id);
  }

  async deleteCV(id: string): Promise<boolean> {
    const result = await this.cvs.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Version operations
  get versions(): Collection<Version> {
    return this.db.collection<Version>('versions');
  }

  async createVersion(versionData: Omit<Version, '_id' | 'id' | 'createdAt'>): Promise<Version> {
    const version = {
      ...versionData,
      createdAt: new Date(),
    };
    
    const result = await this.versions.insertOne(version);
    const createdVersion = await this.versions.findOne({ _id: result.insertedId });
    
    if (!createdVersion) {
      throw new Error('Failed to create version');
    }
    
    return this.transformDocument(createdVersion) as Version;
  }

  async findVersionsByCVId(cvId: string): Promise<Version[]> {
    const versions = await this.versions.find({ cvId }).toArray();
    return versions.map(version => this.transformDocument(version) as Version);
  }

  // ShareToken operations
  get shareTokens(): Collection<ShareToken> {
    return this.db.collection<ShareToken>('shareTokens');
  }

  async createShareToken(tokenData: Omit<ShareToken, '_id' | 'id' | 'createdAt'>): Promise<ShareToken> {
    const shareToken = {
      ...tokenData,
      createdAt: new Date(),
    };
    
    const result = await this.shareTokens.insertOne(shareToken);
    const createdToken = await this.shareTokens.findOne({ _id: result.insertedId });
    
    if (!createdToken) {
      throw new Error('Failed to create share token');
    }
    
    return this.transformDocument(createdToken) as ShareToken;
  }

  async findShareTokenByToken(token: string): Promise<ShareToken | null> {
    const shareToken = await this.shareTokens.findOne({ token });
    return shareToken ? this.transformDocument(shareToken) : null;
  }

  async deleteShareToken(token: string): Promise<boolean> {
    const result = await this.shareTokens.deleteOne({ token });
    return result.deletedCount > 0;
  }
}