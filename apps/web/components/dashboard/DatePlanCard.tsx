import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign, ExternalLink, Sparkles } from 'lucide-react';
import { ApiDatePlan } from '@/lib/api';

interface DatePlanCardProps {
  plan: ApiDatePlan;
}

export default function DatePlanCard({ plan }: DatePlanCardProps) {
  return (
    <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 border-2 border-transparent hover:border-blue-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2 group-hover:text-blue-600 transition-colors">
              {plan.title}
            </CardTitle>
            {plan.description && (
              <CardDescription className="text-base">{plan.description}</CardDescription>
            )}
          </div>
          <Badge
            variant="secondary"
            className="text-base px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200"
          >
            {plan.priceRange}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Activities */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Your Perfect Date:
          </h4>
          {plan.activities.map((activity, index) => (
            <div key={index} className="flex gap-3 items-start group/activity">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <p className="text-gray-700 flex-1 pt-1 group-hover/activity:text-gray-900 transition-colors">
                {activity}
              </p>
            </div>
          ))}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-semibold text-gray-900">{plan.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Distance</p>
              <p className="font-semibold text-gray-900">{plan.distance} mi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="font-semibold text-gray-900">{plan.priceRange}</p>
            </div>
          </div>
        </div>

        {/* Why this pick */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm">
            <span className="font-bold text-blue-700">💡 Why this works: </span>
            <span className="text-gray-700">{plan.reason}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 flex gap-3">
        <Link href={`/dashboard/${plan.id}`} className="flex-1">
          <Button variant="outline" className="w-full group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Details
          </Button>
        </Link>
        <Link href={`/dashboard/${plan.id}/book`} className="flex-1">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            Book This Date
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}