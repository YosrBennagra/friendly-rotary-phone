import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
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
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private client;
    private db;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private transformDocument;
    get users(): Collection<User>;
    createUser(userData: Omit<User, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUser(id: string, updates: Partial<User>): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
    get cvs(): Collection<CV>;
    createCV(cvData: Omit<CV, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<CV>;
    findCVById(id: string): Promise<CV | null>;
    findCVsByUserId(userId: string): Promise<CV[]>;
    updateCV(id: string, updates: Partial<CV>): Promise<CV | null>;
    deleteCV(id: string): Promise<boolean>;
    get versions(): Collection<Version>;
    createVersion(versionData: Omit<Version, '_id' | 'id' | 'createdAt'>): Promise<Version>;
    findVersionsByCVId(cvId: string): Promise<Version[]>;
    get shareTokens(): Collection<ShareToken>;
    createShareToken(tokenData: Omit<ShareToken, '_id' | 'id' | 'createdAt'>): Promise<ShareToken>;
    findShareTokenByToken(token: string): Promise<ShareToken | null>;
    deleteShareToken(token: string): Promise<boolean>;
}
