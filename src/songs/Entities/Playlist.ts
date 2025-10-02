import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Song } from './Song';
import { User } from '../../user/Entities/User';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  /**
   * Each Playlist will have multiple songs
   */
  @OneToMany(() => Song, (song) => song.playlist)
  songs: Song[];
  /**
   * Many Playlist can belong to a single unique user
   */
  @ManyToOne(() => User, (user) => user.playlist)
  user: User | null;
}
