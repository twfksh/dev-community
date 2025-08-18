import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comments.schema';
import { CommentsController } from './comments.controller';
import { Reaction, ReactionSchema } from './schemas/reactions.schema';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    AuthModule,
  ],
  providers: [PostsService, CommentsService, ReactionsService],
  controllers: [PostsController, CommentsController, ReactionsController],
})
export class PostsModule {}
