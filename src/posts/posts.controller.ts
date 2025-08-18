import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() postDto: CreatePostDto) {
    return this.postsService.create(postDto);
  }

  @Get()
  getPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() postDto: CreatePostDto) {
    return this.postsService.update(id, postDto);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
