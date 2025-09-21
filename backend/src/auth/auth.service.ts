import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.database.findUserByEmail(email);

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.database.createUser({
      email,
      name,
      password: hashedPassword,
      settings: {
        theme: 'light',
        notifications: true,
      },
    });

    // Create default CV for new user
    await this.database.createCV({
      userId: user.id!,
      title: 'My CV',
      slug: `my-cv-${Date.now()}`,
      template: 'CLASSIC',
      isPublic: false,
      theme: {
        fontFamily: 'Inter',
        accentColor: '#3b82f6',
        spacing: 'normal',
        showIcons: true,
        compactMode: false,
      },
      data: {
        header: {
          fullName: name,
          title: '',
          email: email,
          phone: '',
          location: '',
          website: '',
          github: '',
          linkedin: '',
          avatarUrl: '',
          summaryRichText: '',
        },
        experience: [],
        education: [],
        projects: [],
        skills: { groups: [] },
        certifications: [],
        languages: [],
        interests: [],
        customSections: [],
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: this.generateToken(user.id!, user.email),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.database.findUserByEmail(email);

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: this.generateToken(user.id!, user.email),
    };
  }

  async validateUser(userId: string) {
    const user = await this.database.findUserById(userId);

    if (!user) {
      return null;
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}