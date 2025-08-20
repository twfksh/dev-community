import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
