import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/posts.schema';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(author: string, post: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel({ ...post, author });
    return await createdPost.save();
  }

  async findAll(author: string): Promise<Post[]> {
    return await this.postModel.find({ author }).exec();
  }

  async findOne(id: string, author: string): Promise<any> {
    return await this.postModel
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
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
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'post',
            as: 'comments',
          },
        },
        { $unwind: { path: '$comments', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'comments.author',
            foreignField: '_id',
            as: 'comments.authorDetails',
          },
        },
        {
          $unwind: {
            path: '$comments.authorDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            content: { $first: '$content' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            authorDetails: { $first: '$authorDetails' },
            comments: {
              $push: {
                _id: '$comments._id',
                content: '$comments.content',
                createdAt: '$comments.createdAt',
                updatedAt: '$comments.updatedAt',
                authorDetails: {
                  _id: '$comments.authorDetails._id',
                  name: '$comments.authorDetails.name',
                  email: '$comments.authorDetails.email',
                },
              },
            },
          },
        },
      ])
      .exec();
  }

  async update(
    id: string,
    author: string,
    post: CreatePostDto,
  ): Promise<Post | null> {
    return await this.postModel
      .findOneAndUpdate({ _id: id, author }, post, { new: true })
      .exec();
  }

  async remove(id: string, author: string): Promise<Post | null> {
    return await this.postModel.findOneAndDelete({ _id: id, author }).exec();
  }
}
