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
    dateTime?: string;
    radius?: number;
    userLocation?: { lat: number; lng: number };
  }) {
 const radius = preferences.radius || 50;
  const radiusInMeters = radius * 1609.34; // Convert miles to meters for Google Places

  console.log(`Search preferences - Radius: ${radius} miles, DateTime: ${preferences.dateTime || 'any'}`);

  // Use userLocation if provided (e.g., user wants dates near their current location)
  // Otherwise, geocode the city (e.g., planning dates in a different city)
  let coordinates: { lat: number; lng: number } | undefined;

  if (preferences.userLocation) {
    console.log(`Using user's current location: ${preferences.userLocation.lat}, ${preferences.userLocation.lng}`);
    coordinates = preferences.userLocation;
  } else {
    console.log(`Getting coordinates for ${preferences.city}`);
    coordinates = await this.placesService.getCityCoordinates(preferences.city) || undefined;

    if (!coordinates) {
      console.warn(`Could not get coordinates for ${preferences.city}`);
    }
  }

    // Search for real venues with specified radius
    const restaurants = await this.placesService.searchRestaurants(
      preferences.city,
      preferences.dietary,
      radiusInMeters,
    );

    const activities = await this.placesService.searchActivities(
      preferences.interests,
      preferences.city,
      radiusInMeters,
    );

    // Search for events using coordinates and date range
    let events: TicketmasterEvent[] = [];
    if (coordinates) {
      events = await this.searchRelevantEvents(
        preferences.interests,
        coordinates.lat,
        coordinates.lng,
        radius,
        preferences.dateTime,
      );
    }

    const prompt = this.buildPrompt(preferences, restaurants, activities, events);

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
    radius: number,
    dateTime?: string,
  ): Promise<TicketmasterEvent[]> {
    const keywords = this.extractEventKeywords(interests);
    const allEvents: TicketmasterEvent[] = [];

    // Calculate date range based on provided dateTime
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (dateTime) {
      // User provided a specific date/time - search ONLY that day
      const targetDate = new Date(dateTime);
      
      // Start of the selected day
      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      startDate = dayStart.toISOString();
      
      // End of the selected day (23:59:59)
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);
      endDate = dayEnd.toISOString();

      console.log(`Searching events ONLY on ${targetDate.toLocaleDateString()}`);
      console.log(`From ${startDate} to ${endDate}`);
    } else {
      // No date specified - show all upcoming events
      console.log('No specific date - searching all upcoming events');
    }

    for (const keyword of keywords) {
      const events = await this.eventsService.searchEventsByCoordinates(
        keyword,
        lat,
        lng,
        radius,
        startDate,
        endDate,
      );
      allEvents.push(...events);
    }

    // Filter events to only include those on the target date
    if (dateTime && allEvents.length > 0) {
      const targetDateString = new Date(dateTime).toISOString().split('T')[0]; // YYYY-MM-DD
      const filteredEvents = allEvents.filter(event => {
        return event.date === targetDateString;
      });
      
      console.log(`Filtered ${allEvents.length} events down to ${filteredEvents.length} on ${targetDateString}`);
      return filteredEvents;
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
      dateTime?: string;
      radius?: number;
    },
    restaurants: any[],
    activities: any[],
    events: any[],
  ): string {
    const dateContext = preferences.dateTime 
      ? `Target Date: ${new Date(preferences.dateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nIMPORTANT: All suggestions must be for THIS SPECIFIC DATE only.\n`
      : 'Date: Flexible (any upcoming date)\n';

    return `Generate 3 creative date plan suggestions based on these preferences and REAL data:

Partner's Interests: ${preferences.interests}
Location: ${preferences.city}
Search Radius: ${preferences.radius || 50} miles
Budget: ${preferences.budget}
Dietary Restrictions: ${preferences.dietary || 'None'}
${dateContext}

REAL UPCOMING EVENTS in ${preferences.city}:
${events.length > 0 ? events.slice(0, 10).map((e, i) => `${i + 1}. ${e.name} - ${e.date} at ${e.time} - ${e.venue} - ${e.priceRange}`).join('\n') : 'No events found for the selected date'}

REAL RESTAURANTS in ${preferences.city}:
${restaurants.slice(0, 10).map((r, i) => `${i + 1}. ${r.name} - ${r.address} (Rating: ${r.rating || 'N/A'})`).join('\n')}

REAL ACTIVITY VENUES in ${preferences.city}:
${activities.slice(0, 10).map((a, i) => `${i + 1}. ${a.name} - ${a.address}`).join('\n')}

IMPORTANT: 
- Use REAL venues and events from the lists above
- All suggestions should be within ${preferences.radius || 50} miles
${preferences.dateTime ? `- ALL date plans MUST be for ${new Date(preferences.dateTime).toLocaleDateString()} ONLY` : '- Use any upcoming dates'}
- Include actual event names, dates, times, and venues when relevant
- Include ticket price ranges when available
- If there are relevant events, try to incorporate at least one into the date plans
${preferences.dateTime && events.length === 0 ? '- Since no events were found for this date, suggest activities that don\'t require specific events' : ''}

For each date plan, provide:
1. A creative title
2. 2-3 specific activities using REAL venues/events above (include names, dates for events!)
3. Estimated duration
4. Approximate distance from city center (in miles, must be within ${preferences.radius || 50} miles)
5. Price range ($, $$, $$$, or $$$$)
6. A brief explanation of why this matches their interests

Return the response as a JSON object with this structure:
{
  "plans": [
    {
      "title": "string",
      "description": "string",
      "activities": ["string with REAL venue/event name and date if applicable", "string"],
      "duration": "string",
      "distance": number,
      "priceRange": "string",
      "reason": "string"
    }
  ]
}`;
  }
}