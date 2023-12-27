import { IsOptional, IsString, MinLength } from 'class-validator';

export class Paggination {
  @IsOptional()
  public limit?: number = 10;

  @IsOptional()
  public page?: number = 1;

  @IsString()
  @MinLength(3)
  @IsOptional()
  public search?: string;
}
