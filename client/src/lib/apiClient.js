import { useCallback } from 'react';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api').replace(
    /\/$/,
    '',
);
export const REALTIME_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

async function baseRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers ?? {}),
        },
    });

    const contentType = response.headers.get('content-type');
    const payload = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const errorMessage = typeof payload === 'string' ? payload : payload?.message;
        const error = new Error(errorMessage || `Request failed with status ${response.status}`);
        error.statusCode = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export function useApiClient() {
    const request = useCallback((path, options) => baseRequest(path, options), []);

    return {
        request,
        baseUrl: API_BASE_URL,
    };
}
