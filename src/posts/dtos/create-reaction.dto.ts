import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Reactions } from 'src/posts/enums/reaction.enum';
import { Post } from '../schemas/posts.schema';
import { Comment } from '../schemas/comments.schema';

export class CreateReactionDto {
  @IsMongoId()
  @IsNotEmpty()
  entityId: string;

  @IsEnum({ Post: Post.name, Comment: Comment.name })
  entityType: 'Post' | 'Comment';

  @IsEnum(Reactions)
  type: Reactions;
}
