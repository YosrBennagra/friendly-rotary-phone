import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private readonly database;
    constructor(database: DatabaseService);
    findProfile(userId: string): Promise<{
        _id?: import("bson").ObjectId;
        id?: string;
        name: string;
        email: string;
        image?: string;
        settings?: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<{
        _id?: import("bson").ObjectId;
        id?: string;
        name: string;
        email: string;
        image?: string;
        settings?: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
