import { randomUUID } from 'node:crypto';

import {
    appendBoardOperation,
    clearBoardOperations,
    getBoardOperations,
    getBoardSummary,
    getOrCreateBoard,
    removeLastBoardOperationByUser,
    setBoardParticipants,
} from '../data/boardStore.js';
import { getAuthenticatedUser } from '../services/auth.service.js';

const TOOL_CONFIG = {
    pencil: { kind: 'path' },
    eraser: { kind: 'path' },
    line: { kind: 'shape' },
    rectangle: { kind: 'shape' },
    ellipse: { kind: 'shape' },
};

const DEFAULT_COLOR = '#102A43';
const DEFAULT_SIZE = 3;
const MAX_OPERATION_POINTS = 3000;
const PARTICIPANT_COLORS = ['#168AAD', '#D64550', '#2D6A4F', '#CA6702', '#3A0CA3', '#0B7285'];

const roomRuntime = new Map();

function getRuntimeForRoom(roomId) {
    if (!roomRuntime.has(roomId)) {
        roomRuntime.set(roomId, {
            participantsBySocketId: new Map(),
            redoStacksByUserId: new Map(),
        });
    }

    return roomRuntime.get(roomId);
}

function getUserColor(userId) {
    const key = `${userId ?? 'anonymous'}`;
    const hashValue = key.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
    return PARTICIPANT_COLORS[hashValue % PARTICIPANT_COLORS.length];
}

function normalizeRoomId(roomId) {
    const normalized = roomId?.trim();

    if (!normalized) {
        return null;
    }

    return normalized;
}

function normalizePoint(point) {
    if (!point || typeof point !== 'object') {
        return null;
    }

    const x = Number(point.x);
    const y = Number(point.y);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return null;
    }

    return { x, y };
}

function normalizeTool(inputTool) {
    const tool = `${inputTool ?? ''}`.trim().toLowerCase();

    if (!TOOL_CONFIG[tool]) {
        return 'pencil';
    }

    return tool;
}

function normalizeColor(inputColor) {
    if (typeof inputColor !== 'string') {
        return DEFAULT_COLOR;
    }

    const normalized = inputColor.trim();
    const isHexColor = /^#[a-f\d]{6}$/i.test(normalized);

    return isHexColor ? normalized : DEFAULT_COLOR;
}

function normalizeSize(inputSize) {
    const parsed = Number(inputSize);

    if (!Number.isFinite(parsed)) {
        return DEFAULT_SIZE;
    }

    return Math.min(40, Math.max(1, parsed));
}

function buildParticipant(authUser, socketId) {
    return {
        socketId,
        userId: authUser.id,
        name: authUser.name || authUser.email || 'Anonymous user',
        email: authUser.email,
        color: getUserColor(authUser.id),
    };
}

function buildOperationBase(input, participant) {
    return {
        id: typeof input.id === 'string' && input.id.trim() ? input.id.trim() : randomUUID(),
        tool: normalizeTool(input.tool),
        color: normalizeColor(input.color),
        size: normalizeSize(input.size),
        userId: participant.userId,
        userName: participant.name,
        createdAt: new Date().toISOString(),
    };
}

function sanitizePathPoints(pointsInput) {
    if (!Array.isArray(pointsInput)) {
        return [];
    }

    const points = pointsInput
        .map((point) => normalizePoint(point))
        .filter(Boolean)
        .slice(0, MAX_OPERATION_POINTS);

    return points;
}

function sanitizeDraft(input, participant) {
    const base = buildOperationBase(input ?? {}, participant);

    if (TOOL_CONFIG[base.tool].kind === 'path') {
        return {
            ...base,
            points: sanitizePathPoints(input?.points),
        };
    }

    return {
        ...base,
        start: normalizePoint(input?.start),
        end: normalizePoint(input?.end),
    };
}

function sanitizeCommitOperation(input, participant) {
    const base = buildOperationBase(input ?? {}, participant);

    if (TOOL_CONFIG[base.tool].kind === 'path') {
        const points = sanitizePathPoints(input?.points);

        if (points.length < 2) {
            return null;
        }

        return {
            ...base,
            points,
        };
    }

    const start = normalizePoint(input?.start);
    const end = normalizePoint(input?.end);

    if (!start || !end) {
        return null;
    }

    return {
        ...base,
        start,
        end,
    };
}

async function broadcastParticipants(io, roomId) {
    const runtime = getRuntimeForRoom(roomId);
    const participants = Array.from(runtime.participantsBySocketId.values());
    const room = await getBoardSummary(roomId);

    io.to(roomId).emit('board:participants', {
        participants,
        room,
    });
}

function getSocketRoomContext(socket) {
    const roomId = socket.data.roomId;

    if (!roomId) {
        return null;
    }

    const runtime = getRuntimeForRoom(roomId);
    const participant = runtime.participantsBySocketId.get(socket.id);

    if (!participant) {
        return null;
    }

    return {
        roomId,
        runtime,
        participant,
    };
}

