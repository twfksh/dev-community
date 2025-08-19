import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
