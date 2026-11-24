import { useApp } from '../state/store';

export function Toast() {
  const { toast, undoLeave, dismissToast } = useApp();
  if (!toast) return null;
  return (
    <div
      className="absolute inset-x-4 bottom-24 z-40 rounded-2xl bg-ink px-4 py-3 text-white shadow-card"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-base">{toast.message}</p>
        {toast.undo ? (
          <button
            type="button"
            data-testid="undo-toast"
            className="h-12 shrink-0 font-semibold text-marker"
            onClick={undoLeave}
          >
            Undo
          </button>
        ) : (
          <button type="button" data-testid="dismiss-toast" className="h-12 shrink-0 font-semibold" onClick={dismissToast}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}
