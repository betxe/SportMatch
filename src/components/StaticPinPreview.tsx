import { MapPin } from 'lucide-react';

export function StaticPinPreview({ place }: { place: string }) {
  return (
    <div
      role="img"
      aria-label={`Map preview of ${place}`}
      className="relative h-28 w-full overflow-hidden rounded-xl border-[1.5px] border-[rgba(27,36,51,0.12)] bg-[#E7EEF8]"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 112" aria-hidden>
        <rect width="320" height="112" fill="#E7EEF8" />
        <path d="M0 36H320M0 78H320M78 0V112M168 0V112M248 0V112" stroke="#F8FAFC" strokeWidth="10" />
        <path d="M0 36H320M0 78H320M78 0V112M168 0V112M248 0V112" stroke="#D5DEEA" strokeWidth="2" />
        <rect x="188" y="44" width="48" height="26" rx="4" fill="#C9E8D4" />
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[70%] text-danger">
        <MapPin size={28} aria-hidden fill="#B91C1C" />
      </span>
    </div>
  );
}
