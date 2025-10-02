import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from './Artist';
import { Playlist } from './Playlist';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlist: Playlist[];
}
