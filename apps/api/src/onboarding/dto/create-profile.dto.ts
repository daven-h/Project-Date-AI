import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  interests: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  budget: string;

  @IsString()
  @IsOptional()
  dietary?: string;
}

/*
What's a DTO
Data Transfer Object
Defines the shape of incoming data
The ? means dietary is optional
*/