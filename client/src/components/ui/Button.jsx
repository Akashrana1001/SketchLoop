const variantClasses = {
    primary: 'bg-ink text-white hover:-translate-y-0.5 hover:bg-ink/90',
    secondary: 'bg-accent text-white hover:-translate-y-0.5 hover:bg-accent/90',
    ghost: 'border border-ink/20 bg-transparent text-ink hover:bg-ink/5',
    glass: 'border border-white/35 bg-white/10 text-white hover:bg-white/20',
};

const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
};

export default function Button({
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}) {
    return (
        <Component
            className={[
                'inline-flex items-center justify-center rounded-xl font-semibold transition duration-300',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                sizeClasses[size] ?? sizeClasses.md,
                variantClasses[variant] ?? variantClasses.primary,
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </Component>
    );
}
