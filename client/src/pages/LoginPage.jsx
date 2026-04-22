import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthScene from '@/components/auth/AuthScene';
import CheckboxField from '@/components/forms/CheckboxField';
import FormAlert from '@/components/forms/FormAlert';
import FormField from '@/components/forms/FormField';
import Button from '@/components/ui/Button';
import useAuthForm from '@/hooks/useAuthForm';
import useAuth from '@/hooks/useAuth';
import { validateLoginForm } from '@/lib/validators/authValidators';

function getLoginState(locationState) {
    let redirectTo = '/dashboard';
    let infoMessage = '';
    let authError = '';

    if (!locationState || typeof locationState !== 'object') {
        return {
            redirectTo,
            infoMessage,
            authError,
        };
    }

    if (typeof locationState.from === 'string' && locationState.from.startsWith('/')) {
        redirectTo = locationState.from;
    }

    if (locationState.registeredEmail) {
        infoMessage = `Account created for ${locationState.registeredEmail}. Please sign in.`;
    }

    if (locationState.justLoggedOut) {
        infoMessage = 'You have been logged out successfully.';
    }

    if (locationState.authError) {
        authError = locationState.authError;
    }

    return {
        redirectTo,
        infoMessage,
        authError,
    };
}

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const { redirectTo, infoMessage, authError } = useMemo(
        () => getLoginState(location.state),
        [location.state],
    );

    const {
        values,
        errors,
        isSubmitting,
        submitError,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useAuthForm({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: validateLoginForm,
        onSubmit: async (formValues) => {
            const response = await signIn({
                email: formValues.email.trim().toLowerCase(),
                password: formValues.password,
                rememberMe: formValues.rememberMe,
            });

            navigate(redirectTo, { replace: true });

            return {
                message: response?.message ?? 'Login successful.',
            };
        },
    });

    return (
        <AuthScene
            eyebrow="Secure Access"
            title="Welcome back to your collaborative workspace"
            description="Sign in to continue planning, sketching, and collaborating in your shared whiteboard sessions."
        >
            <section className="rounded-3xl border border-white/20 bg-white/10 p-7 text-white shadow-soft backdrop-blur-xl sm:p-9">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">Login</p>
                <h2 className="mt-2 text-3xl font-semibold">Access your account</h2>
                <p className="mt-2 text-sm text-white/75">
                    Your workspace is one step away. Use your credentials to continue.
                </p>

                <div className="mt-5 space-y-3">
                    <FormAlert message={infoMessage} variant="success" />
                    <FormAlert message={authError} />
                    <FormAlert message={submitError} />
                </div>

                <form className="mt-5 space-y-4" noValidate onSubmit={handleSubmit}>
                    <FormField
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="email"
                        placeholder="you@company.com"
                        error={errors.email}
                        required
                    />

                    <FormField
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        error={errors.password}
                        required
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CheckboxField
                            id="rememberMe"
                            name="rememberMe"
                            label="Remember me"
                            checked={Boolean(values.rememberMe)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            hint="Keep me signed in on this trusted device."
                        />
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-white transition hover:text-rose-100"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="mt-5 text-sm text-white/80">
                    Need an account?{' '}
                    <Link to="/register" className="font-semibold text-white transition hover:text-rose-100">
                        Register here
                    </Link>
                </p>
                <p className="mt-2 text-sm text-white/70">
                    Want to end an active session?{' '}
                    <Link to="/logout" className="font-semibold text-white transition hover:text-rose-100">
                        Open Logout
                    </Link>
                </p>
            </section>
        </AuthScene>
    );
}
