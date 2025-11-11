import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateDateSuggestions(preferences: {
    interests: string;
    city: string;
    budget: string;
    dietary?: string;
  }) {
    const prompt = this.buildPrompt(preferences);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful dating assistant that suggests creative, personalized date ideas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response || '{}');
  }

  private buildPrompt(preferences: {
    interests: string;
    city: string;
    budget: string;
    dietary?: string;
  }): string {
    return `Generate 3 creative date plan suggestions based on these preferences:

Partner's Interests: ${preferences.interests}
Location: ${preferences.city}
Budget: ${preferences.budget}
Dietary Restrictions: ${preferences.dietary || 'None'}

For each date plan, provide:
1. A creative title
2. 2-3 specific activities (be specific with venue types, not actual venue names)
3. Estimated duration
4. Approximate distance from city center (in miles)
5. Price range ($, $$, $$$, or $$$$)
6. A brief explanation of why this matches their interests

Return the response as a JSON object with this structure:
{
  "plans": [
    {
      "title": "string",
      "description": "string",
      "activities": ["string", "string"],
      "duration": "string",
      "distance": number,
      "priceRange": "string",
      "reason": "string"
    }
  ]
}`;
  }
}