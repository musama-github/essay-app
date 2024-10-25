import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EssayModule } from './essay/essay.module';
import { JobsModule } from './jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';

import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';
import jwtConfig from './config/jwt.config';
import jwtRefreshConfig from './config/jwt.refresh.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig, dbConfigProduction, jwtConfig, jwtRefreshConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_env === 'production' ? dbConfigProduction : dbConfig,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    EssayModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
