import type { SportName } from '../types';

export function SportIcon({ sport, size = 22 }: { sport: SportName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
    className: 'shrink-0',
  };
  if (sport === 'Basketball') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M3 12h18M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );
  }
  if (sport === 'Football') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.1 14.7 9l-1 3.1H10.3L9.3 9 12 7.1Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M12 7.1V3.4M14.7 9l3.2-1.1M15.7 12.1l2.4 2.5M8.3 12.1 5.9 14.6M9.3 9 6.1 7.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.8 15.5c2.8-5.2 11.6-5.2 14.4 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.6 8.6c1.4 1.5 7.4 1.5 8.8 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
