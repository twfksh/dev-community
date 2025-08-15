import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
