import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from '@/context/authContextInstance';
import { createAuthApi } from '@/lib/authApi';
import { useApiClient } from '@/lib/apiClient';
import {
    clearStoredAuthSession,
    isAuthSessionExpired,
    persistAuthSession,
    readStoredAuthSession,
} from '@/lib/authStorage';

const INITIAL_AUTH_STATE = {
    status: 'loading',
    token: null,
    user: null,
    expiresAt: null,
    rememberMe: false,
};

function buildSessionFromResponse(response, rememberMe) {
    const data = response?.data ?? {};

    if (!data.accessToken || !data.user || !data.expiresAt) {
        throw new Error('Authentication response is missing required session information.');
    }

    return {
        token: data.accessToken,
        user: data.user,
        expiresAt: data.expiresAt,
        rememberMe,
    };
}

export function AuthProvider({ children }) {
    const { request } = useApiClient();
    const authApi = useMemo(() => createAuthApi(request), [request]);
    const [authState, setAuthState] = useState(INITIAL_AUTH_STATE);

    const markUnauthenticated = useCallback(() => {
        setAuthState({
            status: 'unauthenticated',
            token: null,
            user: null,
            expiresAt: null,
            rememberMe: false,
        });
    }, []);

    const markAuthenticated = useCallback((session) => {
        setAuthState({
            status: 'authenticated',
            token: session.token,
            user: session.user,
            expiresAt: session.expiresAt,
            rememberMe: session.rememberMe,
        });
    }, []);

    useEffect(() => {
        let isMounted = true;

        const bootstrapAuth = async () => {
            const storedSession = readStoredAuthSession();

            if (!storedSession || isAuthSessionExpired(storedSession)) {
                clearStoredAuthSession();
                if (isMounted) {
                    markUnauthenticated();
                }
                return;
            }

            try {
                const response = await authApi.me(storedSession.token);
                const session = {
                    ...storedSession,
                    user: response?.data?.user ?? storedSession.user,
                };

                persistAuthSession(session);

                if (isMounted) {
                    markAuthenticated(session);
                }
            } catch {
                clearStoredAuthSession();

                if (isMounted) {
                    markUnauthenticated();
                }
            }
        };

        bootstrapAuth();

        return () => {
            isMounted = false;
        };
    }, [authApi, markAuthenticated, markUnauthenticated]);

    useEffect(() => {
        if (authState.status !== 'authenticated' || !authState.expiresAt) {
            return undefined;
        }

        const expiresInMs = Date.parse(authState.expiresAt) - Date.now();

        if (expiresInMs <= 0) {
            clearStoredAuthSession();
            markUnauthenticated();
            return undefined;
        }

        const timerId = window.setTimeout(() => {
            clearStoredAuthSession();
            markUnauthenticated();
        }, expiresInMs);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [authState.expiresAt, authState.status, markUnauthenticated]);

    const signIn = useCallback(
        async ({ email, password, rememberMe }) => {
            const response = await authApi.login({
                email,
                password,
                rememberMe,
            });

            const session = buildSessionFromResponse(response, Boolean(rememberMe));
            persistAuthSession(session);
            markAuthenticated(session);

            return response;
        },
        [authApi, markAuthenticated],
    );

    const signOut = useCallback(async () => {
        const currentToken = authState.token;

        try {
            if (currentToken) {
                await authApi.logout(currentToken);
            }
        } finally {
            clearStoredAuthSession();
            markUnauthenticated();
        }
    }, [authApi, authState.token, markUnauthenticated]);

    const value = useMemo(
        () => ({
            status: authState.status,
            token: authState.token,
            user: authState.user,
            expiresAt: authState.expiresAt,
            rememberMe: authState.rememberMe,
            isAuthenticated: authState.status === 'authenticated',
            isLoading: authState.status === 'loading',
            signIn,
            signOut,
        }),
        [authState, signIn, signOut],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
