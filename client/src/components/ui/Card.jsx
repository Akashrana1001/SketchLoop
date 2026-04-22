export default function Card({ title, description, children, className = '' }) {
    return (
        <article className={['rounded-2xl border border-white/80 bg-white/85 p-5 shadow-soft', className].join(' ')}>
            {title ? <h2 className="text-lg font-semibold text-ink">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-ink/70">{description}</p> : null}
            {children ? <div className="mt-4">{children}</div> : null}
        </article>
    );
}
