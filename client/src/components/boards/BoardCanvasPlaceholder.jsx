export default function BoardCanvasPlaceholder() {
    return (
        <section className="relative mt-4 min-h-[480px] overflow-hidden rounded-3xl border border-white/90 bg-white shadow-soft">
            <div
                className="absolute inset-0 opacity-70"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, rgba(16, 42, 67, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 42, 67, 0.08) 1px, transparent 1px)',
                    backgroundSize: '26px 26px',
                }}
            />
            <div className="relative z-10 flex h-full min-h-[480px] flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-accent">Canvas Layer</p>
                <h3 className="text-3xl font-semibold">Realtime drawing board ready</h3>
                <p className="max-w-xl text-sm text-ink/70 sm:text-base">
                    This starter ships with routing, reusable UI, and API wiring. Replace this canvas shell with your
                    preferred realtime drawing engine (for example: WebSocket + CRDT sync).
                </p>
            </div>
        </section>
    );
}
