import { useCallback } from 'react';
import useAuth from '@/hooks/useAuth';
import { useApiClient } from '@/lib/apiClient';

export default function useAuthedApi() {
    const { token, signOut } = useAuth();
    const { request } = useApiClient();

    const authedRequest = useCallback(
        async (path, options = {}) => {
            if (!token) {
                const error = new Error('You must be authenticated to perform this action.');
                error.statusCode = 401;
                throw error;
            }

            try {
                return await request(path, {
                    ...options,
                    headers: {
                        ...(options.headers ?? {}),
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                if (error?.statusCode === 401) {
                    await signOut();
                }

                throw error;
            }
        },
        [request, signOut, token],
    );

    return {
        authedRequest,
    };
}
