const AUTH_LOCAL_STORAGE_KEY = 'whiteboard.auth.local';
const AUTH_SESSION_STORAGE_KEY = 'whiteboard.auth.session';
const STORAGE_VERSION = 1;

function isBrowser() {
    return typeof window !== 'undefined';
}

function parseStoredValue(rawValue) {
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue);

        if (!parsed || parsed.version !== STORAGE_VERSION || !parsed.payload) {
            return null;
        }

        return parsed.payload;
    } catch {
        return null;
    }
}

function serializePayload(payload) {
    return JSON.stringify({
        version: STORAGE_VERSION,
        payload,
    });
}

export function isAuthSessionExpired(session) {
    if (!session?.expiresAt) {
        return true;
    }

    return Date.parse(session.expiresAt) <= Date.now();
}

export function clearStoredAuthSession() {
    if (!isBrowser()) {
        return;
    }

    window.localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function readStoredAuthSession() {
    if (!isBrowser()) {
        return null;
    }

    const localSession = parseStoredValue(window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEY));

    if (localSession) {
        return {
            ...localSession,
            rememberMe: true,
        };
    }

    const sessionStorageSession = parseStoredValue(window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY));

    if (sessionStorageSession) {
        return {
            ...sessionStorageSession,
            rememberMe: false,
        };
    }

    return null;
}

export function persistAuthSession(session) {
    if (!isBrowser()) {
        return;
    }

    const payload = {
        token: session.token,
        user: session.user,
        expiresAt: session.expiresAt,
    };

    if (session.rememberMe) {
        window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, serializePayload(payload));
        window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        return;
    }

    window.sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, serializePayload(payload));
    window.localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
}
