import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../user/Entities/User';
import { Artist } from '../songs/Entities/Artist';
import { Song } from '../songs/Entities/Song';
import { Playlist } from '../songs/Entities/Playlist';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'songs_db',
  entities: [User, Artist, Song, Playlist],
  synchronize: true,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
