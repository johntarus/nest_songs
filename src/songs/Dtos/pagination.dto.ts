import { IsOptional, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page: number = 1;
}
