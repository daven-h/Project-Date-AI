import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [PlansController],
  providers: [PlansService],
  imports: [AiModule],
})
export class PlansModule {}
