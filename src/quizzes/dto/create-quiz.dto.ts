import { IsString, IsNotEmpty, IsArray, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '@prisma/client';

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  options?: any;

  @IsOptional()
  answer?: any;
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

