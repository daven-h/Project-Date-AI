import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';

@Injectable()
export class PlacesService {
  private client: Client;

  constructor() {
    this.client = new Client({});
  }

  async getCityCoordinates(city: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await this.client.geocode({
        params: {
          address: city,
          key: process.env.GOOGLE_PLACES_API_KEY || '',
        },
      });

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        console.log(`Coordinates for ${city}: ${location.lat}, ${location.lng}`);
        return location;
      }

      return null;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      return null;
    }
  }

  async searchVenues(query: string, location: string, radius: number = 10000) {
    try {
      const response = await this.client.textSearch({
        params: {
          query: `${query} in ${location}`,
          radius: radius,
          key: process.env.GOOGLE_PLACES_API_KEY || '',
        },
      });

      return response.data.results.map((place) => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        priceLevel: place.price_level,
        types: place.types,
        location: place.geometry?.location,
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  async searchRestaurants(location: string, dietary?: string) {
    let query = 'restaurants';
    if (dietary) {
      query = `${dietary} restaurants`;
    }
    return this.searchVenues(query, location);
  }

  async searchActivities(interests: string, location: string) {
    return this.searchVenues(interests, location);
  }
}