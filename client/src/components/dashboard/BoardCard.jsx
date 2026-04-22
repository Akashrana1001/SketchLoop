import Button from '@/components/ui/Button';

function formatLastUpdated(isoDate) {
    if (!isoDate) {
        return 'Recently';
    }

    const updatedAtMs = Date.parse(isoDate);

    if (!Number.isFinite(updatedAtMs)) {
        return 'Recently';
    }

    const minutesAgo = Math.floor((Date.now() - updatedAtMs) / (1000 * 60));

    if (minutesAgo < 1) {
        return 'Just now';
    }

    if (minutesAgo < 60) {
        return `${minutesAgo}m ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);

    if (hoursAgo < 24) {
        return `${hoursAgo}h ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo}d ago`;
}

export default function BoardCard({ board, onOpenBoard }) {
    return (
        <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{board.title}</h3>
                    <p className="mt-1 text-xs font-mono uppercase tracking-[0.16em] text-slate-500">{board.roomId}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {formatLastUpdated(board.updatedAt)}
                </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div
                    className="h-28 w-full opacity-90"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(15, 41, 64, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 41, 64, 0.08) 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                    }}
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                    {board.participants} participant{board.participants === 1 ? '' : 's'}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                    {board.strokes} stroke{board.strokes === 1 ? '' : 's'}
                </span>
            </div>

            <div className="mt-4 flex gap-2">
                <Button type="button" size="sm" className="flex-1" onClick={() => onOpenBoard(board.roomId)}>
                    Open Board
                </Button>
                <Button type="button" size="sm" variant="ghost" className="flex-1" onClick={() => onOpenBoard(board.roomId)}>
                    Join
                </Button>
            </div>
        </article>
    );
}
