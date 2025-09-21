import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly database;
    private readonly jwtService;
    constructor(database: DatabaseService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            _id?: import("bson").ObjectId;
            id?: string;
            name: string;
            email: string;
            image?: string;
            settings?: any;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            _id?: import("bson").ObjectId;
            id?: string;
            name: string;
            email: string;
            image?: string;
            settings?: any;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    validateUser(userId: string): Promise<{
        _id?: import("bson").ObjectId;
        id?: string;
        name: string;
        email: string;
        image?: string;
        settings?: any;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    private generateToken;
}
