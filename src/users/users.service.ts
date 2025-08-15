import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersModel: Model<User>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.usersModel(user);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.usersModel.find().exec();
  }

  async findOne(sub: string): Promise<User | null> {
    return await this.usersModel
      .findOne({ $or: [{ id: sub }, { email: sub }] })
      .exec();
  }

  async update(id: string, user: User): Promise<User | null> {
    return await this.usersModel
      .findByIdAndUpdate(id, user, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return await this.usersModel.findByIdAndDelete(id).exec();
  }
}
