/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // adjust based on your project
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    '50': '#f8fafc',
                    '100': '#f1f5f9',
                    '200': '#e2e8f0',
                    '300': '#cbd5e1',
                    '400': '#94a3b8',
                    '500': '#64748b',
                    '600': '#475569',
                    '700': '#334155',
                    '800': '#1e293b',
                    '900': '#0f172a',
                    '950': '#020617',
                },
                danger: {
                    '50': '#fff1f2',
                    '100': '#ffe4e6',
                    '200': '#fecdd3',
                    '300': '#fda4af',
                    '400': '#fb7185',
                    '500': '#f43f5e',
                    '600': '#e11d48',
                    '700': '#be123c',
                    '800': '#9f1239',
                    '900': '#881337',
                    '950': '#4c0519',
                },
                dark: {
                    '900': '#0B1120',
                    '800': '#151C2D',
                    '700': '#29344E',
                    '600': '#4A5568',
                },
            },
        },
    },
    plugins: [],
};
