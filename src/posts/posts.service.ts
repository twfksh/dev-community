import { Injectable } from '@nestjs/common';
import { Post } from './schemas/posts.schema';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostRepository } from './posts.repository';
import { Mapper } from 'src/helpers/dto-mapper.helper';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) { }

  async create(post: CreatePostDto): Promise<Post> {
    return await this.postRepository.create(Mapper.toEntity(post, Post));
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postRepository.findById(id);
  }

  async update(id: string, post: UpdatePostDto): Promise<Post | null> {
    return await this.postRepository.update(id, Mapper.toEntity(post, Post));
  }

  async remove(id: string): Promise<Post | null> {
    return await this.postRepository.delete(id);
  }
}
