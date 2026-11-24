import { Clock } from 'lucide-react';

export function ReminderBadge() {
  return (
    <span className="inline-flex h-10 items-center gap-1 rounded-full bg-marker px-3 text-sm font-semibold text-ink">
      <Clock size={16} aria-hidden />
      1h reminder!
    </span>
  );
}
