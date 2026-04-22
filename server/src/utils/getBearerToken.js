export function getBearerToken(req) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return null;
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return null;
    }

    return token;
}
