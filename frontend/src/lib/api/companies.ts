import { apiRequest } from './config';

export interface CompanyProfile {
    company_id: string;
    user_id: string;
    name: string;
    industry?: string;
    description?: string;
    email: string;
    verified: boolean;
    phone?: string;
    address?: string;
    size?: string;
    tags?: string[];
    socialLinks?: { type: string; url: string }[];
    profile_photo_url?: string;
}

export async function signupCompany(data: any): Promise<CompanyProfile> {
    return apiRequest<CompanyProfile>('/api/onboarding/company', {
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
