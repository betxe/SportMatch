/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        board: '#EEF1F6',
        desk: '#E4E8F0',
        ink: '#111827',
        muted: '#4B5563',
        cobalt: '#1F4FD8',
        'cobalt-pressed': '#173BA3',
        marker: '#FDE047',
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 20px rgba(17, 24, 39, 0.06)',
        phone: '0 18px 50px rgba(17, 24, 39, 0.16)',
      },
      keyframes: {
        tick: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        ink: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        tick: 'tick 200ms ease-out',
        ink: 'ink 200ms ease-out',
      },
    },
  },
  plugins: [],
};
