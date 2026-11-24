import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useEval } from '../lib/eval-context';

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  children,
  confirmTestId = 'dialog-confirm',
  cancelTestId = 'dialog-cancel',
  testId = 'confirm-dialog',
}: {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
  confirmTestId?: string;
  cancelTestId?: string;
  testId?: string;
}) {
  const { log } = useEval();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    log({ type: 'dialog shown', detail: `${title}. ${body}` });
  }, [body, log, title]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-[rgba(17,24,39,0.45)] p-3" onMouseDown={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        data-testid={testId}
        className="w-full rounded-2xl bg-white p-4 shadow-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="dialog-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-base text-ink">{body}</p>
        {children}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            data-testid={confirmTestId}
            className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-cobalt text-base font-semibold text-white active:bg-cobalt-pressed"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button
            ref={cancelRef}
            type="button"
            data-testid={cancelTestId}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl border-[1.5px] border-ink bg-white text-base font-semibold text-ink"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
