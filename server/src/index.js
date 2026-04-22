import { createServer } from 'node:http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';

import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { registerWhiteboardGateway } from './realtime/whiteboard.gateway.js';


const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false
    },
});
registerWhiteboardGateway(io);

let server;

mongoose
    .connect(env.mongodbUri)
    .then(() => {
        logger.info('Connected to MongoDB database');
        server = httpServer.listen(env.port, () => {
            logger.info(`Server listening on port ${env.port}`);
        });
    })
    .catch((error) => {
        logger.error('Failed to connect to MongoDB', error);
        process.exit(1);
    });

function shutdown(signal) {
    logger.warn(`${signal} received, shutting down gracefully.`);

    io.close();

    server.close((error) => {
        if (error) {
            logger.error('Graceful shutdown failed.', error);
            process.exit(1);
        }

        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
