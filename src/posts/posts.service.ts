import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/posts.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(post: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(post);
    return await createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return await this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post | null> {
    return await this.postModel.findById(id).exec();
  }

  async update(id: string, post: CreatePostDto): Promise<Post | null> {
    return await this.postModel
      .findByIdAndUpdate(id, post, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Post | null> {
    return await this.postModel.findByIdAndDelete(id).exec();
  }
}
