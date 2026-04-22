/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
                mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
            },
            colors: {
                ink: '#102A43',
                mist: '#F0F4F8',
                pulse: '#D64550',
                accent: '#168AAD',
            },
            boxShadow: {
                soft: '0 16px 40px rgba(16, 42, 67, 0.12)',
            },
        },
    },
    plugins: [],
};
