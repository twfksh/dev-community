import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction } from './schemas/reactions.schema';
import { Model } from 'mongoose';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { UpdateReactionDto } from './dtos/update-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
  ) { }

  async create(
    user: string,
    reactionData: CreateReactionDto,
  ): Promise<Reaction> {
    const newReaction = await this.reactionModel.create({ ...reactionData, user });
    return newReaction;
  }

  async findAll(): Promise<Reaction[]> {
    return await this.reactionModel.find().exec();
  }

  async findByEntityId(entityId: string): Promise<Reaction[]> {
    return await this.reactionModel.find({ entityId: entityId }).exec();
  }

  async findByUserId(userId: string): Promise<Reaction[]> {
    return await this.reactionModel.find({ user: userId }).exec();
  }

  async findByUserIdAndPostId(
    userId: string,
    entityId: string,
  ): Promise<Reaction | null> {
    return await this.reactionModel
      .findOne({ user: userId, entityId: entityId })
      .exec();
  }

  async update(
    userId: string,
    entityId: string,
    reactionData: UpdateReactionDto,
  ): Promise<Reaction | null> {
    return await this.reactionModel.findOneAndUpdate(
      { user: userId, entityId: entityId },
      reactionData,
      { new: true },
    );
  }

  async remove(userId: string, entityId: string): Promise<Reaction | null> {
    return await this.reactionModel
      .findOneAndDelete({ user: userId, entityId: entityId });
  }
}
