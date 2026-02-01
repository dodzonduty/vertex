// API Configuration and Utilities



const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

// Token management
export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('auth_token');
};

// User data management
export const getUserData = (): any | null => {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
};

export const setUserData = (userData: any): void => {
    localStorage.setItem('user_data', JSON.stringify(userData));
};

export const removeUserData = (): void => {
    localStorage.removeItem('user_data');
};

// Generic API request helper
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Merge with any existing headers
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

export { API_BASE_URL };
