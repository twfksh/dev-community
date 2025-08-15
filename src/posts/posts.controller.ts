import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('api/posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  // static and nested routes
  @Get('comments')
  getAllComments() {
    return this.commentsService.findAll();
  }

  @Get('comments/:id')
  getCommentById(@Param('id') commentId: string) {
    return this.commentsService.findOne(commentId);
  }

  @Patch('comments/:id')
  updateComment(@Param('id') commentId: string, commentDto: CreateCommentDto) {
    return this.commentsService.update(commentId, commentDto);
  }

  @Delete('comments/:id')
  deleteComment(@Param('id') commentId: string) {
    return this.commentsService.remove(commentId);
  }

  @Post(':id/comments')
  createComment(@Param('id') id: string, commentDto: CreateCommentDto) {
    return this.commentsService.create(id, commentDto);
  }

  @Get(':id/comments')
  getCommentsForPost(@Param('id') id: string) {
    return this.commentsService.findByPostId(id);
  }

  // post routes
  @Post()
  createPost(postDto: CreatePostDto) {
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
  updatePost(@Param('id') id: string, postDto: CreatePostDto) {
    return this.postsService.update(id, postDto);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
