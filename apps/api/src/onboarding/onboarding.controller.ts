import { Body, Controller, Post, Get, Param, Logger } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('onboarding')
export class OnboardingController {
    private readonly logger = new Logger(OnboardingController.name)
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto) {
    this.logger.log('Received body:', JSON.stringify(createProfileDto));
    this.logger.log('Type of body:', typeof createProfileDto);
    this.logger.log('Body keys:', Object.keys(createProfileDto || {}));
    return this.onboardingService.createProfile(createProfileDto);
  }

  @Get('profile/:userid')
  async getProfile(@Param('userid') userid: string) {
    return this.onboardingService.getProfile(userid);
  }
}