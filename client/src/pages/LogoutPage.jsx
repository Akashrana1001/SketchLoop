import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthScene from '@/components/auth/AuthScene';
import FormAlert from '@/components/forms/FormAlert';
import Button from '@/components/ui/Button';
import useAuth from '@/hooks/useAuth';

export default function LogoutPage() {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleLogout = async () => {
        setSubmitError('');
        setIsSubmitting(true);

        try {
            await signOut();
            navigate('/', { replace: true });
        } catch (error) {
            const fallbackMessage = 'Unable to complete logout right now.';
            setSubmitError(error instanceof Error ? error.message : fallbackMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthScene
            eyebrow="Session Control"
            title="Securely sign out of your collaborative workspace"
            description="Use this action when you are done, especially on shared devices or public workstations."
        >
            <section className="rounded-3xl border border-white/20 bg-white/10 p-7 text-white shadow-soft backdrop-blur-xl sm:p-9">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">Logout</p>
                <h2 className="mt-2 text-3xl font-semibold">Ready to sign out?</h2>
                <p className="mt-2 text-sm text-white/75">
                    This will close your active session in this browser and redirect you to the home page.
                </p>

                <div className="mt-5 space-y-3">
                    <FormAlert message={submitError} />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button type="button" size="lg" className="sm:flex-1" onClick={handleLogout} disabled={isSubmitting}>
                        {isSubmitting ? 'Logging out...' : 'Logout Now'}
                    </Button>
                    <Button as={Link} to="/" variant="ghost" size="lg" className="border-white/50 text-white hover:bg-white/15 sm:flex-1">
                        Cancel
                    </Button>
                </div>
            </section>
        </AuthScene>
    );
}
