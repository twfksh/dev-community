import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comments.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async create(
    postId: string,
    commentData: CreateCommentDto,
  ): Promise<Comment> {
    const newComment = new this.commentModel({
      post: postId,
      ...commentData,
    });
    return newComment.save();
  }

  async findAll(): Promise<Comment[] | null> {
    return await this.commentModel.find();
  }

  async findOne(commentId: string): Promise<Comment | null> {
    return await this.commentModel.findById(commentId);
  }

  async findByPostId(postId: string): Promise<Comment[] | null> {
    return await this.commentModel.find({ post: postId });
  }

  async update(
    commentId: string,
    commentData: UpdateCommentDto,
  ): Promise<Comment | null> {
    return await this.commentModel.findByIdAndUpdate(commentId, commentData, {
      new: true,
    });
  }

  async remove(commentId: string): Promise<Comment | null> {
    return await this.commentModel.findByIdAndDelete(commentId);
  }
}
