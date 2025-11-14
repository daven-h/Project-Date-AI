const API_URL = 'http://localhost:4000';

// API response type
export interface ApiDatePlan {
  id: string;
  title: string;
  description: string | null;
  activities: string[];  // API returns array, not JSON
  duration: string;
  distance: number;
  priceRange: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export async function submitOnboarding(data: {
    interests: string;
    city: string;
    budget: string;
    dietary?: string
}) {

    console.log('API_URL:', API_URL)
    console.log('About to fetch with data:', data)

    const response = await fetch(`${API_URL}/onboarding`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok){
        const errorData = await response.json().catch(() => ({}));
        console.log('Error data:', errorData)
        const errorMessage = errorData.message || 'Failed to submit onboarding'
        throw new Error(errorMessage)
    }

    return response.json()
}


export async function generateDatePlans(userId: string) {
    const response = await fetch(`${API_URL}/plans/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId}),
    });

    if (!response.ok) {
        throw new Error('Failed to generate date plans');
    }

    return response.json();
}

export async function getUserDatePlans(userId: string) {
    const response = await fetch(`${API_URL}/plans/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get user date plans');
    }

    return response.json();
}