import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateReactionDto {
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsMongoId()
  @IsNotEmpty()
  entityId: string;

  @IsEnum(['Post', 'Comment'])
  entityType: 'Post' | 'Comment';

  @IsEnum(['like', 'dislike', 'love', 'angry', 'sad'])
  type: 'like' | 'dislike' | 'love' | 'angry' | 'sad';
}
