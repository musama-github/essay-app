import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultProcessor } from './default.processor';
import { User } from 'src/entities/user.entity';
import bullConfig from 'src/config/bull.config';
import { EssayModule } from 'src/essay/essay.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    EssayModule,
    UsersModule,
    BullModule.forRootAsync({
      useFactory: bullConfig,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [DefaultProcessor],
})
export class JobsModule {}
