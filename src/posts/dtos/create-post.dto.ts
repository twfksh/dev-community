import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  // IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  // @IsMongoId()
  // @IsNotEmpty()
  // author: string;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  tags?: string[];
}
