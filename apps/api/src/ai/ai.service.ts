import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PlacesService } from '../places/places.service';
import { EventsService, TicketmasterEvent } from '../events/events.service';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private placesService: PlacesService,
    private eventsService: EventsService,
  ) {
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
    // Get coordinates for the city
    const coordinates = await this.placesService.getCityCoordinates(preferences.city);
    
    if (!coordinates) {
      console.warn(`Could not get coordinates for ${preferences.city}`);
    }

    // Search for real venues
    const restaurants = await this.placesService.searchRestaurants(
      preferences.city,
      preferences.dietary,
    );

    const activities = await this.placesService.searchActivities(
      preferences.interests,
      preferences.city,
    );

    // Search for events using coordinates
    let events: TicketmasterEvent[] = [];
    if (coordinates) {
      events = await this.searchRelevantEvents(
        preferences.interests,
        coordinates.lat,
        coordinates.lng,
      );
    }

    const prompt = this.buildPrompt(preferences, restaurants, activities, events);

    console.log('=== EVENTS BEING SENT TO AI ===');
    console.log(`Total events found: ${events.length}`);
    if (events.length > 0) {
      events.slice(0, 5).forEach((e, i) => {
        console.log(`${i + 1}. ${e.name} - ${e.date} at ${e.time}`);
      });
    }
    console.log('================================');

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful dating assistant that suggests creative, personalized date ideas using REAL venues, restaurants, and events with actual dates and prices.',
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

  private async searchRelevantEvents(
    interests: string,
    lat: number,
    lng: number,
  ): Promise<TicketmasterEvent[]> {
    const keywords = this.extractEventKeywords(interests);
    const allEvents: TicketmasterEvent[] = [];

    for (const keyword of keywords) {
      const events = await this.eventsService.searchEventsByCoordinates(
        keyword,
        lat,
        lng,
        50, // 50 mile radius
      );
      allEvents.push(...events);
    }

    return allEvents;
  }

  private extractEventKeywords(interests: string): string[] {
    const keywords: string[] = [];

    const interestMap: Record<string, string[]> = {
      soccer: ['soccer', 'MLS'],
      football: ['football', 'NFL'],
      basketball: ['basketball', 'NBA'],
      baseball: ['baseball', 'MLB'],
      hockey: ['hockey', 'NHL'],
      music: ['concert', 'music'],
      theater: ['theater', 'broadway'],
      comedy: ['comedy'],
      sports: ['sports'],
    };

    const lowerInterests = interests.toLowerCase();

    Object.entries(interestMap).forEach(([key, values]) => {
      if (lowerInterests.includes(key)) {
        keywords.push(...values);
      }
    });

    if (keywords.length === 0) {
      keywords.push(...interests.split(',').map((i) => i.trim()));
    }

    return [...new Set(keywords)];
  }

  private buildPrompt(
    preferences: {
      interests: string;
      city: string;
      budget: string;
      dietary?: string;
    },
    restaurants: any[],
    activities: any[],
    events: any[],
  ): string {
    const today = new Date().toISOString().split('T')[0];
    const threeMonthsOut = new Date();
    threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);
    const endDate = threeMonthsOut.toISOString().split('T')[0];

    return `Generate 3 creative date plan suggestions based on these preferences and REAL data:

TODAY'S DATE: ${today}
VALID DATE RANGE: ${today} to ${endDate}

Partner's Interests: ${preferences.interests}
Location: ${preferences.city}
Budget: ${preferences.budget}
Dietary Restrictions: ${preferences.dietary || 'None'}

REAL UPCOMING EVENTS in ${preferences.city} (${today} to ${endDate}):
${events.length > 0 ? events.slice(0, 10).map((e, i) => `${i + 1}. ${e.name} - ${e.date} at ${e.time} - ${e.venue} - ${e.priceRange}`).join('\n') : 'No events found'}

REAL RESTAURANTS in ${preferences.city}:
${restaurants.slice(0, 10).map((r, i) => `${i + 1}. ${r.name} - ${r.address} (Rating: ${r.rating || 'N/A'})`).join('\n')}

REAL ACTIVITY VENUES in ${preferences.city}:
${activities.slice(0, 10).map((a, i) => `${i + 1}. ${a.name} - ${a.address}`).join('\n')}

CRITICAL REQUIREMENTS:
- ONLY use events with dates between ${today} and ${endDate}
- DO NOT make up event dates - use the exact dates shown above
- Use REAL venues and events from the lists above
- Include actual event names, dates, times, and venues when relevant
- Include ticket price ranges when available
- If there are relevant events, try to incorporate at least one into the date plans
- All events MUST have dates in the future (after ${today})

For each date plan, provide:
1. A creative title
2. 2-3 specific activities using REAL venues/events above (include EXACT names and dates for events!)
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
      "activities": ["string with REAL venue/event name and EXACT date if applicable", "string"],
      "duration": "string",
      "distance": number,
      "priceRange": "string",
      "reason": "string"
    }
  ]
}`;
  }
}