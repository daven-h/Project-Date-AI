'use client';

import { useState } from 'react';

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
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Search Preferences
      </h2>

      {/* Date & Time */}
      <div>
        <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-2">
          When's the date?
        </label>
        <input
          type="datetime-local"
          id="datetime"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
      </div>

      {/* Radius Slider */}
      <div>
        <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
          Search radius: {radius} miles
        </label>
        <input
          type="range"
          id="radius"
          min="5"
          max="50"
          step="5"
          className="w-full"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5 mi</span>
          <span>50 mi</span>
        </div>
      </div>

      {/* Search Button */}
      <button 
        onClick={handleSearch}
        disabled={isGenerating}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Search Date Ideas'}
      </button>
    </div>
  );
}