import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    AuthModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
