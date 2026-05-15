import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './createUser.dto';
import { UpdatePassDto } from './updatePass.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  userCreate(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserbyID(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  changePassword(@Param('id') id: string, @Body() dto: UpdatePassDto) {
    return this.userService.changePass(id, dto);
  }

  @Delete('id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
