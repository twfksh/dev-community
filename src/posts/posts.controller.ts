import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@UseGuards(AuthGuard, RolesGuard)
@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  createPost(@User('sub') userId: string, @Body() postDto: CreatePostDto) {
    return this.postsService.create(userId, postDto);
  }

  @Get()
  getPosts(@User('sub') userId: string) {
    return this.postsService.findAll(userId);
  }

  @Get(':id')
  getPost(@User('sub') userId: string, @Param('id') id: string) {
    return this.postsService.findOne(id, userId);
  }

  @Patch(':id')
  updatePost(
    @User('sub') userId: string,
    @Param('id') id: string,
    @Body() postDto: CreatePostDto,
  ) {
    return this.postsService.update(id, userId, postDto);
  }

  @Delete(':id')
  deletePost(@User('sub') userId: string, @Param('id') id: string) {
    return this.postsService.remove(id, userId);
  }
}
