import { apiRequest } from './config';

export interface CompanyProfile {
    company_id: string;
    user_id: string;
    name: string;
    industry?: string;
    description?: string;
    email: string; // From User model
    verified: boolean;
    // Helper fields not in DB but useful for UI state
    size?: string;
    address?: string;
    phone?: string;
    tags?: string[];
    socialLinks?: { type: string; url: string }[];
}

export async function signupCompany(data: any): Promise<CompanyProfile> {
    return apiRequest<CompanyProfile>('/api/companies/signup', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
    return apiRequest<CompanyProfile>('/api/companies/me');
}

export async function updateCompanyProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
    return apiRequest<CompanyProfile>('/api/companies/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}
