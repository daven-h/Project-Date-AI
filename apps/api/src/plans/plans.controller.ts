import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Post('generate')
  async generate(
    @Body() body: { 
      userId: string; 
      dateTime?: string; 
      radius?: number;
      userLocation?: { lat: number; lng: number };
    }
  ) {
    console.log('Received in controller:', body);
    return this.plansService.generatePlans(
      body.userId, 
      body.dateTime, 
      body.radius,
      body.userLocation,
    );
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.plansService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }
}