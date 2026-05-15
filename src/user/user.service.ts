import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './createUser.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePassDto } from './updatePass.dto';

@Injectable()
export class UserService {
  constructor(private Prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<any> {
    const foundUser = await this.Prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (foundUser) throw new ConflictException('This E-mail already exists');

    const hashedPass = await bcrypt.hash(dto.password, 11);

    const data = await this.Prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPass,
      },
    });

    if (!data) throw new InternalServerErrorException('Operation failed');

    return {
      success: true,
      message: 'User created successfully',
    };
  }

  async getUser(id: string): Promise<any> {
    const userData = await this.Prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        urls: true,
      },
    });

    if (!userData) throw new NotFoundException('User not found');

    return {
      success: true,
      message: 'User found',
      data: userData,
    };
  }

  async changePass(userid: string, dto: UpdatePassDto) {
    const userData = await this.Prisma.user.findUnique({
      where: { id: userid },
    });

    if (!userData) throw new NotFoundException('User not found ');

    const updates: { name?: string; password?: string } = {};
    const wantsPassword = Boolean(dto.currentPass || dto.newPass);

    if (wantsPassword) {
      if (!dto.currentPass || !dto.newPass) {
        throw new BadRequestException(
          'Both currentPass and newPass are required',
        );
      }

      const passMatch = await bcrypt.compare(
        dto.currentPass,
        userData.password,
      );

      if (!passMatch) throw new UnauthorizedException('Password did not match');

      updates.password = await bcrypt.hash(dto.newPass, 10);
    }

    if (dto.name) {
      updates.name = dto.name;
    }

    if (Object.keys(updates).length === 0) {
      throw new BadRequestException('No update fields provided');
    }

    await this.Prisma.user.update({
      where: { id: userid },
      data: updates,
    });

    return {
      success: true,
      message: wantsPassword
        ? 'Password updated successfully'
        : 'Profile updated successfully',
    };
  }

  async deleteUser(userId: string): Promise<string> {
    const delUser = await this.Prisma.user.delete({
      where: { id: userId },
    });

    if (!delUser) throw new NotFoundException('User not found');

    return 'User Deleted ';
  }
}
