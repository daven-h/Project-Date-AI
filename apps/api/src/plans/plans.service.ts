import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService,
    private AiService: AiService
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    return this.prisma.plan.create({
      data: {
        userId: createPlanDto.userId,
        title: createPlanDto.title,
        description: createPlanDto.description,
        activities: createPlanDto.activities,
        duration: createPlanDto.duration,
        distance: createPlanDto.distance,
        priceRange: createPlanDto.priceRange,
        reason: createPlanDto.reason,
      },
    });
  }

  async generatePlans(userId: string) {
    // Get user profile 

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('User or profile not found');
    }

    // Generate suggestions using AI

    const aiResponse = await this.AiService.generateDateSuggestions({
      interests: user.profile.interests,
      city: user.profile.city,
      budget: user.profile.budget,
      dietary: user.profile.dietary || undefined,
    });

    // Saves all plans to database in parallel
    const savedPlans = await Promise.all(
      aiResponse.plans.map(async (plan: any) => 
        this.prisma.plan.create({
          data: {
            userId,
            title: plan.title,
            description: plan.description,
            activities: plan.activities,
            duration: plan.duration,
            distance: plan.distance,
            priceRange: plan.priceRange,
            reason: plan.reason,
          },
        }),
    ),
  );

    return savedPlans;
  }

  async findAllByUser(userId: string) {
    return this.prisma.plan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: { user: { include: { profile: true } } },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }
}