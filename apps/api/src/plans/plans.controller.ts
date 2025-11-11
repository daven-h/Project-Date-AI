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
  async generate(@Body() body: {userId: string}){
    return this.plansService.generatePlans(body.userId);
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