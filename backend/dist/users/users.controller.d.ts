import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        _id?: import("bson").ObjectId;
        id?: string;
        name: string;
        email: string;
        image?: string;
        settings?: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
        _id?: import("bson").ObjectId;
        id?: string;
        name: string;
        email: string;
        image?: string;
        settings?: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
}
