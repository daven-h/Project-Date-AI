import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PlansModule } from './plans/plans.module';



@Module({
  imports: [PrismaModule, OnboardingModule, PlansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}