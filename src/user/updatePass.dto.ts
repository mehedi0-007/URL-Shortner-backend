import { IsString, MinLength } from 'class-validator';

export class UpdatePassDto {
  @IsString()
  currentPass: string;

  @IsString()
  @MinLength(8)
  newPass: string;
}
