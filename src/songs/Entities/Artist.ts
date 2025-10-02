import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Song } from './Song';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.artist)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];
}
