import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from '../songs/Entities/Playlist';
import { Repository } from 'typeorm';
import { Song } from '../songs/Entities/Song';
import { User } from '../songs/Entities/User';
import { CreatePlayListDto } from './Dtos/create-playlist-dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPlaylist(createPlayListDto: CreatePlayListDto) {
    const playlist = new Playlist();
    playlist.name = createPlayListDto.name;

    const songs = await this.songRepository.findByIds(createPlayListDto.songs);
    playlist.songs = songs;

    const user = await this.userRepository.findOneBy({
      id: createPlayListDto.user,
    });
    playlist.user = user;
    return await this.playlistRepository.save(playlist);
  }
}
