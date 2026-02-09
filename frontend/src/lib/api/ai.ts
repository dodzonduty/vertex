import { apiRequest } from './config';

export interface AIRecommendedStudent {
    student_id: string;
    full_name: string;
    university?: string;
    degree_level?: string;
    ats_score?: number;
    skills?: string[];
    photo_url?: string;
}

export interface AIRecommendedCompany {
    company_id: string;
    name: string;
    industry?: string;
    size?: string;
    description?: string;
    photo_url?: string;
}

export interface AIRecommendedOpportunity {
    opportunity_id: string;
    title: string;
    type: string;
    description?: string;
}

export interface AIResponse {
    answer: string;
    recommended_students: AIRecommendedStudent[];
    recommended_companies: AIRecommendedCompany[];
    recommended_opportunities: AIRecommendedOpportunity[];
    status: string;
}

/**
 * Ask Gemini for assistance.
 * 
 * @param query The user's question or search query.
 * @param context Optional context (e.g., current page name or data).
 * @returns Promise with the structured AI response.
 */
export async function askAI(query: string, context?: string): Promise<AIResponse> {
    try {
        const response = await apiRequest<AIResponse>('/api/v1/ai/ask', {
            method: 'POST',
            body: JSON.stringify({ query, context }),
        });

        return response;
    } catch (error) {
        console.error('Ask AI Error:', error);
        throw error;
    }
}
