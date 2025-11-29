'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import SearchControls from '@/components/dashboard/SearchControls';
import MapView from '@/components/dashboard/MapView';
import DatePlanCard from '@/components/dashboard/DatePlanCard';
import { generateDatePlans, getUserDatePlans } from '@/lib/api';
import { ApiDatePlan } from '@/lib/api';
import { Loader2, Sparkles, MapPin, Heart } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [plans, setPlans] = useState<ApiDatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      loadPlans();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Could not get your location. Using city center instead.');
        }
      );
    } else {
      setLocationError('Geolocation not supported by your browser.');
    }
  }, []);

  const loadPlans = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userPlans = await getUserDatePlans(user.id);
      setPlans(userPlans);
    } catch (err) {
      console.error('Error loading plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlans = async (dateTime: string, radius: number) => {
    if (!user) {
      setError('Please sign in first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const newPlans = await generateDatePlans(user.id, dateTime, radius, userLocation || undefined);
      setPlans(newPlans);
    } catch (err) {
      console.error('Error generating plans:', err);
      setError('Failed to generate plans. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold">
              Discover Date Ideas
            </h1>
          </div>
          <p className="text-blue-50 text-xl mb-6">
            Find the perfect plans based on your preferences
          </p>
          {userLocation && (
            <div className="location-info">
              <MapPin className="w-4 h-4" />
              <span>Using your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
            </div>
          )}
          {locationError && (
            <div className="flex items-center gap-2 mt-3 text-sm bg-yellow-500/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-flex">
              <span>⚠️ {locationError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Search & Results (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Controls */}
              <SearchControls onSearch={handleGeneratePlans} isGenerating={isGenerating} />
              
              {/* Results Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        Generating Ideas...
                      </span>
                    ) : (
                      `Your Date Plans (${plans.length})`
                    )}
                  </h2>
                  {plans.length > 0 && !isGenerating && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {plans.length} {plans.length === 1 ? 'plan' : 'plans'} found
                    </span>
                  )}
                </div>

                {/* Loading State */}
                {isGenerating && (
                  <div className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-blue-100">
                    <div className="relative inline-block">
                      <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100 border-t-blue-600"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
                      Crafting Your Perfect Date
                    </h3>
                    <p className="text-gray-600 text-lg">
                      AI is searching real venues, events, and restaurants...
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {!isGenerating && plans.length === 0 && !isLoading && (
                  <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl p-16 text-center border-2 border-blue-100">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Heart className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Ready to Plan Something Special?
                    </h3>
                    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                      Click "Search Date Ideas" above to get AI-powered suggestions with real venues and events!
                    </p>
                    <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">Real Venues</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">Live Events</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">AI Personalized</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Plans Grid */}
                {!isGenerating && plans.length > 0 && (
                  <div className="space-y-6">
                    {plans.map((plan) => (
                      <DatePlanCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Map (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <MapView />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}