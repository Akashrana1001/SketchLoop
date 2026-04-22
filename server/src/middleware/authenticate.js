import { getAuthenticatedUser } from '../services/auth.service.js';
import { getBearerToken } from '../utils/getBearerToken.js';

export async function requireAuth(req, res, next) {
    try {
        const token = getBearerToken(req);
        const { user, session } = await getAuthenticatedUser(token);

        req.auth = {
            token,
            user,
            session,
        };

        next();
    } catch (error) {
        next(error);
    }
}
