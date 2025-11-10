import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    // Test database connection
    const userCount = await this.prisma.user.count();
    return `Hello World! Users in database: ${userCount}`;
  }
}