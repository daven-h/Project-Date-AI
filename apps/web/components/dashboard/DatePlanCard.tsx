import { DatePlan } from '@/lib/mockData';
import { ApiDatePlan as AP } from '@/lib/api';
import Link from 'next/link'

interface DatePlanCardProps {
  plan: AP;
}

export default function DatePlanCard({ plan }: DatePlanCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {plan.title}
      </h3>
      
      {/* Activities */}
      <div className="mb-4">
      <div className="space-y-2">

        {plan.activities.map((activity, index) => (
        <div key={index} className="flex items-start">
            <span className="text-blue-600 mr-2">→</span>
              <span className="text-gray-700">{activity}</span>
            </div>
        ))}
      </div>
     </div>

     {/* More to be added */}

     
{/* Metadata */}
<div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
  <span>⏱️ {plan.duration}</span>
  <span>📍 {plan.distance} mi</span>
  <span>💰 {plan.priceRange}</span>
</div>

    {/* Reason */}
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
    <p className="text-sm text-gray-700">
    <span className="font-semibold">Why this pick: </span>
    {plan.reason}
    </p>
    
    </div>
    
    {/* Action Button */}
    <Link href={`/dashboard/${plan.id}`}>
    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
    View Details
    </button>
    </Link>

    </div>
  );
}