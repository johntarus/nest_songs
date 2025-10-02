import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './Dtos/create-song.dto';
import { PaginationDto } from './Dtos/pagination.dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}
  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.songsService.findAll(paginationDto);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.findById(id);
  }

  @Put(':id')
  updateSong(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: CreateSongDto,
  ) {
    return this.songsService.updateSong(id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.remove(id);
  }
}
