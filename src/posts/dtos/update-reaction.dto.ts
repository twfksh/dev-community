import { IsEnum } from 'class-validator';
import { Reactions } from '../enums/reaction.enum';

export class UpdateReactionDto {
  @IsEnum(Reactions)
  type: string;
}
