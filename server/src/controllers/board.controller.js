import {
    createBoardForUser,
    getBoardByRoomId,
    listBoardsForUser,
    saveBoardSnapshot,
} from '../services/board.service.js';

export async function listBoardsController(req, res, next) {
    try {
        const parsedLimit = Number.parseInt(req.query.limit ?? '0', 10);
        const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 0;

        const boards = await listBoardsForUser(req.auth?.user);
        const data = limit > 0 ? boards.slice(0, limit) : boards;

        res.status(200).json({
            count: data.length,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function createBoardController(req, res, next) {
    try {
        const board = await createBoardForUser(req.body ?? {}, req.auth?.user);

        res.status(201).json({
            message: 'Board created successfully.',
            data: board,
        });
    } catch (error) {
        next(error);
    }
}

export async function getBoardController(req, res, next) {
    try {
        const board = await getBoardByRoomId(req.params.roomId);

        res.status(200).json({
            data: board,
        });
    } catch (error) {
        next(error);
    }
}

export async function saveSnapshotController(req, res, next) {
    try {
        const board = await saveBoardSnapshot(req.params.roomId, req.body ?? {});

        res.status(201).json({
            message: 'Snapshot stored.',
            data: board,
        });
    } catch (error) {
        next(error);
    }
}
