import { useState, useCallback } from 'react';
import { askAI } from '../api/ai';

export interface AIResponse {
    answer: string;
    recommended_students?: any[];
    recommended_companies?: any[];
    recommended_opportunities?: any[];
    status?: string;
}

export function useAI() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<AIResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAskAI = useCallback(async (context?: string) => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const res = await askAI(query, context);
            setResponse(res);
        } catch (err: any) {
            console.error("AI Error:", err);
            setError(err.message || 'Failed to connect to Vertex AI');
            setResponse({
                answer: "I'm sorry, I'm having trouble matching right now. Please try again in a moment.",
                recommended_students: [],
                recommended_companies: [],
                recommended_opportunities: []
            });
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    const reset = useCallback(() => {
        setQuery('');
        setResponse(null);
        setIsLoading(false);
        setError(null);
    }, []);

    return {
        query,
        setQuery,
        response,
        setResponse,
        isLoading,
        setIsLoading,
        error,
        handleAskAI,
        reset
    };
}
