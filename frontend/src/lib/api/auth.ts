// Authentication API functions

import { apiRequest, setAuthToken, setUserData, removeAuthToken, removeUserData } from './config';

// Types
export interface LoginRequest {
    email: string;
    password: string;
}



export interface TokenResponse {
    access_token: string;
    token_type: string;
    user_id: string;
    email: string;
    role: string;
}

export interface UserResponse {
    user_id: string;
    email: string;
    role: string;
    status?: string;
}

// Login function - Uses real backend API
export async function login(credentials: LoginRequest): Promise<TokenResponse> {
    try {
        const response = await apiRequest<TokenResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
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
        console.error('Login error:', error);
        throw error;
    }
}

// Get current user - Uses real backend API
export async function getCurrentUser(): Promise<UserResponse> {
    try {
        const response = await apiRequest<UserResponse>('/api/auth/me', {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
}

// Logout function
export function logout(): void {
    removeAuthToken();
    removeUserData();
}
