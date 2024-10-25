import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Essay } from 'src/entities/essay.entity';
import { UsersService } from 'src/users/users.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class EssayService {
  constructor(
    @InjectRepository(Essay) private essayRepository: Repository<Essay>,
    @InjectQueue('default') private defaultQueue: Queue,
    private userService: UsersService,
  ) {}

  private calculateScore(wordCount: number): number {
    if (wordCount > 1000) return 10;
    if (wordCount > 500) return 5;
    return 1;
  }

  async createEssay(
    userId: number,
    title: string,
    body: string,
  ): Promise<Essay> {
    const user = await this.userService.findOneByIdWithEssay(userId);
    if (user.essay) {
      throw new ConflictException('User already has an essay');
    }
    const newEssay = this.essayRepository.create({
      user,
      title,
      body,
    });
    return await this.essayRepository.save(newEssay);
  }

  async getAllEssays() {
    return await this.essayRepository.find();
  }

  async getEssay(userId: number) {
    const user = await this.userService.findOneById(userId);
    return await this.essayRepository.findBy({ user });
  }

  async scoreAllEssays() {
    const essays = await this.getAllEssays();
    for (const essay of essays) {
      const wordCount = essay.body.split(/\s+/).length;
      const score = this.calculateScore(wordCount);
      essay.score = score;
      await this.essayRepository.save(essay);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async essayScoringProducer() {
    await this.defaultQueue.add('essay_score', {});
  }
}
