import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './createUser.dto';
import { UpdatePassDto } from './updatePass.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  userCreate(@Body() dto: CreateUserDto): Promise<any> {
    return this.userService.createUser(dto);
  }

  @Get(':id')
  getUserbyID(@Param('id') id: string): Promise<CreateUserDto> {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  changePassword(@Param('id') id: string, @Body() dto: UpdatePassDto) {
    return this.userService.changePass(id, dto);
  }

  @Delete('id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
