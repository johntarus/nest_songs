import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlayListDto } from './Dtos/create-playlist-dto';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlayListDto) {
    return this.playlistService.createPlaylist(createPlaylistDto);
  }
}
