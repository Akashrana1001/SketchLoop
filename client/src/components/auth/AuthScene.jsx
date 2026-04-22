import { Link } from 'react-router-dom';
import Galaxy from '@/components/effects/Galaxy';

const authHighlights = [
    'Enterprise-ready collaboration architecture',
    'Realtime board workflows for distributed teams',
    'Accessible, modern, and responsive experience',
];

export default function AuthScene({ eyebrow, title, description, children }) {
    return (
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/40 bg-[#071523] shadow-soft">
            <div className="absolute inset-0">
                <Galaxy
                    mouseRepulsion={false}
                    mouseInteraction
                    density={1}
                    glowIntensity={0.3}
                    saturation={0}
                    hueShift={140}
                    twinkleIntensity={0.3}
                    rotationSpeed={0.1}
                    repulsionStrength={2}
                    autoCenterRepulsion={0}
                    starSpeed={0.5}
                    speed={1}
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a2136]/65 via-[#0a2136]/80 to-[#081623]/95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,69,80,0.18),transparent_45%)]" />

            <div className="relative z-10 grid min-h-[calc(100vh-8rem)] items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:p-12">
                <div className="text-white">
                    <Link
                        to="/"
                        className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-white/85 transition hover:bg-white/20"
                    >
                        Back to Home
                    </Link>
                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.26em] text-white/65">{eyebrow}</p>
                    <h1 className="mt-3 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">{description}</p>

                    <ul className="mt-7 space-y-3">
                        {authHighlights.map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/10">
                                    <span className="h-2 w-2 rounded-full bg-white" />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mx-auto w-full max-w-lg">{children}</div>
            </div>
        </section>
    );
}
