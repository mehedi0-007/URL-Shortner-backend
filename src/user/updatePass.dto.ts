import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  currentPass!: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  newPass!: string;
}
