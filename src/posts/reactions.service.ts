import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction } from './schemas/reactions.schema';
import { Model } from 'mongoose';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { UpdateReactionDto } from './dtos/update-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionMode: Model<Reaction>,
  ) {}

  async create(
    user: string,
    reactionData: CreateReactionDto,
  ): Promise<Reaction> {
    const newReaction = new this.reactionMode({ ...reactionData, user });
    return await newReaction.save();
  }

  async findAll(): Promise<Reaction[]> {
    return await this.reactionMode.find().exec();
  }

  async findByPostId(entityId: string): Promise<Reaction[]> {
    return await this.reactionMode.find({ entityId: entityId }).exec();
  }

  async findByUserId(userId: string): Promise<Reaction[]> {
    return await this.reactionMode.find({ user: userId }).exec();
  }

  async findByUserIdAndPostId(
    userId: string,
    entityId: string,
  ): Promise<Reaction | null> {
    return await this.reactionMode
      .findOne({ user: userId, entityId: entityId })
      .exec();
  }

  async update(
    userId: string,
    entityId: string,
    reactionData: UpdateReactionDto,
  ): Promise<Reaction | null> {
    return await this.reactionMode.findOneAndUpdate(
      { user: userId, entityId: entityId },
      reactionData,
      { new: true },
    );
  }

  async remove(userId: string, entityId: string): Promise<Reaction | null> {
    return await this.reactionMode
      .findOneAndDelete({ user: userId, entityId: entityId })
      .exec();
  }
}
