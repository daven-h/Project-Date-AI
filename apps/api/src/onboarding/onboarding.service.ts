import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async createProfile(data: {
    userId: string;
    interests: string;
    city: string;
    budget: string;
    dietary?: string;
  }) {
    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      include: { profile: true },
    });

    if (!user) {
      // Create new user with profile
      user = await this.prisma.user.create({
        data: {
          id: data.userId,
          profile: {
            create: {
              interests: data.interests,
              city: data.city,
              budget: data.budget,
              dietary: data.dietary,
            },
          },
        },
        include: { profile: true },
      });
    } else if (!user.profile) {
      // User exists but no profile - create profile
      await this.prisma.profile.create({
        data: {
          userId: user.id,
          interests: data.interests,
          city: data.city,
          budget: data.budget,
          dietary: data.dietary,
        },
      });
    } else {
      // Update existing profile
      await this.prisma.profile.update({
        where: { userId: user.id },
        data: {
          interests: data.interests,
          city: data.city,
          budget: data.budget,
          dietary: data.dietary,
        },
      });
    }

    return user;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}