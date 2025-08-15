import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getAllComments() {
    return this.commentsService.findAll();
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
