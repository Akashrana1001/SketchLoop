import { useEffect, useRef, useState, useCallback } from 'react';
import { drawCanvasBackground, drawOperation, drawCursor } from '@/lib/whiteboard/drawing';

function getEventPoint(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

export default function BoardCanvas({
    operations,
    remoteDrafts,
    cursors,
    emitCursor,
    emitDraft,
    commitOperation,
    activeTool,
    activeColor,
    activeSize,
}) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [localDraft, setLocalDraft] = useState(null);

    // Render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const render = () => {
            // Resize handler integrated in render loop for crisp scaling
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
            }

            ctx.save();
            ctx.scale(dpr, dpr);

            drawCanvasBackground(ctx, rect.width, rect.height);

            // Draw committed operations
            operations.forEach((op) => drawOperation(ctx, op));

            // Draw remote drafts
            Object.values(remoteDrafts).forEach((draft) => drawOperation(ctx, draft));

            // Draw local draft
            if (localDraft) {
                drawOperation(ctx, localDraft);
            }

            // Draw remote cursors
            Object.values(cursors).forEach((cursor) => drawCursor(ctx, cursor));

            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [operations, remoteDrafts, localDraft, cursors]);

    // Handle cursor tracking
    const handlePointerMove = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const point = getEventPoint(e, canvas);
        
        // Always emit cursor
        emitCursor(point);

        if (isPointerDown) {
            setLocalDraft((prev) => {
                if (!prev) return prev;
                let nextDraft;
                if (prev.tool === 'pencil' || prev.tool === 'eraser') {
                    nextDraft = {
                        ...prev,
                        points: [...prev.points, point],
                    };
                } else {
                    nextDraft = {
                        ...prev,
                        end: point,
                    };
                }
                
                // Emit draft frequently
                emitDraft(nextDraft);
                return nextDraft;
            });
        }
    }, [isPointerDown, emitCursor, emitDraft]);

    const handlePointerDown = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // prevent scrolling on mobile while drawing
        if (e.target === canvas) {
            e.preventDefault();
        }

        const point = getEventPoint(e, canvas);
        setIsPointerDown(true);

        const newDraft = {
            id: crypto.randomUUID(),
            tool: activeTool,
            color: activeColor,
            size: activeSize,
        };

        if (activeTool === 'pencil' || activeTool === 'eraser') {
            newDraft.points = [point];
        } else {
            newDraft.start = point;
            newDraft.end = point;
        }

        setLocalDraft(newDraft);
        emitDraft(newDraft);
    }, [activeTool, activeColor, activeSize, emitDraft]);

    const handlePointerUp = useCallback(() => {
        if (!isPointerDown || !localDraft) return;

        setIsPointerDown(false);
        commitOperation(localDraft);
        setLocalDraft(null);
    }, [isPointerDown, localDraft, commitOperation]);

    const handlePointerLeave = useCallback(() => {
        // Just hide local draft/commit if it was drawing
        if (isPointerDown && localDraft) {
            setIsPointerDown(false);
            commitOperation(localDraft);
            setLocalDraft(null);
        }
    }, [isPointerDown, localDraft, commitOperation]);

    return (
        <section 
            ref={containerRef}
            className="relative mt-4 min-h-[600px] w-full overflow-hidden rounded-3xl border border-white/90 bg-white shadow-soft"
            style={{ touchAction: 'none' }} // crucial for pointer events on mobile
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block cursor-crosshair touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerCancel={handlePointerLeave}
            />
        </section>
    );
}
