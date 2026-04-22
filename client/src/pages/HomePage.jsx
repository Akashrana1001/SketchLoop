import { Link } from 'react-router-dom';
import LightRays from '@/components/effects/LightRays';
import FeatureCard from '@/components/marketing/FeatureCard';
import TestimonialCard from '@/components/marketing/TestimonialCard';
import Button from '@/components/ui/Button';

const PencilIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l4 4M4 20l4.5-1 9-9-3.5-3.5-9 9L4 20z" />
    </svg>
);

const LightningIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
);

const ShieldIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v6c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V7l8-4z" />
    </svg>
);

const featureCards = [
    {
        title: 'Live Cursor Collaboration',
        description: 'Multiple teammates sketch, annotate, and ideate in the same room with instant updates.',
        icon: PencilIcon,
    },
    {
        title: 'Fast Session Sync',
        description: 'Efficient room state sync keeps boards fluid and reliable even during intense workshops.',
        icon: LightningIcon,
    },
    {
        title: 'Secure Team Workspaces',
        description: 'Structured API boundaries and security middleware support enterprise-grade collaboration.',
        icon: ShieldIcon,
    },
];

const trustIndicators = ['Used by product teams', 'Built for remote workshops', 'Powered by real-time APIs'];

const testimonials = [
    {
        quote: 'We replaced three fragmented tools with this whiteboard workflow and our sprint planning time dropped by 30%.',
        name: 'Avery Kim',
        role: 'Head of Product, Northline',
    },
    {
        quote: 'The experience feels premium and responsive, even with distributed teams collaborating across multiple time zones.',
        name: 'Nia Rodriguez',
        role: 'Design Director, ArcMetric',
    },
];

export default function HomePage() {
    return (
        <div className="pb-8">
            <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/55 bg-gradient-to-b from-[#0f2940] via-[#15364c] to-[#102a43] px-6 pb-14 pt-12 text-white shadow-soft sm:px-10 sm:pt-16">
                <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-full max-w-5xl -translate-x-1/2 opacity-80">
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#ffffff"
                        raysSpeed={1}
                        lightSpread={0.5}
                        rayLength={3}
                        followMouse
                        mouseInfluence={0.1}
                        noiseAmount={0}
                        distortion={0}
                        className="animate-float-ambient"
                        pulsating={false}
                        fadeDistance={1}
                        saturation={1}
                    />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,69,80,0.35),transparent_45%)]" />

                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.28em] text-white/70">
                        Collaborative Whiteboard
                    </p>
                    <h1 className="animate-fade-up mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                        Turn team ideas into aligned execution in one shared canvas.
                    </h1>
                    <p className="animate-fade-up mt-5 text-base leading-7 text-white/80 sm:text-lg">
                        Plan, sketch, and collaborate in real time with a modern whiteboard built for fast-moving
                        product and design teams.
                    </p>

                    <div className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button as={Link} to="/board/demo-room" size="lg" variant="secondary">
                            Start Whiteboarding
                        </Button>
                        <Button as="a" href="#features" size="lg" variant="glass">
                            Explore Features
                        </Button>
                    </div>

                    <div className="animate-fade-up mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {trustIndicators.map((item) => (
                            <div
                                key={item}
                                className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur-sm"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="mt-16 scroll-mt-24">
                <div className="mb-6 max-w-2xl">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Features</p>
                    <h2 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Everything your team needs to co-create faster</h2>
                    <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
                        Purpose-built collaboration tools with clean architecture, polished interactions, and
                        scalable infrastructure foundations.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {featureCards.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="animate-fade-up"
                                style={{
                                    animationDelay: `${120 + index * 100}ms`,
                                }}
                            >
                                <FeatureCard
                                    icon={<Icon />}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="mt-16 grid gap-6 lg:grid-cols-5">
                <div className="space-y-4 lg:col-span-2">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Trusted Results</p>
                    <h3 className="text-2xl font-semibold text-ink sm:text-3xl">
                        Teams rely on collaborative canvases to make decisions with confidence.
                    </h3>
                    <div className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-soft">
                        <p className="text-sm text-ink/70">Customer satisfaction</p>
                        <p className="mt-2 text-4xl font-semibold text-ink">98%</p>
                        <p className="mt-1 text-sm text-ink/60">across product discovery and planning workflows</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.name}
                            quote={testimonial.quote}
                            name={testimonial.name}
                            role={testimonial.role}
                        />
                    ))}
                </div>
            </section>

            <section className="mt-16 rounded-3xl border border-white/80 bg-white/90 p-7 shadow-soft sm:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Ready to launch</p>
                        <h3 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">Bring your next workshop to life in minutes</h3>
                        <p className="mt-2 max-w-2xl text-sm text-ink/70 sm:text-base">
                            Start with the demo board and evolve this foundation into your team&rsquo;s full real-time
                            collaboration platform.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button as={Link} to="/register" size="lg">
                            Create Free Account
                        </Button>
                        <Button as={Link} to="/login" variant="ghost" size="lg">
                            Login
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
