import { Module } from '@nestjs/common';
import { EssayService } from './essay.service';
import { EssayController } from './essay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Essay } from 'src/entities/essay.entity';
import { UsersModule } from 'src/users/users.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([Essay]),
    UsersModule,
    BullModule.registerQueue({
      name: 'default',
    }),
  ],
  providers: [EssayService],
  controllers: [EssayController],
  exports: [EssayService],
})
export class EssayModule {}
