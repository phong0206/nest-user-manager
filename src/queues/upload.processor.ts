import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('video_processing')
export class VideoProcessor {
  @Process()
  async transcode(job: Job) {
    console.log('Start transcoding:', job.data);
    
    console.log('Finished transcoding video:', job.id);
  }
}