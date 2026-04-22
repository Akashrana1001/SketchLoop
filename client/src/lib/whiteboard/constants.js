export const TOOL_OPTIONS = [
    { id: 'pencil', label: 'Pencil' },
    { id: 'eraser', label: 'Eraser' },
    { id: 'line', label: 'Line' },
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'ellipse', label: 'Ellipse' },
];

export const PATH_TOOLS = new Set(['pencil', 'eraser']);
export const SHAPE_TOOLS = new Set(['line', 'rectangle', 'ellipse']);

export const DEFAULT_TOOL = 'pencil';
export const DEFAULT_STROKE_COLOR = '#102a43';
export const DEFAULT_STROKE_SIZE = 3;
