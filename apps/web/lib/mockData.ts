export interface DatePlan {
  id: string;
  title: string;
  activities: string[];
  duration: string;
  distance: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  reason: string;
  imageUrl?: string;
}

export const mockDatePlans: DatePlan[] = [
  {
    id: '1',
    title: 'Sunset Dinner & Jazz Night',
    activities: [
      'Dinner at Bella Vista Italian Restaurant',
      'Live Jazz at Blue Note Club'
    ],
    duration: '3.5 hours',
    distance: 5.2,
    priceRange: '$$',
    reason: 'Matches her love for live music and Italian cuisine. Rooftop dining offers beautiful sunset views.',
  },
  {
    id: '2',
    title: 'Art Gallery & Coffee Experience',
    activities: [
      'Contemporary art exhibit at Metro Gallery',
      'Artisan coffee tasting at Brew Lab'
    ],
    duration: '2 hours',
    distance: 3.1,
    priceRange: '$',
    reason: 'Perfect for her interest in art and specialty coffee. Both venues are walkable and pet-friendly.',
  },
  {
    id: '3',
    title: 'Outdoor Adventure Day',
    activities: [
      'Hiking at Sunset Ridge Trail',
      'Picnic lunch with local foods',
      'Kayaking at Mirror Lake'
    ],
    duration: '5 hours',
    distance: 12.5,
    priceRange: '$$',
    reason: 'Great for her adventurous spirit. The trail offers stunning views and the lake is perfect for beginners.',
  }
];