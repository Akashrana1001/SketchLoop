import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

import { env } from '../config/env.js';
import {
    createSession,
    getSessionByToken,
    revokeSessionByToken,
    revokeSessionsByEmail,
} from '../data/sessionStore.js';
import { createUser, getUserByEmail, sanitizeUser, updateUser } from '../data/userStore.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_HASH_KEY_LENGTH = 64;
const SESSION_TOKEN_BYTES = 48;

function createHttpError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function normalizeName(name) {
    const normalized = name?.trim();

    if (!normalized) {
        throw createHttpError('Name is required.');
    }

    if (normalized.length < 2) {
        throw createHttpError('Name must be at least 2 characters.');
    }

    return normalized;
}

function normalizeEmail(email) {
    const normalized = email?.trim().toLowerCase();

    if (!normalized) {
        throw createHttpError('Email is required.');
    }

    if (!EMAIL_REGEX.test(normalized)) {
        throw createHttpError('Please enter a valid email address.');
    }

    return normalized;
}

function validatePassword(password) {
    if (!password) {
        throw createHttpError('Password is required.');
    }

    if (password.length < 8) {
        throw createHttpError('Password must be at least 8 characters.');
    }

    return password;
}

function parseRememberMe(value) {
    return value === true;
}

function getSessionExpiryIso(rememberMe) {
    const ttlHours = rememberMe ? env.authRememberSessionTtlHours : env.authSessionTtlHours;

    return new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
}

function createAccessToken() {
    return randomBytes(SESSION_TOKEN_BYTES).toString('hex');
}

function hashPassword(password, salt) {
    return scryptSync(password, salt, PASSWORD_HASH_KEY_LENGTH).toString('hex');
}

function verifyPassword(password, user) {
    const incomingBuffer = Buffer.from(hashPassword(password, user.salt), 'hex');
    const storedBuffer = Buffer.from(user.passwordHash, 'hex');

    if (incomingBuffer.length !== storedBuffer.length) {
        return false;
    }

    return timingSafeEqual(incomingBuffer, storedBuffer);
}

export async function registerAuthUser(authInput = {}) {
    const name = normalizeName(authInput.name);
    const email = normalizeEmail(authInput.email);
    const password = validatePassword(authInput.password);

    if (await getUserByEmail(email)) {
        throw createHttpError('An account with this email already exists.', 409);
    }

    const salt = randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);

    const user = await createUser({
        name,
        email,
        passwordHash,
        salt,
    });

    return {
        user: sanitizeUser(user),
    };
}

export async function loginAuthUser(authInput = {}) {
    const email = normalizeEmail(authInput.email);
    const password = validatePassword(authInput.password);
    const rememberMe = parseRememberMe(authInput.rememberMe);
    const user = await getUserByEmail(email);

    if (!user || !verifyPassword(password, user)) {
        throw createHttpError('Invalid email or password.', 401);
    }

    await revokeSessionsByEmail(email);

    const accessToken = createAccessToken();
    const expiresAt = getSessionExpiryIso(rememberMe);
    await createSession({
        token: accessToken,
        userEmail: email,
        expiresAt,
        rememberMe,
    });

    const updatedUser = await updateUser(email, {
        lastLoginAt: new Date().toISOString(),
        lastSessionId: accessToken.slice(0, 20),
    });

    return {
        user: sanitizeUser(updatedUser),
        accessToken,
        expiresAt,
    };
}

export async function requestPasswordReset(authInput = {}) {
    const email = normalizeEmail(authInput.email);
    const user = await getUserByEmail(email);

    if (user) {
        await updateUser(email, {
            passwordResetRequestedAt: new Date().toISOString(),
        });
    }

    return {
        success: true,
    };
}

export async function getAuthenticatedUser(accessToken) {
    if (!accessToken) {
        throw createHttpError('Authentication token is required.', 401);
    }

    const session = await getSessionByToken(accessToken);

    if (!session) {
        throw createHttpError('Session is invalid or has expired.', 401);
    }

    const user = await getUserByEmail(session.userEmail);

    if (!user) {
        await revokeSessionByToken(accessToken);
        throw createHttpError('Session is invalid or has expired.', 401);
    }

    return {
        session,
        user: sanitizeUser(user),
    };
}

export async function logoutAuthUser(accessToken) {
    if (accessToken) {
        await revokeSessionByToken(accessToken);
    }

    return {
        success: true,
    };
}
