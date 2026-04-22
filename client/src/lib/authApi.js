export function createAuthApi(request) {
    const withAuthHeader = (token, options = {}) => ({
        ...options,
        headers: {
            ...(options.headers ?? {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    return {
        register: (payload) =>
            request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(payload),
            }),
        login: (payload) =>
            request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(payload),
            }),
        logout: (token) =>
            request(
                '/auth/logout',
                withAuthHeader(token, {
                    method: 'POST',
                }),
            ),
        me: (token) =>
            request(
                '/auth/me',
                withAuthHeader(token, {
                    method: 'GET',
                }),
            ),
        forgotPassword: (payload) =>
            request('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify(payload),
            }),
    };
}
