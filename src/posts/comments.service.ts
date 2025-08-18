import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comments.schema';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async create(
    author: string,
    postId: string,
    commentData: CreateCommentDto,
  ): Promise<Comment> {
    const newComment = new this.commentModel({
      post: postId,
      author,
      ...commentData,
    });
    return newComment.save();
  }

  async findAll(author: string): Promise<Comment[] | null> {
    return await this.commentModel.find({ author });
  }

  async findOne(author: string, commentId: string): Promise<Comment | null> {
    return await this.commentModel.findOne({ _id: commentId, author });
  }

  async findByPostIdWithAuthorsAggregated(
    author: string,
    postId: string,
  ): Promise<any[]> {
    return await this.commentModel
      .aggregate([
        {
          $match: {
            post: new Types.ObjectId(postId),
            author: new Types.ObjectId(author),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'authorDetails',
          },
        },
        { $unwind: '$authorDetails' },
        {
          $project: {
            _id: 1,
            post: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            authorDetails: {
              _id: '$authorDetails._id',
              name: '$authorDetails.name',
              email: '$authorDetails.email',
            },
          },
        },
      ])
      .exec();
  }

  async update(
    author: string,
    commentId: string,
    commentData: UpdateCommentDto,
  ): Promise<Comment | null> {
    return await this.commentModel.findOneAndUpdate(
      { _id: commentId, author },
      commentData,
      {
        new: true,
      },
    );
  }

  async remove(author: string, commentId: string): Promise<Comment | null> {
    return await this.commentModel.findOneAndDelete({ _id: commentId, author });
  }
}
