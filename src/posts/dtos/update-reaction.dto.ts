import { IsEnum } from 'class-validator';

export class UpdateReactionDto {
  @IsEnum(['like', 'dislike', 'love', 'angry', 'sad'])
  type: 'like' | 'dislike' | 'love' | 'angry' | 'sad';
}
