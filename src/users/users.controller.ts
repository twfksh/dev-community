import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash, genSalt } from 'bcrypt';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    user.password = await hash(user.password, await genSalt());
    return await this.usersService.create(user);
  }

  @Get()
  async getUsers() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    if (!id.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      throw new Error('Invalid ID');
    }
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() user: CreateUserDto) {
    return await this.usersService.update(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
