import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getAllComments() {
    return this.commentsService.findAll();
  }

  @Post('comments/:id')
  createComment(@Param('id') id: string, @Body() commentDto: CreateCommentDto) {
    return this.commentsService.create(id, commentDto);
  }

  @Get('comments/:id')
  getCommentsForPost(@Param('id') id: string) {
    return this.commentsService.findByPostId(id);
  }

  @Get(':id')
  getCommentById(@Param('id') commentId: string) {
    return this.commentsService.findOne(commentId);
  }

  @Patch(':id')
  updateComment(
    @Param('id') commentId: string,
    @Body() commentDto: CreateCommentDto,
  ) {
    return this.commentsService.update(commentId, commentDto);
  }

  @Delete(':id')
  deleteComment(@Param('id') commentId: string) {
    return this.commentsService.remove(commentId);
  }
}
