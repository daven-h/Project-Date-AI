import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface TicketmasterEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  priceRange?: string;
  url: string;
  images?: string[];
}

@Injectable()
export class EventsService {
  private readonly apiKey = process.env.TICKETMASTER_API_KEY;
  private readonly baseUrl = 'https://app.ticketmaster.com/discovery/v2';

  async searchEventsByCoordinates(
    keyword: string,
    lat: number,
    lng: number,
    radius: number = 50, // miles
    startDate?: string,
    endDate?: string,
  ): Promise<TicketmasterEvent[]> {
    try {
      // Format dates as YYYY-MM-DDTHH:mm:ssZ (Ticketmaster format)
      const now = new Date();
      const defaultStartDate = now.toISOString().split('.')[0] + 'Z';

      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      const defaultEndDate = threeMonthsFromNow.toISOString().split('.')[0] + 'Z';

      console.log(`Searching Ticketmaster: ${keyword} near ${lat}, ${lng}`);
      console.log(`Date range: ${defaultStartDate} to ${defaultEndDate}`);
      console.log(`Current date check: ${new Date().toISOString()}`);

      const response = await axios.get(`${this.baseUrl}/events.json`, {
        params: {
          apikey: this.apiKey,
          keyword: keyword,
          latlong: `${lat},${lng}`,
          radius: radius,
          unit: 'miles',
          size: 20,
          sort: 'date,asc',
          startDateTime: defaultStartDate,
          endDateTime: defaultEndDate,
        },
      });

      console.log(`API Response Status: ${response.status}`);
      console.log(`Found ${response.data._embedded?.events?.length || 0} events`);
      
      if (!response.data._embedded?.events) {
        console.log('No events found in response');
        return [];
      }

      const events = response.data._embedded.events.map((event: any) => {
        const eventDate = event.dates?.start?.localDate || 'Date TBD';
        const eventTime = event.dates?.start?.localTime || 'Time TBD';
        console.log(`Event: ${event.name} on ${eventDate}`);
        return {
          name: event.name,
          date: eventDate,
          time: this.formatTime(eventTime),
          venue: event._embedded?.venues?.[0]?.name || 'Venue TBD',
          priceRange: this.formatPriceRange(event.priceRanges),
          url: event.url,
          images: event.images?.map((img: any) => img.url).slice(0, 3),
        };
      });

      return events;
    } catch (error) {
      console.error('Error searching Ticketmaster:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      return [];
    }
  }

  private formatTime(time: string): string {
    if (time === 'Time TBD' || !time) {
      return 'Time TBD';
    }

    // Parse time in format HH:mm:ss
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      return time; // Return original if parsing fails
    }

    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${displayHours}:${displayMinutes} ${period}`;
  }

  private formatPriceRange(priceRanges?: any[]): string {
    if (!priceRanges || priceRanges.length === 0) {
      return 'Price TBD';
    }

    const minPrice = priceRanges[0].min;
    const maxPrice = priceRanges[0].max;

    if (minPrice && maxPrice) {
      return `$${minPrice}-$${maxPrice}`;
    } else if (minPrice) {
      return `From $${minPrice}`;
    } else {
      return 'Price TBD';
    }
  }
}