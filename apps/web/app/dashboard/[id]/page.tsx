import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PlanDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPlan(id: string) {
  const response = await fetch(`http://localhost:4000/plans/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function PlanDetailsPage({ params }: PlanDetailsPageProps) {
  const { id } = await params;
  const plan = await getPlan(id);

  if (!plan) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to all plans
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {plan.title}
          </h1>
          
          {/* Metadata */}
          <div className="flex items-center gap-6 text-lg text-gray-600">
            <span>⏱️ {plan.duration}</span>
            <span>📍 {plan.distance} mi away</span>
            <span className="text-2xl">{plan.priceRange}</span>
          </div>
        </div>

        {/* Description */}
        {plan.description && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <p className="text-gray-700">{plan.description}</p>
          </div>
        )}

        {/* Why This Pick */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Why we picked this
          </h2>
          <p className="text-gray-700">{plan.reason}</p>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Date Itinerary
          </h2>
          
          <div className="space-y-6">
            {Array.isArray(plan.activities) && plan.activities.map((activity: string, index: number) => (
              <div key={index} className="flex gap-4">
                {/* Step Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                
                {/* Activity Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {activity}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Estimated time: {index === 0 ? '1.5 hours' : index === 1 ? '2 hours' : '1.5 hours'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Book This Date
          </button>
          <button className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
            Customize Plan
          </button>
        </div>
      </div>
    </main>
  );
}