import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './Dtos/create-song.dto';
import { PaginationDto } from './Dtos/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PaginatedSongsResponse } from './Dtos/paginated-songs-response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOkResponse({ type: PaginatedSongsResponse })
  findAll(@Query() paginationDto: PaginationDto, @Req() req) {
    console.log(req.headers.authorization, '---------------->');
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
