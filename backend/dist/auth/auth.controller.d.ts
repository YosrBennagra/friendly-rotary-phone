import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, MagicLinkDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    sendMagicLink(magicLinkDto: MagicLinkDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
    refreshToken(body: {
        token: string;
    }): Promise<{
        token: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
