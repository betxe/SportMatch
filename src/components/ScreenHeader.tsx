import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="flex items-center gap-2 px-4 py-3">
      {onBack ? (
        <button
          type="button"
          data-testid="back-button"
          className="inline-flex h-12 shrink-0 items-center gap-1 rounded-xl pr-1 text-base font-semibold text-ink"
          onClick={onBack}
        >
          <ArrowLeft size={20} aria-hidden />
          Back
        </button>
      ) : null}
      <h1 className="min-w-0 flex-1 text-2xl font-bold leading-tight">{title}</h1>
      {right}
    </header>
  );
}
