import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EssayService } from 'src/essay/essay.service';
@Processor('default')
export class DefaultProcessor extends WorkerHost {
  constructor(private essayService: EssayService) {
    super();
  }
  async process(job: Job) {
    switch (job.name) {
      case 'essay_score': {
        console.log('Processing job:', job.id, 'with data:', job.data);
        console.log(await this.essayService.scoreAllEssays());
        console.log('Job processed:', job.id);
      }
    }
  }
}
