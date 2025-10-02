import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './Entities/Song';
import { Repository } from 'typeorm';
import { CreateSongDto } from './Dtos/create-song.dto';
import { UpdateSongDto } from './Dtos/UpdateSongDto';
import { PaginationDto } from './Dtos/pagination.dto';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
  ) {}

  async create(songDto: CreateSongDto) {
    const song = new Song();
    song.title = songDto.title;
    song.artists = songDto.artists;
    song.duration = songDto.duration;
    song.releasedDate = songDto.releasedDate;
    song.lyrics = songDto.lyrics;
    return await this.songRepository.save(song);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const offset = (page - 1) * limit;

    const [songs, total] = await this.songRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return {
      songs,
      meta: {
        totalItems: total,
        itemCount: songs.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findById(id: number) {
    const song = await this.songRepository.findOneBy({ id: id });
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }

  async updateSong(id: number, updateSongDto: UpdateSongDto) {
    return await this.songRepository.update(id, updateSongDto);
  }

  async remove(id: number) {
    return await this.songRepository.delete(id);
  }
}
