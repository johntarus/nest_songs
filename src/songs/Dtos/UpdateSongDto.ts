import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly artists: string[];

  @IsDate()
  @IsOptional()
  readonly releasedDate: Date;

  @IsDate()
  @IsOptional()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
