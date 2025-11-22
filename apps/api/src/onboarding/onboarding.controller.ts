import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  async create(
    @Body() body: {
      userId: string;
      interests: string;
      city: string;
      budget: string;
      dietary?: string;
    }
  ) {
    return this.onboardingService.createProfile(body);
  }

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    return this.onboardingService.getProfile(userId);
  }
}