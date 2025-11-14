'use client';

import { useEffect, useState } from 'react';
import SearchControls from '@/components/dashboard/SearchControls';
import MapView from '@/components/dashboard/MapView';
import DatePlanCard from '@/components/dashboard/DatePlanCard';
import { generateDatePlans, getUserDatePlans } from '@/lib/api';
import { ApiDatePlan } from '@/lib/api';

export default function DashboardPage() {
  const [plans, setPlans] = useState<ApiDatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Load existing plans on mount
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    setIsLoading(true);
    try {
      const userPlans = await getUserDatePlans(userId);
      setPlans(userPlans);
    } catch (err) {
      console.error('Error loading plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlans = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please complete onboarding first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const newPlans = await generateDatePlans(userId);
      setPlans(newPlans);
    } catch (err) {
      console.error('Error generating plans:', err);
      setError('Failed to generate plans. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Discover Date Ideas
          </h1>
          <p className="text-gray-600 mt-2">
            Find the perfect plans based on your preferences
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SearchControls onSearch={handleGeneratePlans} isGenerating={isGenerating} />
            
            {/* Results Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isGenerating ? 'Generating Ideas...' : `Suggested Date Plans (${plans.length})`}
              </h2>

              {isGenerating && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Crafting personalized date ideas for you...</p>
                </div>
              )}

              {!isGenerating && plans.length === 0 && !isLoading && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600 mb-4">No date plans yet. Click "Search Date Ideas" to generate some!</p>
                </div>
              )}

              {!isGenerating && plans.length > 0 && (
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <DatePlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <MapView />
          </div>
        </div>
      </div>
    </main>
  );
}