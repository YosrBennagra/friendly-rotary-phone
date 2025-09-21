import { DatabaseService } from '../database/database.service';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto';
export declare class CvsService {
    private readonly database;
    constructor(database: DatabaseService);
    findAllByUser(userId: string): Promise<{
        id: string | undefined;
        title: string;
        slug: string;
        isPublic: boolean;
        template: "CLASSIC" | "MODERN" | "COMPACT";
        createdAt: Date;
        updatedAt: Date;
        versions: {
            id: string | undefined;
            createdAt: Date;
        }[];
    }[]>;
    findOne(id: string, userId: string): Promise<{
        versions: {
            id: string | undefined;
            label: string;
            createdAt: Date;
        }[];
        _id?: import("bson").ObjectId;
        id?: string;
        userId: string;
        title: string;
        slug: string;
        isPublic: boolean;
        template: "CLASSIC" | "MODERN" | "COMPACT";
        theme?: any;
        data: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(userId: string, createCvDto: CreateCvDto): Promise<import("../database/database.service").CV>;
    update(id: string, userId: string, updateCvDto: UpdateCvDto): Promise<import("../database/database.service").CV | null>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    duplicate(id: string, userId: string): Promise<import("../database/database.service").CV>;
    updateVisibility(id: string, userId: string, isPublic: boolean): Promise<import("../database/database.service").CV | null>;
    private generateSlug;
}