export function registerWhiteboardGateway(io) {
    io.use(async (socket, next) => {
        try {
            const authToken = socket.handshake.auth?.token;
            const { user } = await getAuthenticatedUser(authToken);
            socket.data.authUser = user;
            next();
        } catch {
            next(new Error('Unauthorized socket connection.'));
        }
    });

    io.on('connection', (socket) => {
        socket.on('board:join', async (payload = {}) => {
            const roomId = normalizeRoomId(payload.roomId);

            if (!roomId) {
                socket.emit('board:error', { message: 'A valid room ID is required.' });
                return;
            }

            const authUser = socket.data.authUser;
            await getOrCreateBoard(roomId, {
                title: payload.title,
                ownerId: authUser.id,
            });

            const runtime = getRuntimeForRoom(roomId);
            const participant = buildParticipant(authUser, socket.id);

            runtime.participantsBySocketId.set(socket.id, participant);

            socket.join(roomId);
            socket.data.roomId = roomId;

            await setBoardParticipants(roomId, runtime.participantsBySocketId.size);

            const operations = await getBoardOperations(roomId);
            const participants = Array.from(runtime.participantsBySocketId.values());

            socket.emit('board:state', {
                room: await getBoardSummary(roomId),
                operations,
                participants,
                self: participant,
            });

            await broadcastParticipants(io, roomId);
        });

        socket.on('board:cursor', (payload = {}) => {
            const context = getSocketRoomContext(socket);

            if (!context) {
                return;
            }

            const point = normalizePoint(payload.point);

            if (!point) {
                return;
            }

            socket.to(context.roomId).emit('board:cursor', {
                userId: context.participant.userId,
                name: context.participant.name,
                color: context.participant.color,
                point,
            });
        });

        socket.on('board:draft', (payload = {}) => {
            const context = getSocketRoomContext(socket);

            if (!context) {
                return;
            }

            const draft = sanitizeDraft(payload.operation ?? {}, context.participant);

            socket.to(context.roomId).emit('board:draft', {
                operation: draft,
            });
        });

        socket.on('board:commit', async (payload = {}) => {
            const context = getSocketRoomContext(socket);

            if (!context) {
                return;
            }

            const operation = sanitizeCommitOperation(payload.operation ?? {}, context.participant);

            if (!operation) {
                return;
            }

            await appendBoardOperation(context.roomId, operation);
            context.runtime.redoStacksByUserId.set(context.participant.userId, []);

            io.to(context.roomId).emit('board:operation:committed', {
                operation,
                room: await getBoardSummary(context.roomId),
            });

            io.to(context.roomId).emit('board:draft:cleared', {
                userId: context.participant.userId,
            });
        });

        socket.on('board:undo', async () => {
            const context = getSocketRoomContext(socket);

            if (!context) {
                return;
            }

            const removedOperation = await removeLastBoardOperationByUser(context.roomId, context.participant.userId);

            if (!removedOperation) {
                return;
            }

            const redoStack = context.runtime.redoStacksByUserId.get(context.participant.userId) ?? [];
            redoStack.push(removedOperation);
            context.runtime.redoStacksByUserId.set(context.participant.userId, redoStack);

            io.to(context.roomId).emit('board:operation:undone', {
                operationId: removedOperation.id,
                userId: context.participant.userId,
                room: await getBoardSummary(context.roomId),
            });
        });

        socket.on('board:redo', async () => {
            const context = getSocketRoomContext(socket);

            if (!context) {
                return;
            }

            const redoStack = context.runtime.redoStacksByUserId.get(context.participant.userId) ?? [];
            const restoredOperation = redoStack.pop();

            if (!restoredOperation) {
                return;
            }

            context.runtime.redoStacksByUserId.set(context.participant.userId, redoStack);
            await appendBoardOperation(context.roomId, restoredOperation);

            io.to(context.roomId).emit('board:operation:redone', {
                operation: restoredOperation,
                userId: context.participant.userId,
                room: await getBoardSummary(context.roomId),
            });
        });

        socket.on('board:clear', async () => {
            const context = getSocketRoomContext(socket);

            if (!context) {
                return;
            }

            await clearBoardOperations(context.roomId);
            context.runtime.redoStacksByUserId.clear();

            io.to(context.roomId).emit('board:canvas:cleared', {
                room: await getBoardSummary(context.roomId),
                userId: context.participant.userId,
            });
        });

        socket.on('disconnect', async () => {
            const roomId = socket.data.roomId;

            if (!roomId) {
                return;
            }

            const runtime = getRuntimeForRoom(roomId);
            const participant = runtime.participantsBySocketId.get(socket.id);
            runtime.participantsBySocketId.delete(socket.id);

            if (participant) {
                socket.to(roomId).emit('board:draft:cleared', {
                    userId: participant.userId,
                });

                socket.to(roomId).emit('board:cursor:cleared', {
                    userId: participant.userId,
                });
            }

            await setBoardParticipants(roomId, runtime.participantsBySocketId.size);

            if (runtime.participantsBySocketId.size === 0) {
                roomRuntime.delete(roomId);
            }

            await broadcastParticipants(io, roomId);
        });
    });
}
