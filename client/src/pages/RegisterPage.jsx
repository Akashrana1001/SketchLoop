import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthScene from '@/components/auth/AuthScene';
import FormAlert from '@/components/forms/FormAlert';
import FormField from '@/components/forms/FormField';
import PasswordStrengthIndicator from '@/components/forms/PasswordStrengthIndicator';
import Button from '@/components/ui/Button';
import useAuthForm from '@/hooks/useAuthForm';
import { createAuthApi } from '@/lib/authApi';
import { useApiClient } from '@/lib/apiClient';
import { validateRegisterForm } from '@/lib/validators/authValidators';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { request } = useApiClient();
    const authApi = useMemo(() => createAuthApi(request), [request]);

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
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: validateRegisterForm,
        onSubmit: async (formValues) => {
            const normalizedEmail = formValues.email.trim().toLowerCase();

            const response = await authApi.register({
                name: formValues.name.trim(),
                email: normalizedEmail,
                password: formValues.password,
            });

            navigate('/login', {
                replace: true,
                state: {
                    registeredEmail: normalizedEmail,
                },
            });

            return {
                message: response?.message ?? 'Account created successfully.',
            };
        },
    });

    return (
        <AuthScene
            eyebrow="Create Workspace"
            title="Build your team account and start whiteboarding"
            description="Create a secure account to unlock real-time collaboration, faster product planning, and shared whiteboard sessions."
        >
            <section className="rounded-3xl border border-white/20 bg-white/10 p-7 text-white shadow-soft backdrop-blur-xl sm:p-9">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">Register</p>
                <h2 className="mt-2 text-3xl font-semibold">Create your account</h2>
                <p className="mt-2 text-sm text-white/75">
                    Use your work details and a strong password to create a secure account.
                </p>

                <div className="mt-5 space-y-3">
                    <FormAlert message={submitError} />
                </div>

                <form className="mt-5 space-y-4" noValidate onSubmit={handleSubmit}>
                    <FormField
                        id="name"
                        name="name"
                        label="Full Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="name"
                        placeholder="Jane Doe"
                        error={errors.name}
                        required
                    />

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
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        hint="Use at least 8 characters with uppercase, lowercase, number, and symbol."
                        error={errors.password}
                        required
                    />

                    <PasswordStrengthIndicator password={values.password} />

                    <FormField
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        error={errors.confirmPassword}
                        required
                    />

                    <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>

                <p className="mt-5 text-sm text-white/80">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-white transition hover:text-rose-100">
                        Login
                    </Link>
                </p>
            </section>
        </AuthScene>
    );
}
