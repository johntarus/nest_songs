import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from '../../songs/Entities/Artist';
import { Playlist } from '../../songs/Entities/Playlist';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  // @Column({ nullable: true })
  // phone?: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string | null;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlist: Playlist[];
}
