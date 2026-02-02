// Onboarding API functions

import { apiRequest, setAuthToken, setUserData } from './config';
import type { TokenResponse } from './auth';

// Types
export interface SocialLinkCreate {
    url: string;
    username?: string;
}

export interface ProjectCreate {
    title: string;
    repo_url?: string;
}

export interface StudentOnboardingRequest {
    // User fields
    email: string;
    password: string;

    // Student fields
    full_name: string;
    university?: string;
    degree_level?: string;

    // Optional fields
    social_links?: SocialLinkCreate[];
    projects?: ProjectCreate[];
}

export interface CompanyOnboardingRequest {
    // User fields
    email: string;
    password: string;

    // Company fields
    name: string;
    industry?: string;
    description?: string;
}

// Student onboarding function
export async function onboardStudent(data: StudentOnboardingRequest): Promise<TokenResponse> {
    try {
        const response = await apiRequest<TokenResponse>('/api/onboarding/student', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        // Store token and user data
        setAuthToken(response.access_token);
        setUserData({
            user_id: response.user_id,
            email: response.email,
            role: response.role,
        });

        return response;
    } catch (error) {
        console.error('Student onboarding error:', error);
        throw error;
    }
}

// Company onboarding function
export async function onboardCompany(data: CompanyOnboardingRequest): Promise<TokenResponse> {
    try {
        const response = await apiRequest<TokenResponse>('/api/onboarding/company', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        // Store token and user data
        setAuthToken(response.access_token);
        setUserData({
            user_id: response.user_id,
            email: response.email,
            role: response.role,
        });

        return response;
    } catch (error) {
        console.error('Company onboarding error:', error);
        throw error;
    }
}
