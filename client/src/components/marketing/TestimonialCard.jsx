export default function TestimonialCard({ quote, name, role }) {
    return (
        <article className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-soft">
            <p className="text-sm leading-6 text-ink/80">&ldquo;{quote}&rdquo;</p>
            <div className="mt-4">
                <p className="text-sm font-semibold text-ink">{name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-ink/50">{role}</p>
            </div>
        </article>
    );
}
