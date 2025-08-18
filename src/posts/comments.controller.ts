import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  createComment(
    @User('sub') userId: string,
    @Param('postId') postId: string,
    @Body() commentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(userId, postId, commentDto);
  }

  @Get()
  getComments(
    @User('sub') userId: string,
    @Query() query: { postId?: string; commentId?: string },
  ) {
    if (query.postId && !query.commentId) {
      return this.commentsService.findByPostIdWithAuthorsAggregated(
        userId,
        query.postId,
      );
    }
    if (query.commentId && !query.postId) {
      return this.commentsService.findOne(userId, query.commentId);
    }

    return this.commentsService.findAll(userId);
  }

  @Patch(':id')
  updateComment(
    @User('sub') userId: string,
    @Param('id') commentId: string,
    @Body() commentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(userId, commentId, commentDto);
  }

  @Delete(':id')
  deleteComment(@User('sub') userId: string, @Param('id') commentId: string) {
    return this.commentsService.remove(userId, commentId);
  }
}
