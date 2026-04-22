export function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        next(error);
        return;
    }

    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    const message = statusCode === 500 ? 'Unexpected server error.' : error.message;

    res.status(statusCode).json({
        message,
        path: req.originalUrl,
    });
}
