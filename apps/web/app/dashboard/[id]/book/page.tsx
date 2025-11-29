'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, MapPin, DollarSign, ExternalLink, ArrowLeft, Ticket } from 'lucide-react';

interface TicketmasterEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  priceRange?: string;
  url: string;
  images?: string[];
}

interface DatePlan {
  id: string;
  title: string;
  description: string | null;
  activities: string[];
  duration: string;
  distance: number;
  priceRange: string;
  reason: string;
  events?: TicketmasterEvent[];
  createdAt: string;
  updatedAt: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`http://localhost:4000/plans/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch plan');
        }
        const data = await response.json();
        setPlan(data);
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError('Failed to load date plan');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPlan();
    }
  }, [params.id]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'Plan not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasEvents = plan.events && plan.events.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <Ticket className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Book Your Date</h1>
          </div>
          <p className="text-blue-100 text-lg">{plan.title}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Date Plan Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{plan.title}</CardTitle>
            {plan.description && <CardDescription className="text-base">{plan.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{plan.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>{plan.distance} mi away</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>{plan.priceRange}</span>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm">
                <span className="font-bold text-blue-700">💡 Why this works: </span>
                <span className="text-gray-700">{plan.reason}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Events Section */}
        {hasEvents ? (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Events & Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.events!.map((event, index) => (
                <Card key={index} className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                  {/* Event Image */}
                  {event.images && event.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.images[0]}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
                        {event.priceRange || 'Price TBD'}
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.name}
                    </CardTitle>
                    <CardDescription>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Ticket className="w-4 h-4 mr-2" />
                        Get Tickets
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-xl">No Events Available</CardTitle>
              <CardDescription>
                We couldn't find any Ticketmaster events for this date plan at the moment. Check back later or explore other date plans!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="border-yellow-300 hover:bg-yellow-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Explore Other Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
