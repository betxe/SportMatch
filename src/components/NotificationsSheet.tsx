import { useEffect } from 'react';
import { formatWhen, isOneHourReminder } from '../lib/time';
import type { Session } from '../types';
import { ReminderBadge } from './ReminderBadge';

export function NotificationsSheet({
  sessions,
  now,
  onOpen,
  onClose,
}: {
  sessions: Session[];
  now: number;
  onOpen: (sessionId: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-[rgba(17,24,39,0.45)] p-3" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Reminders"
        data-testid="reminders-sheet"
        className="max-h-[75%] w-full overflow-y-auto rounded-2xl bg-white p-4 shadow-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Reminders</h2>
          <button type="button" data-testid="reminders-close" className="h-12 px-3 text-base font-semibold" onClick={onClose}>
            Close
          </button>
        </div>
        {sessions.length === 0 ? <p className="text-base text-muted">No reminders.</p> : null}
        <ul className="flex flex-col gap-2">
          {sessions.map((session) => {
            const soon = isOneHourReminder(session.startsAt, now);
            return (
              <li key={session.id}>
                <button
                  type="button"
                  data-testid={`reminder-${session.id}`}
                  className="flex min-h-12 w-full flex-col items-start gap-2 rounded-xl border-[1.5px] border-ink/15 px-3 py-3 text-left"
                  onClick={() => onOpen(session.id)}
                >
                  {soon ? <ReminderBadge /> : null}
                  <span className="text-base font-semibold">
                    {session.sport} Session · {formatWhen(session.startsAt, now)}
                  </span>
                  <span className="text-sm text-muted">{session.meetingPoint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
