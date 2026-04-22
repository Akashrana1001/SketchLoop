import { PATH_TOOLS } from '@/lib/whiteboard/constants';

export function drawCanvasBackground(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(15, 41, 64, 0.08)';
    ctx.lineWidth = 1;

    const gap = 24;

    for (let x = 0; x <= width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = 0; y <= height; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.restore();
}

function drawPath(ctx, operation) {
    if (!Array.isArray(operation.points) || operation.points.length < 2) {
        return;
    }

    ctx.beginPath();
    ctx.moveTo(operation.points[0].x, operation.points[0].y);

    for (let index = 1; index < operation.points.length; index += 1) {
        const point = operation.points[index];
        ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();
}

function drawLine(ctx, operation) {
    if (!operation.start || !operation.end) {
        return;
    }

    ctx.beginPath();
    ctx.moveTo(operation.start.x, operation.start.y);
    ctx.lineTo(operation.end.x, operation.end.y);
    ctx.stroke();
}

function drawRectangle(ctx, operation) {
    if (!operation.start || !operation.end) {
        return;
    }

    const width = operation.end.x - operation.start.x;
    const height = operation.end.y - operation.start.y;

    ctx.strokeRect(operation.start.x, operation.start.y, width, height);
}

function drawEllipse(ctx, operation) {
    if (!operation.start || !operation.end) {
        return;
    }

    const centerX = (operation.start.x + operation.end.x) / 2;
    const centerY = (operation.start.y + operation.end.y) / 2;
    const radiusX = Math.abs(operation.end.x - operation.start.x) / 2;
    const radiusY = Math.abs(operation.end.y - operation.start.y) / 2;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
}

export function drawOperation(ctx, operation) {
    if (!operation || typeof operation !== 'object') {
        return;
    }

    ctx.save();
    ctx.strokeStyle = operation.color || '#102a43';
    ctx.lineWidth = operation.size || 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = operation.tool === 'eraser' ? 'destination-out' : 'source-over';

    if (PATH_TOOLS.has(operation.tool)) {
        drawPath(ctx, operation);
    } else if (operation.tool === 'line') {
        drawLine(ctx, operation);
    } else if (operation.tool === 'rectangle') {
        drawRectangle(ctx, operation);
    } else if (operation.tool === 'ellipse') {
        drawEllipse(ctx, operation);
    }

    ctx.restore();
}

export function drawCursor(ctx, cursor) {
    if (!cursor?.point) {
        return;
    }

    ctx.save();
    ctx.fillStyle = cursor.color || '#168AAD';
    ctx.beginPath();
    ctx.arc(cursor.point.x, cursor.point.y, 5, 0, Math.PI * 2);
    ctx.fill();

    const label = cursor.name || 'User';
    ctx.font = '12px Space Grotesk, sans-serif';
    const labelPaddingX = 8;
    const labelHeight = 22;
    const textWidth = ctx.measureText(label).width;

    const x = cursor.point.x + 10;
    const y = cursor.point.y - 30;

    ctx.fillStyle = 'rgba(15, 41, 64, 0.88)';
    ctx.beginPath();
    ctx.roundRect(x, y, textWidth + labelPaddingX * 2, labelHeight, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, x + labelPaddingX, y + 15);
    ctx.restore();
}
