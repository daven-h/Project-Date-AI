'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitOnboarding } from '@/lib/api'


export default function OnboardingPage() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        interests: '',
        city: '',
        dietary: '',
        budget: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Check required fields
  if (!formData.interests.trim() || !formData.city.trim() || !formData.budget.trim()) {
    alert("Please fill out all required fields");
    return;
  }
  
  console.log('Form data before sending:', formData);
  
  setIsLoading(true);
  setError('');
  
  try {
    const payload = {
      interests: formData.interests.trim(),
      city: formData.city.trim(),
      budget: formData.budget.trim(),
      dietary: formData.dietary?.trim() || undefined,
    };
    
    console.log('Payload being sent:', payload);
    
    // Call the API
    const result = await submitOnboarding(payload);
    
    console.log('Profile created:', result);
    
    // Store the user ID in localStorage
    localStorage.setItem('userId', result.id);
    
    // Redirect to dashboard on success
    router.push('/dashboard');
    
  } catch (err) {
    console.error('Error submitting onboarding:', err);
    
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'Failed to save your preferences. Please try again.';
    
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Let's plan the perfect date
          </h1>
          <p className="text-gray-600 mb-8">
            Tell us about your partner's interests and we'll suggest amazing date ideas.
          </p>

          {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {error}
         </div>
        )}
          
        <form onSubmit={handleSubmit} className="space-y-6">
      {/* Interests Field */}
     <div>
    <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
      What does your partner enjoy? *
    </label>
    <textarea
      id="interests"
      rows={3}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="e.g., hiking, live music, trying new restaurants, art galleries..."
      value={formData.interests}
      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
    />
    </div>

    <div>
      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
        Where are you located? (Enter city, zip code, etc) *
      </label>
      <input
      type="text"
      id="city"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="e.g., New York, NY or 10001"
      value = {formData.city}
      onChange={(e) => setFormData({ ...formData, city: e.target.value})}
      />
      
    </div>


    <div>
    <label htmlFor='budget' className='block text-sm font-medium text-gray-700 mb-2'>
      What's your budget per date? *
    </label>

    <select 
    id="budget"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    value = {formData.budget}
    onChange={(e) => setFormData({...formData, budget: e.target.value})}
    >

    <option value="">Select a budget range</option>
    <option value ="budget">Budget-friendly ($0-$50)</option>
    <option value ="moderate">Moderate ($50-150)</option>
    <option value = "upscale">Upscale ($150-$300)</option>
    <option value = "luxury">Luxury ($300+)</option>

    </select>
    </div>

    <div>
    <label htmlFor='dietary' className="block text-sm font-medium text-gray-700 mb-2">
      Any dietary restrictions or preferences?
      <span className="text-gray-400 font-normal ml-1">(Optional)</span>
    </label>

    <input
    type="text"
    id="dietary"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="e.g., vegetarian, gluten-free, no seafood..."
    value={formData.dietary}
    onChange={(e) => setFormData({...formData, dietary: e.target.value})}
    />
    </div>

   {/* Submit Button */}
<div className="pt-4">
  <button
    type="submit"
    disabled={isLoading}
    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
    {isLoading ? 'Saving...' : 'Find Date Ideas'}
    </button>
    </div>
      </form>
        </div>
      </div>
    </main>
  );
}