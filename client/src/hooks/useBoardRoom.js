import { useCallback, useMemo, useState } from 'react';

export default function useBoardRoom(initialRoomId) {
    const roomId = useMemo(() => {
        const trimmed = initialRoomId?.trim();
        return trimmed ? trimmed : 'default-room';
    }, [initialRoomId]);

    const [connectionState, setConnectionState] = useState('connecting');
    const [lastSyncedAt, setLastSyncedAt] = useState(null);

    const setConnected = useCallback(() => {
        setConnectionState('connected');
        setLastSyncedAt(new Date());
    }, []);

    const setDisconnected = useCallback(() => {
        setConnectionState('disconnected');
    }, []);

    const markSynced = useCallback(() => {
        setLastSyncedAt(new Date());
    }, []);

    return {
        roomId,
        connectionState,
        lastSyncedAt,
        setConnected,
        setDisconnected,
        markSynced,
    };
}
