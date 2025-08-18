import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthPayload } from 'src/types/auth-payload';

@UseGuards(AuthGuard, RolesGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  async getUsers() {
    return await this.usersService.findAll();
  }

  @Get('profile')
  async getProfile(@User() user: AuthPayload) {
    return await this.usersService.findOne(user.email);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    if (!id.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      throw new Error('Invalid ID');
    }
    return await this.usersService.findOne(id);
  }

  @Patch()
  async updateProfile(
    @User() user: AuthPayload,
    @Body() userDto: CreateUserDto,
  ) {
    return await this.usersService.update(user.sub, userDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() user: CreateUserDto) {
    return await this.usersService.update(id, user);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
