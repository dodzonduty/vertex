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
}

export async function getStudentProfile(studentId: string): Promise<StudentProfile> {
    return apiRequest<StudentProfile>(`/api/students/${studentId}`);
}

// Additional functions for updating profile can be added here
export async function updateStudentProfile(studentId: string, data: Partial<StudentProfile>): Promise<StudentProfile> {
    return apiRequest<StudentProfile>(`/api/students/${studentId}`, {
        method: 'PATCH', // Or PUT depending on backend implementation
        body: JSON.stringify(data),
    });
}
