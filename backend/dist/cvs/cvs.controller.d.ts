import { CvsService } from './cvs.service';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto';
export declare class CvsController {
    private readonly cvsService;
    constructor(cvsService: CvsService);
    create(req: any, createCvDto: CreateCvDto): Promise<import("../database/database.service").CV>;
    findAll(req: any): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, req: any, updateCvDto: UpdateCvDto): Promise<import("../database/database.service").CV | null>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    duplicate(id: string, req: any): Promise<import("../database/database.service").CV>;
    updateVisibility(id: string, req: any, body: {
        isPublic: boolean;
    }): Promise<import("../database/database.service").CV | null>;
}
