import { randomUUID } from 'node:crypto';

import {
    createBoard,
    getBoardSummary,
    getOrCreateBoard,
    hasBoard,
    listBoards,
    updateBoard,
} from '../data/boardStore.js';

function normalizeRoomId(roomId) {
    const normalized = roomId?.trim();

    if (!normalized) {
        const error = new Error('roomId is required');
        error.statusCode = 400;
        throw error;
    }

    return normalized;
}

function parseNonNegativeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizeBoardTitle(title) {
    const normalized = title?.trim();

    if (!normalized) {
        return null;
    }

    return normalized;
}

function buildBoardRoomId(roomIdInput) {
    if (roomIdInput) {
        return normalizeRoomId(roomIdInput);
    }

    return `board-${randomUUID().slice(0, 8)}`;
}

export async function listBoardsForUser() {
    return await listBoards();
}

export async function createBoardForUser(boardInput = {}, authUser = null) {
    const roomId = buildBoardRoomId(boardInput.roomId);
    const title = normalizeBoardTitle(boardInput.title);
    const ownerId = authUser?.id ?? null;

    if (await hasBoard(roomId)) {
        const error = new Error('A board with this ID already exists.');
        error.statusCode = 409;
        throw error;
    }

    const board = await createBoard({
        roomId,
        title,
        ownerId,
    });

    return await getBoardSummary(board.roomId);
}

export async function getBoardByRoomId(roomId) {
    const normalized = normalizeRoomId(roomId);
    await getOrCreateBoard(normalized);
    return await getBoardSummary(normalized);
}

export async function saveBoardSnapshot(roomId, snapshotInput = {}) {
    const normalized = normalizeRoomId(roomId);

    const updatedBoard = await updateBoard(normalized, {
        title: normalizeBoardTitle(snapshotInput.title),
        participants: parseNonNegativeNumber(snapshotInput.participants, 1),
        strokes: parseNonNegativeNumber(snapshotInput.strokes, 0),
        lastSnapshotId: snapshotInput.snapshotId?.trim() || randomUUID(),
    });

    return await getBoardSummary(updatedBoard.roomId);
}
