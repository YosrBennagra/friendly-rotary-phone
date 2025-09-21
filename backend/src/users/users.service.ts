import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findProfile(userId: string) {
    const user = await this.database.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove password from user object
    const { password: _, ...userProfile } = user;
    return userProfile;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.database.updateUser(userId, {
      ...updateUserDto,
      updatedAt: new Date(),
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    // Remove password from user object
    const { password: _, ...userProfile } = updatedUser;
    return userProfile;
  }

  async deleteAccount(userId: string) {
    const deleted = await this.database.deleteUser(userId);

    if (!deleted) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Account deleted successfully' };
  }
}