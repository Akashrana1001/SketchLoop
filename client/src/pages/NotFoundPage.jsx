import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
    return (
        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/80 bg-white/90 p-8 text-center shadow-soft">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">404</p>
            <h2 className="mt-2 text-3xl font-semibold">Page not found</h2>
            <p className="mt-3 text-sm text-ink/70 sm:text-base">
                The route you requested does not exist in this whiteboard workspace.
            </p>
            <Button as={Link} to="/" className="mt-6">
                Return Home
            </Button>
        </div>
    );
}
