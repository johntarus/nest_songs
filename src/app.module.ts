import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { SongsController } from './songs/songs.controller';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/Entities/Song';
import { User } from './songs/Entities/User';
import { Artist } from './songs/Entities/Artist';
import { PlaylistModule } from './playlist/playlist.module';
import { Playlist } from './songs/Entities/Playlist';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'songs_db',
      entities: [Song, Artist, User, Playlist],
      synchronize: true,
    }),
    SongsModule,
    PlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly dataSource: DataSource) {
    console.log(dataSource.driver.database, 'used database---->');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
