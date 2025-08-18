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
import { ReactionsService } from './reactions.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { User } from 'src/decorators/user.decorator';
import { UpdateReactionDto } from './dtos/update-reaction.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('api/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  createReaction(
    @User('sub') userId: string,
    @Query() query: CreateReactionDto,
  ) {
    return this.reactionsService.create(userId, query);
  }

  @Patch(':entityId')
  updateReaction(
    @User('sub') userId: string,
    @Param('entityId') entityId: string,
    @Body() reactionDto: UpdateReactionDto,
  ) {
    return this.reactionsService.update(userId, entityId, reactionDto);
  }

  @Get()
  getReactions(@Query('entityId') entityId: string) {
    if (entityId) {
      return this.reactionsService.findByPostId(entityId);
    }
    return this.reactionsService.findAll();
  }

  @Delete()
  removeReaction(
    @User('sub') userId: string,
    @Query('entityId') entityId: string,
  ) {
    return this.reactionsService.remove(userId, entityId);
  }
}
