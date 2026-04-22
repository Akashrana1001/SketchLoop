import {
    loginAuthUser,
    logoutAuthUser,
    registerAuthUser,
    requestPasswordReset,
} from '../services/auth.service.js';
import { getBearerToken } from '../utils/getBearerToken.js';

export async function registerController(req, res, next) {
    try {
        const { user } = await registerAuthUser(req.body ?? {});

        res.status(201).json({
            message: 'Account created successfully.',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
}

export async function loginController(req, res, next) {
    try {
        const { user, accessToken, expiresAt } = await loginAuthUser(req.body ?? {});

        res.status(200).json({
            message: 'Login successful.',
            data: {
                user,
                accessToken,
                expiresAt,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function forgotPasswordController(req, res, next) {
    try {
        await requestPasswordReset(req.body ?? {});

        res.status(200).json({
            message: 'If the account exists, reset instructions have been sent.',
        });
    } catch (error) {
        next(error);
    }
}

export function meController(req, res) {
    const user = req.auth?.user ?? null;
    const session = req.auth?.session ?? null;

    res.status(200).json({
        data: {
            user,
            expiresAt: session?.expiresAt,
        },
    });
}

export async function logoutController(req, res, next) {
    try {
        const token = getBearerToken(req);
        await logoutAuthUser(token);

        res.status(200).json({
            message: 'Logged out successfully.',
        });
    } catch (error) {
        next(error);
    }
}
