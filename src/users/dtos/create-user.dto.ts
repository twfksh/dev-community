import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExperienceDto {
  @IsString()
  role: string;

  @IsString()
  company: string;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['user', 'admin'], { message: 'Invalid user type' })
  role?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExperienceDto)
  experiances?: CreateExperienceDto[];
}
