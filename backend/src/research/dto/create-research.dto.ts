import { IsString, IsNotEmpty } from 'class-validator';

export class CreateResearchDto {
  @IsString()
  @IsNotEmpty()
  problemId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}