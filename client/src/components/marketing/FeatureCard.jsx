export default function FeatureCard({ icon, title, description }) {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white transition group-hover:bg-accent">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">{description}</p>
        </article>
    );
}
