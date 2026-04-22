import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BoardCanvas from '@/components/boards/BoardCanvas';
import BoardToolbar from '@/components/boards/BoardToolbar';
import useBoardRoom from '@/hooks/useBoardRoom';
import useBoardRealtime from '@/hooks/useBoardRealtime';
import { useApiClient } from '@/lib/apiClient';
import { DEFAULT_TOOL, DEFAULT_STROKE_COLOR, DEFAULT_STROKE_SIZE } from '@/lib/whiteboard/constants';

export default function BoardPage() {
    const { roomId: roomIdFromRoute = 'default-room' } = useParams();
    const { request } = useApiClient();
    const { roomId, lastSyncedAt, setConnected, setDisconnected, markSynced } =
        useBoardRoom(roomIdFromRoute);
        
    const realtimeState = useBoardRealtime(roomId);

    const [activeTool, setActiveTool] = useState(DEFAULT_TOOL);
    const [activeColor, setActiveColor] = useState(DEFAULT_STROKE_COLOR);
    const [activeSize, setActiveSize] = useState(DEFAULT_STROKE_SIZE);

    useEffect(() => {
        let isMounted = true;

        const checkApi = async () => {
            try {
                await request('/health');

                if (isMounted) {
                    setConnected();
                }
            } catch (error) {
                console.error('API connection failed', error);

                if (isMounted) {
                    setDisconnected();
                }
            }
        };

        checkApi();

        return () => {
            isMounted = false;
        };
    }, [request, setConnected, setDisconnected]);

    // Use realtimeState operations to mark last synced
    useEffect(() => {
        if (realtimeState.operations.length > 0) {
            markSynced();
        }
    }, [realtimeState.operations, markSynced]);

    return (
        <div className="flex h-full flex-col">
            <BoardToolbar
                roomId={roomId}
                connectionState={realtimeState.connectionState}
                lastSyncedAt={lastSyncedAt}
                
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                
                activeColor={activeColor}
                setActiveColor={setActiveColor}
                
                activeSize={activeSize}
                setActiveSize={setActiveSize}

                onUndo={realtimeState.undo}
                onRedo={realtimeState.redo}
                onClear={realtimeState.clearCanvas}
            />
            
            <BoardCanvas
                operations={realtimeState.operations}
                remoteDrafts={realtimeState.remoteDrafts}
                cursors={realtimeState.cursors}
                emitCursor={realtimeState.emitCursor}
                emitDraft={realtimeState.emitDraft}
                commitOperation={realtimeState.commitOperation}
                
                activeTool={activeTool}
                activeColor={activeColor}
                activeSize={activeSize}
            />
        </div>
    );
}
