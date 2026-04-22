import { Session } from '../models/Session.js';

function isSessionExpired(session) {
    return new Date(session.expiresAt).getTime() <= Date.now();
}

export async function createSession({ token, userEmail, expiresAt, rememberMe = false }) {
    const session = new Session({
        token,
        userEmail,
        rememberMe,
        expiresAt,
    });
    await session.save();
    return session.toObject();
}

export async function getSessionByToken(token) {
    if (!token) {
        return null;
    }

    const session = await Session.findOne({ token }).lean();
    if (!session) {
        return null;
    }

    if (isSessionExpired(session)) {
        await Session.deleteOne({ token });
        return null;
    }

    return session;
}

export async function revokeSessionByToken(token) {
    if (!token) {
        return false;
    }
    const result = await Session.deleteOne({ token });
    return result.deletedCount > 0;
}

export async function revokeSessionsByEmail(userEmail) {
    const result = await Session.deleteMany({ userEmail });
    return result.deletedCount;
}
