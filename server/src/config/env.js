import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 5000;
const DEFAULT_ORIGIN = 'http://localhost:5173';
const DEFAULT_AUTH_SESSION_TTL_HOURS = 12;
const DEFAULT_AUTH_REMEMBER_SESSION_TTL_HOURS = 24 * 30;

const parsedPort = Number.parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10);

if (Number.isNaN(parsedPort)) {
    throw new Error('PORT must be a valid number.');
}

function parsePositiveInteger(value, fallbackValue) {
    const parsed = Number.parseInt(value ?? `${fallbackValue}`, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallbackValue;
    }

    return parsed;
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parsedPort,
    corsOrigin: process.env.CORS_ORIGIN ?? DEFAULT_ORIGIN,
    authSessionTtlHours: parsePositiveInteger(
        process.env.AUTH_SESSION_TTL_HOURS,
        DEFAULT_AUTH_SESSION_TTL_HOURS,
    ),
    authRememberSessionTtlHours: parsePositiveInteger(
        process.env.AUTH_REMEMBER_SESSION_TTL_HOURS,
        DEFAULT_AUTH_REMEMBER_SESSION_TTL_HOURS,
    ),
    mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/whiteboard',
};
