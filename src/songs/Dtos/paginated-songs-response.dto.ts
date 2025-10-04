import { ApiProperty } from '@nestjs/swagger';
import { Song } from '../Entities/Song';

export class PaginatedSongsResponse {
  @ApiProperty({ type: [Song] })
  songs: Song[];

  @ApiProperty({
    example: {
      totalItems: 100,
      itemCount: 10,
      itemsPerPage: 10,
      totalPages: 10,
      currentPage: 1,
    },
  })
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
