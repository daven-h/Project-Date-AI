'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Calendar, Radius, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SearchControlsProps {
  onSearch: (dateTime: string, radius: number) => void;
  isGenerating: boolean;
}

export default function SearchControls({ onSearch, isGenerating }: SearchControlsProps) {
  const [radius, setRadius] = useState(10);
  const [dateTime, setDateTime] = useState('');

  const handleSearch = () => {
    onSearch(dateTime, radius);
  };

  return (
    <>
      <Card className="search-card">
        <CardHeader>
          <CardTitle className="search-preferences">
            <Search className="w-6 h-6 text-blue-600" />
            Search Preferences
          </CardTitle>
          <CardDescription>
            Customize your date search criteria
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Date & Time */}
          <div className="space-y-2">
            <Label htmlFor="datetime" className="flex items-center gap-2 text-base font-medium">
              <Calendar className="w-4 h-4 text-blue-600" />
              When's the date?
            </Label>
            <Input
              type="datetime-local"
              id="datetime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Radius Slider */}
          <div className="radius-slider">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
              Search radius: {radius} miles
            </label>
            <input
              type="range"
              id="radius"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Button */}
      <div className="space-y-4">
        <Button
          onClick={handleSearch}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Amazing Ideas...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Search Date Ideas
            </>
          )}
        </Button>

        {isGenerating && (
          <div className="text-center">
            <p className="text-sm text-gray-600 animate-pulse">
              Searching venues, events, and restaurants...
            </p>
          </div>
        )}
      </div>
    </>
  );
}