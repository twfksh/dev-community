import { Injectable } from '@nestjs/common';
import { User } from './schemas/users.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRepository } from './users.repository';
import { Mapper } from 'src/helpers/dto-mapper.helper';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) { }

  async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.create(Mapper.toEntity(user, User));
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    return await this.userRepository.update(id, Mapper.toEntity(user, User));
  }

  async remove(id: string): Promise<User | null> {
    return await this.userRepository.delete(id);
  }
}
