import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AuthScene from '@/components/auth/AuthScene';
import FormAlert from '@/components/forms/FormAlert';
import FormField from '@/components/forms/FormField';
import Button from '@/components/ui/Button';
import useAuthForm from '@/hooks/useAuthForm';
import { createAuthApi } from '@/lib/authApi';
import { useApiClient } from '@/lib/apiClient';
import { validateForgotPasswordForm } from '@/lib/validators/authValidators';

export default function ForgotPasswordPage() {
    const { request } = useApiClient();
    const authApi = useMemo(() => createAuthApi(request), [request]);

    const {
        values,
        errors,
        isSubmitting,
        submitError,
        submitSuccess,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useAuthForm({
        initialValues: {
            email: '',
        },
        validate: validateForgotPasswordForm,
        onSubmit: async (formValues) => {
            const response = await authApi.forgotPassword({
                email: formValues.email.trim().toLowerCase(),
            });

            return {
                message: response?.message ?? 'If the account exists, reset instructions have been sent.',
            };
        },
    });

    return (
        <AuthScene
            eyebrow="Account Recovery"
            title="Reset your password securely"
            description="Enter your account email and we will send password reset instructions if the account exists."
        >
            <section className="rounded-3xl border border-white/20 bg-white/10 p-7 text-white shadow-soft backdrop-blur-xl sm:p-9">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">Forgot Password</p>
                <h2 className="mt-2 text-3xl font-semibold">Recover your account</h2>
                <p className="mt-2 text-sm text-white/75">
                    We keep responses generic to prevent account enumeration and improve security.
                </p>

                <div className="mt-5 space-y-3">
                    <FormAlert message={submitError} />
                    <FormAlert message={submitSuccess} variant="success" />
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

                    <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                </form>

                <p className="mt-5 text-sm text-white/80">
                    Back to{' '}
                    <Link to="/login" className="font-semibold text-white transition hover:text-rose-100">
                        Login
                    </Link>
                </p>
            </section>
        </AuthScene>
    );
}
