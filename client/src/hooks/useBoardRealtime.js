import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from '@/hooks/useAuth';
import { REALTIME_BASE_URL } from '@/lib/apiClient';

function normalizeRoomId(roomId) {
    const normalized = roomId?.trim();
    return normalized || 'default-room';
}

function upsertOperation(previousOperations, operation) {
    const existingIndex = previousOperations.findIndex((item) => item.id === operation.id);

    if (existingIndex < 0) {
        return [...previousOperations, operation];
    }

    return previousOperations.map((item, index) => (index === existingIndex ? operation : item));
}

export default function useBoardRealtime(roomIdInput) {
    const { token } = useAuth();
    const roomId = useMemo(() => normalizeRoomId(roomIdInput), [roomIdInput]);
    const socketRef = useRef(null);

    const [connectionState, setConnectionState] = useState('connecting');
    const [participants, setParticipants] = useState([]);
    const [operations, setOperations] = useState([]);
    const [remoteDrafts, setRemoteDrafts] = useState({});
    const [cursors, setCursors] = useState({});
    const [room, setRoom] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setConnectionState('disconnected');
            return undefined;
        }

        const socket = io(REALTIME_BASE_URL, {
            transports: ['websocket'],
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 8,
            reconnectionDelay: 500,
        });

        socketRef.current = socket;

        const handleConnect = () => {
            setConnectionState('connected');
            setErrorMessage('');
            socket.emit('board:join', { roomId });
        };

        const handleDisconnect = () => {
            setConnectionState('disconnected');
        };

        const handleConnectError = () => {
            setConnectionState('disconnected');
            setErrorMessage('Unable to connect to realtime collaboration service.');
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);

        socket.on('board:error', (payload = {}) => {
            setErrorMessage(payload.message || 'Realtime board error encountered.');
        });

        socket.on('board:state', (payload = {}) => {
            setRoom(payload.room ?? null);
            setParticipants(Array.isArray(payload.participants) ? payload.participants : []);
            setOperations(Array.isArray(payload.operations) ? payload.operations : []);
            setRemoteDrafts({});
            setCursors({});
        });

        socket.on('board:participants', (payload = {}) => {
            setRoom(payload.room ?? null);
            setParticipants(Array.isArray(payload.participants) ? payload.participants : []);
        });

        socket.on('board:draft', (payload = {}) => {
            const operation = payload.operation;

            if (!operation?.userId) {
                return;
            }

            setRemoteDrafts((previousDrafts) => ({
                ...previousDrafts,
                [operation.userId]: operation,
            }));
        });

        socket.on('board:draft:cleared', (payload = {}) => {
            if (!payload.userId) {
                return;
            }

            setRemoteDrafts((previousDrafts) => {
                const nextDrafts = { ...previousDrafts };
                delete nextDrafts[payload.userId];
                return nextDrafts;
            });
        });

        socket.on('board:cursor', (payload = {}) => {
            if (!payload.userId || !payload.point) {
                return;
            }

            setCursors((previousCursors) => ({
                ...previousCursors,
                [payload.userId]: payload,
            }));
        });

        socket.on('board:cursor:cleared', (payload = {}) => {
            if (!payload.userId) {
                return;
            }

            setCursors((previousCursors) => {
                const nextCursors = { ...previousCursors };
                delete nextCursors[payload.userId];
                return nextCursors;
            });
        });

        socket.on('board:operation:committed', (payload = {}) => {
            if (!payload.operation) {
                return;
            }

            setRoom(payload.room ?? null);
            setOperations((previousOperations) => upsertOperation(previousOperations, payload.operation));
        });

        socket.on('board:operation:undone', (payload = {}) => {
            if (!payload.operationId) {
                return;
            }

            setRoom(payload.room ?? null);
            setOperations((previousOperations) =>
                previousOperations.filter((operation) => operation.id !== payload.operationId),
            );
        });

        socket.on('board:operation:redone', (payload = {}) => {
            if (!payload.operation) {
                return;
            }

            setRoom(payload.room ?? null);
            setOperations((previousOperations) => upsertOperation(previousOperations, payload.operation));
        });

        socket.on('board:canvas:cleared', (payload = {}) => {
            setRoom(payload.room ?? null);
            setOperations([]);
            setRemoteDrafts({});
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, [roomId, token]);

    const emitCursor = useCallback((point) => {
        const socket = socketRef.current;

        if (!socket || socket.disconnected) {
            return;
        }

        socket.emit('board:cursor', { point });
    }, []);

    const emitDraft = useCallback((operation) => {
        const socket = socketRef.current;

        if (!socket || socket.disconnected) {
            return;
        }

        socket.emit('board:draft', { operation });
    }, []);

    const commitOperation = useCallback((operation) => {
        const socket = socketRef.current;

        if (!socket || socket.disconnected) {
            return;
        }

        socket.emit('board:commit', { operation });
    }, []);

    const undo = useCallback(() => {
        const socket = socketRef.current;

        if (!socket || socket.disconnected) {
            return;
        }

        socket.emit('board:undo');
    }, []);

    const redo = useCallback(() => {
        const socket = socketRef.current;

        if (!socket || socket.disconnected) {
            return;
        }

        socket.emit('board:redo');
    }, []);

    const clearCanvas = useCallback(() => {
        const socket = socketRef.current;

        if (!socket || socket.disconnected) {
            return;
        }

        socket.emit('board:clear');
    }, []);

    return {
        roomId,
        room,
        connectionState,
        participants,
        operations,
        remoteDrafts,
        cursors,
        errorMessage,
        emitCursor,
        emitDraft,
        commitOperation,
        undo,
        redo,
        clearCanvas,
    };
}
