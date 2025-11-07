import SearchControls from '@/components/dashboard/SearchControls';
import MapView from '@/components/dashboard/MapView';
import DatePlanCard from '@/components/dashboard/DatePlanCard';
import { mockDatePlans } from '@/lib/mockData';

export default function DashboardPage() {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: Search & Results */}
          <div className="space-y-6">
            <SearchControls />
            
            {/* Results Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Suggested Date Plans ({mockDatePlans.length})
              </h2>
              <div className="space-y-4">
                {mockDatePlans.map((plan) => (
                  <DatePlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          </div>

          {/* Right side: Map */}
          <div>
            <MapView />
          </div>
        </div>
      </div>
    </main>
  );
}