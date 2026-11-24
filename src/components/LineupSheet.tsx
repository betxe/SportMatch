import { findPlayer, reliability } from '../lib/players';
import type { Player, Session } from '../types';
import { USER_ID } from '../types';
import { CounterBadge } from './CounterBadge';

export function LineupSheet({
  session,
  players,
  highlightUser,
}: {
  session: Session;
  players: Player[];
  highlightUser: boolean;
}) {
  const slots = Array.from({ length: session.spots }, (_, index) => session.playerIds[index] ?? null);
  return (
    <section aria-labelledby="lineup-heading">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 id="lineup-heading" className="text-lg font-semibold">
          Lineup Sheet
        </h2>
        <CounterBadge count={session.playerIds.length} spots={session.spots} testId="lineup-counter" />
      </div>
      <p className="mb-2 text-sm text-muted">Confirmed players</p>
      <ol className="lineup-sheet overflow-hidden rounded-2xl border-[1.5px] border-[rgba(27,36,51,0.12)] px-4">
        {slots.map((playerId, index) => {
          const player = playerId ? findPlayer(players, playerId) : undefined;
          const animate = Boolean(highlightUser && player && player.id === USER_ID && index === session.playerIds.length - 1);
          return (
            <li key={`${session.id}-${index}`} className={`flex items-center justify-between gap-3 ${animate ? 'motion-safe:animate-ink' : ''}`} style={{ height: 44 }}>
              <span className="min-w-0 truncate text-base text-ink">
                {index + 1}.{' '}
                {player ? (
                  <>
                    {player.name}
                    {session.hostId === player.id ? ' (Host)' : ''}
                  </>
                ) : null}
              </span>
              {player ? <span className="shrink-0 text-sm text-muted">{reliability(player)}%</span> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
