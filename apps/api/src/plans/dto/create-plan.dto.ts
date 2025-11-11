import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  activities: string[];

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsNumber()
  distance: number;

  @IsString()
  @IsNotEmpty()
  priceRange: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}