import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import useAuth from '@/hooks/useAuth';

const publicNavItems = [{ to: '/', label: 'Home' }];
const authenticatedNavItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/board/demo-room', label: 'Whiteboard' },
];

const getNavLinkClassName = (isActive) =>
    [
        'rounded-full px-4 py-2 text-sm font-medium transition',
        isActive ? 'bg-ink text-white shadow' : 'text-ink/75 hover:bg-ink/10 hover:text-ink',
    ].join(' ');

export default function AppLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, user, signOut } = useAuth();

    const authPaths = ['/login', '/register', '/forgot-password', '/logout'];
    const isAuthRoute = authPaths.includes(location.pathname);
    const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            await signOut();
            closeMobileMenu();
            navigate('/', { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isAuthRoute) {
        return (
            <div className="relative min-h-screen">
                <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <header className="sticky top-0 z-50 border-b border-white/50 bg-white/75 backdrop-blur-lg">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                    <Link to="/" className="inline-flex items-center gap-3" onClick={closeMobileMenu}>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-sm font-bold text-white">
                            WB
                        </span>
                        <span>
                            <span className="block text-xs font-mono uppercase tracking-[0.22em] text-accent">
                                Whiteboard
                            </span>
                            <span className="block text-lg font-semibold text-ink">Collaborative Canvas</span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink/15 text-ink transition hover:bg-white md:hidden"
                        aria-label="Toggle navigation menu"
                        onClick={() => {
                            setIsMobileMenuOpen((prevState) => !prevState);
                        }}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    </button>

                    <nav className="hidden items-center gap-2 md:flex">
                        {navItems.map((item) => (
                            <NavLink key={item.to} to={item.to} className={({ isActive }) => getNavLinkClassName(isActive)}>
                                {item.label}
                            </NavLink>
                        ))}
                        {!isAuthenticated ? (
                            <a
                                href="/#features"
                                className="rounded-full px-4 py-2 text-sm font-medium text-ink/75 transition hover:bg-ink/10 hover:text-ink"
                            >
                                Features
                            </a>
                        ) : null}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        {isLoading ? (
                            <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-sm text-ink/60">
                                Loading session...
                            </span>
                        ) : isAuthenticated ? (
                            <>
                                <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-sm text-ink/75">
                                    {user?.email ?? 'Authenticated'}
                                </span>
                                <Button type="button" variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button as={Link} to="/login" variant="ghost" size="sm">
                                    Login
                                </Button>
                                <Button as={Link} to="/register" size="sm">
                                    Register
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {isMobileMenuOpen ? (
                    <div className="border-t border-white/60 bg-white/90 px-4 py-3 shadow-soft md:hidden">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) => getNavLinkClassName(isActive)}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                            {!isAuthenticated ? (
                                <a
                                    href="/#features"
                                    onClick={closeMobileMenu}
                                    className="rounded-full px-4 py-2 text-sm font-medium text-ink/75 transition hover:bg-ink/10 hover:text-ink"
                                >
                                    Features
                                </a>
                            ) : null}
                            <div className="flex gap-2 pt-1">
                                {isLoading ? (
                                    <span className="inline-flex flex-1 items-center justify-center rounded-xl border border-ink/15 px-3 py-2 text-sm text-ink/60">
                                        Loading...
                                    </span>
                                ) : isAuthenticated ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                    >
                                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                                    </Button>
                                ) : (
                                    <>
                                        <Button as={Link} to="/login" variant="ghost" size="sm" className="flex-1" onClick={closeMobileMenu}>
                                            Login
                                        </Button>
                                        <Button as={Link} to="/register" size="sm" className="flex-1" onClick={closeMobileMenu}>
                                            Register
                                        </Button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                ) : null}
            </header>

            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
