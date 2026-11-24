import { Check } from 'lucide-react';
import { CounterBadge } from './CounterBadge';
import { SportIcon } from './SportIcon';
import { formatWhen } from '../lib/time';
import type { Session } from '../types';
import { USER_ID } from '../types';

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex h-8 items-center rounded-full border-[1.5px] border-ink/30 px-3 text-sm font-semibold text-ink">
      {children}
    </span>
  );
}

export function SessionCard({
  session,
  now,
  showDistance = false,
  onOpen,
  onJoin,
}: {
  session: Session;
  now: number;
  showDistance?: boolean;
  onOpen?: () => void;
  onJoin?: () => void;
}) {
  const count = session.playerIds.length;
  const full = count >= session.spots;
  const joined = session.playerIds.includes(USER_ID);

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <SportIcon sport={session.sport} />
          <span className="text-lg font-semibold">{session.sport}</span>
        </div>
        <CounterBadge count={count} spots={session.spots} testId={`counter-${session.id}`} />
      </div>
      <p className="mt-2 text-base text-ink">{formatWhen(session.startsAt, now)}</p>
      <p className="mt-1 text-base text-muted">{session.meetingPoint}</p>
      {showDistance ? <p className="mt-1 text-sm font-semibold text-ink">{session.distanceKm.toFixed(1)} km</p> : null}
    </>
  );

  return (
    <article className="relative rounded-2xl border-[1.5px] border-[rgba(27,36,51,0.12)] bg-white pt-3 shadow-card">
      <span className="absolute left-1/2 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#C5CEDC]" aria-hidden />
      {onOpen ? (
        <button
          type="button"
          data-testid={`session-card-${session.id}`}
          className="block w-full px-4 pt-4 text-left"
          onClick={onOpen}
        >
          {body}
        </button>
      ) : (
        <div data-testid={`session-card-${session.id}`} className="px-4 pt-4">
          {body}
        </div>
      )}
      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-3">
        <div className="flex flex-wrap gap-2">
          <Tag>{session.level}</Tag>
          <Tag>{session.intensity}</Tag>
        </div>
        {joined ? (
          <span
            data-testid={`joined-badge-${session.id}`}
            className="inline-flex h-12 shrink-0 items-center gap-1 text-base font-semibold text-success"
          >
            <Check size={18} aria-hidden />
            JOINED
          </span>
        ) : full ? (
          <button
            type="button"
            disabled
            data-testid={`join-button-${session.id}`}
            aria-label="Session full"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-warning bg-white px-4 text-base font-semibold text-warning"
          >
            FULL
          </button>
        ) : (
          <button
            type="button"
            data-testid={`join-button-${session.id}`}
            aria-label={`Join ${session.sport} session`}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-cobalt px-4 text-base font-semibold text-white active:bg-cobalt-pressed"
            onClick={onJoin}
          >
            JOIN
          </button>
        )}
      </div>
    </article>
  );
}
