import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comments.schema';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  providers: [PostsService, CommentsService],
  controllers: [PostsController, CommentsController],
})
export class PostsModule {}
