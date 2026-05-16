import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePassDto {
  @IsOptional()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
