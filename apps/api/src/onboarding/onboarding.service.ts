import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async createProfile(data: CreateProfileDto) {

    const user = await this.prisma.user.create({
      data: {
        profile: {
          create: {
            interests: data.interests,
            city: data.city,
            budget: data.budget,
            dietary: data.dietary,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return user;
  }
}