// API Configuration and Utilities



const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Token management
export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token') || localStorage.getItem('token');
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

/** Turn FastAPI error detail (string or array of { msg, loc? }) into a single readable string */
function formatApiErrorDetail(detail: unknown, fallbackStatus: number): string {
    if (detail == null) return `Request failed (${fallbackStatus})`;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0];
        const msg = typeof first?.msg === 'string' ? first.msg : first?.msg;
        const loc = Array.isArray(first?.loc) ? first.loc.filter((x: unknown) => typeof x === 'string').join('.') : '';
        return loc ? `${msg} (${loc})` : String(msg ?? JSON.stringify(first));
    }
    return typeof detail === 'object' ? JSON.stringify(detail) : String(detail);
}

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
        const message = formatApiErrorDetail(error?.detail, response.status);
        throw new Error(message);
    }

    return response.json();
}

export { API_BASE_URL };
