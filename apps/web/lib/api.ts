const API_URL = 'http://localhost:4000';

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
            'Content-type': 'application-json'
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