import { apiRequest } from './config';

export interface StudentProfile {
    student_id: string;
    user_id: string;
    full_name: string;
    university: string;
    degree_level: string;
    Email_Address: string;
    email: string;
    role: string;
    status?: string;
    skills?: string[];
    bio?: string;
    ats_score?: number;
    github_url?: string;
    linkedin_url?: string;
    certificates?: any[];
    projects?: any[];
}

export async function getStudentProfile(studentId: string): Promise<StudentProfile> {
    return apiRequest<StudentProfile>(`/api/students/${studentId}`);
}

export async function signupStudent(data: any): Promise<StudentProfile> {
    return apiRequest<StudentProfile>('/api/students/signup', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateStudentProfile(studentId: string, data: Partial<StudentProfile>): Promise<StudentProfile> {
    const endpoint = studentId === 'me' ? '/api/students/me' : `/api/students/${studentId}`;
    return apiRequest<StudentProfile>(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function addProject(data: any): Promise<any> {
    return apiRequest<any>('/api/students/me/projects', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function analyzeCV(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/students/onboarding/analyze-cv`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to analyze CV');
    }

    return response.json();
}

export async function analyzeGitHub(url: string): Promise<any> {
    return apiRequest<any>('/api/students/onboarding/analyze-github', {
        method: 'POST',
        body: JSON.stringify({ url }),
    });
}
