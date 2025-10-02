import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from '../songs/Entities/Playlist';
import { Song } from '../songs/Entities/Song';
import { User } from '../songs/Entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  providers: [PlaylistService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
