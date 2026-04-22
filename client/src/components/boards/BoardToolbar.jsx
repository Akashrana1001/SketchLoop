import Button from '@/components/ui/Button';
import { TOOL_OPTIONS } from '@/lib/whiteboard/constants';

const COLORS = [
    { value: '#102A43', label: 'Dark' },
    { value: '#D64550', label: 'Red' },
    { value: '#168AAD', label: 'Blue' },
    { value: '#2D6A4F', label: 'Green' },
    { value: '#CA6702', label: 'Orange' },
    { value: '#3A0CA3', label: 'Purple' }
];

const SIZES = [
    { value: 1, label: 'S' },
    { value: 3, label: 'M' },
    { value: 6, label: 'L' },
    { value: 12, label: 'XL' }
];

function formatSyncTime(value) {
    if (!value) {
        return 'Waiting for sync...';
    }

    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(value);
}

export default function BoardToolbar({ 
    roomId, 
    connectionState, 
    lastSyncedAt, 
    onSnapshot,
    activeTool,
    setActiveTool,
    activeColor,
    setActiveColor,
    activeSize,
    setActiveSize,
    onUndo,
    onRedo,
    onClear
}) {
    const stateStyles = {
        connected: 'bg-emerald-100 text-emerald-700',
        connecting: 'bg-amber-100 text-amber-700',
        disconnected: 'bg-rose-100 text-rose-700',
    };

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-soft">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Room</p>
                    <p className="text-lg font-semibold">{roomId}</p>
                    <p className="mt-1 text-sm text-ink/70">Last sync: {formatSyncTime(lastSyncedAt)}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={[
                            'rounded-full px-3 py-1 text-xs font-semibold capitalize',
                            stateStyles[connectionState] ?? stateStyles.disconnected,
                        ].join(' ')}
                    >
                        {connectionState}
                    </span>
                    <Button type="button" onClick={onSnapshot} variant="ghost" size="sm">
                        Refresh
                    </Button>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied to clipboard!");
                        }}
                    >
                        Copy Link
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                {/* Tools */}
                <div className="flex gap-1 rounded-lg bg-slate-50 p-1 border border-slate-200">
                    {TOOL_OPTIONS.map(tool => (
                        <button
                            key={tool.id}
                            type="button"
                            onClick={() => setActiveTool(tool.id)}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                activeTool === tool.id 
                                    ? 'bg-white text-ink shadow-sm ring-1 ring-slate-200' 
                                    : 'text-slate-600 hover:text-ink hover:bg-slate-200/50'
                            }`}
                        >
                            {tool.label}
                        </button>
                    ))}
                </div>

                {/* Colors & Sizes Wrapper */}
                <div className="flex items-center gap-4">
                    {/* Colors */}
                    <div className="flex items-center gap-1.5">
                        {COLORS.map(color => (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => setActiveColor(color.value)}
                                className={`h-6 w-6 rounded-full transition-transform ${
                                    activeColor === color.value ? 'scale-125 ring-2 ring-offset-2 ring-slate-300' : 'hover:scale-110'
                                }`}
                                style={{ backgroundColor: color.value }}
                                aria-label={color.label}
                                title={color.label}
                            />
                        ))}
                    </div>

                    <div className="h-6 w-px bg-slate-200" />

                    {/* Stroke Sizes */}
                    <div className="flex gap-1 rounded-lg bg-slate-50 p-1 border border-slate-200">
                        {SIZES.map(size => (
                            <button
                                key={size.value}
                                type="button"
                                onClick={() => setActiveSize(size.value)}
                                className={`flex h-8 min-w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                                    activeSize === size.value
                                        ? 'bg-white text-ink shadow-sm ring-1 ring-slate-200'
                                        : 'text-slate-500 hover:text-ink hover:bg-slate-200/50'
                                }`}
                                title={`Stroke Size: ${size.label}`}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={onUndo} title="Undo">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M6.5 4L2.5 7.5L6.5 11" stroke="currentColor" strokeLinecap="square"/><path d="M4.5 7.5H10.5C11.6046 7.5 12.5 8.39543 12.5 9.5V13" stroke="currentColor" strokeLinecap="square"/></svg>
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={onRedo} title="Redo">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M8.5 4L12.5 7.5L8.5 11" stroke="currentColor" strokeLinecap="square"/><path d="M10.5 7.5H4.5C3.39543 7.5 2.5 8.39543 2.5 9.5V13" stroke="currentColor" strokeLinecap="square"/></svg>
                    </Button>
                    <div className="h-8 w-px bg-slate-200 mx-1" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => {
                        if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
                            onClear();
                        }
                    }} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    );
}
