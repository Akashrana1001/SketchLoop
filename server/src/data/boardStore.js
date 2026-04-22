import { Board } from '../models/Board.js';

function sanitizeTitle(title, roomId) {
    const normalized = title?.trim();
    if (normalized) return normalized;
    return `Board ${roomId.slice(0, 6)}`;
}

function toBoardSummary(board) {
    return {
        roomId: board.roomId,
        title: board.title,
        ownerId: board.ownerId,
        participants: board.participants,
        strokes: board.strokes,
        lastSnapshotId: board.lastSnapshotId,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        preview: {
            strokeCount: board.strokes,
            hasContent: board.operations && board.operations.length > 0,
        },
    };
}

export async function getOrCreateBoard(roomId, options = {}) {
    let board = await Board.findOne({ roomId }).lean();
    if (!board) {
        board = new Board({
            roomId,
            title: sanitizeTitle(options.title, roomId),
            ownerId: options.ownerId ?? null,
            participants: options.participants ?? 0,
        });
        await board.save();
        board = board.toObject();
    }
    return board;
}

export async function createBoard({ roomId, title, ownerId = null }) {
    const existing = await Board.findOne({ roomId });
    if (existing) {
        return null;
    }
    const board = new Board({
        roomId,
        title: sanitizeTitle(title, roomId),
        ownerId,
        participants: 0,
    });
    await board.save();
    return board.toObject();
}

export async function hasBoard(roomId) {
    const count = await Board.countDocuments({ roomId });
    return count > 0;
}

export async function getBoardSummary(roomId) {
    const board = await Board.findOne({ roomId }).lean();
    if (!board) return null;
    return toBoardSummary(board);
}

export async function listBoards() {
    const boards = await Board.find().sort({ updatedAt: -1 }).lean();
    return boards.map(toBoardSummary);
}

export async function updateBoard(roomId, patch) {
    if (patch.title !== undefined) {
        patch.title = sanitizeTitle(patch.title, roomId);
    }
    const updated = await Board.findOneAndUpdate(
        { roomId },
        { $set: patch },
        { new: true, lean: true }
    );
    return updated;
}

export async function setBoardParticipants(roomId, participants) {
    const safeParticipants = Number.isFinite(participants) ? Math.max(0, participants) : 0;
    // We update safely
    return updateBoard(roomId, { participants: safeParticipants });
}

export async function getBoardOperations(roomId) {
    const board = await Board.findOne({ roomId }).lean();
    return board ? board.operations : [];
}

export async function appendBoardOperation(roomId, operation) {
    await Board.findOneAndUpdate(
        { roomId },
        { 
            $push: { operations: operation },
            $inc: { strokes: 1 } 
        },
        { new: true, lean: true }
    );
    return operation;
}

export async function removeLastBoardOperationByUser(roomId, userId) {
    const board = await Board.findOne({ roomId }).lean();
    if (!board || !board.operations || board.operations.length === 0) return null;

    const opIndex = [...board.operations].reverse().findIndex(op => op.userId === userId);
    if (opIndex < 0) return null;
    
    const removeIndex = board.operations.length - 1 - opIndex;
    const removedOperation = board.operations[removeIndex];
    
    // We can pull by exactly this item, or use atomic set via ID or specific index
    board.operations.splice(removeIndex, 1);
    
    await Board.updateOne(
        { roomId },
        { 
            $set: { operations: board.operations },
            strokes: board.operations.length 
        }
    );

    return removedOperation;
}

export async function clearBoardOperations(roomId) {
    return updateBoard(roomId, {
        operations: [],
        strokes: 0,
    });
}
