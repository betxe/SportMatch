import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CounterBadge } from '../components/CounterBadge';
import { ReminderBadge } from '../components/ReminderBadge';
import { ScreenHeader } from '../components/ScreenHeader';
import { SportIcon } from '../components/SportIcon';
import { useEval } from '../lib/eval-context';
import { findPlayer } from '../lib/players';
import { formatWhen, isOneHourReminder } from '../lib/time';
import { useApp } from '../state/store';
import type { AttendanceResult, PastGame, Session } from '../types';
import { USER_ID } from '../types';

interface PastRow {
  id: string;
  sport: PastGame['sport'];
  startsAt: number;
  meetingPoint: string;
  hostId: string;
  playerIds: string[];
  showedUp: Record<string, boolean>;
  userResult: AttendanceResult;
}

function choiceClass(selected: boolean, tone: 'yes' | 'no'): string {
  if (!selected) {
    return 'h-12 flex-1 rounded-xl border-[1.5px] border-ink bg-white text-base font-semibold text-ink';
  }
  if (tone === 'yes') {
    return 'h-12 flex-1 rounded-xl border-[1.5px] border-success bg-[#DCFCE7] text-base font-semibold text-ink';
  }
  return 'h-12 flex-1 rounded-xl border-[1.5px] border-danger bg-[#FEE2E2] text-base font-semibold text-ink';
}

export function MyGames() {
  const { state, now, leaveSession, joinSession, showToast, confirmAttendance } = useApp();
  const { log } = useEval();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<{ id: string; playerIds: string[]; showedUp: Record<string, boolean> } | null>(
    null,
  );

  const upcoming = state.sessions
    .filter((session) => session.playerIds.includes(USER_ID) && session.startsAt > now)
    .sort((a, b) => a.startsAt - b.startsAt);

  const ended: PastRow[] = state.sessions
    .filter((session) => session.playerIds.includes(USER_ID) && session.startsAt <= now)
    .map((session) => ({
      id: `ended-${session.id}`,
      sport: session.sport,
      startsAt: session.startsAt,
      meetingPoint: session.meetingPoint,
      hostId: session.hostId,
      playerIds: session.playerIds,
      showedUp: Object.fromEntries(session.playerIds.map((id) => [id, true])),
      userResult: 'Attended',
    }));

  const past: PastRow[] = [
    ...ended,
    ...state.pastGames.map((game) => ({
      id: game.id,
      sport: game.sport,
      startsAt: game.startsAt,
      meetingPoint: game.meetingPoint,
      hostId: game.hostId,
      playerIds: game.playerIds,
      showedUp: game.showedUp,
      userResult: game.userResult,
    })),
  ].sort((a, b) => b.startsAt - a.startsAt);

  const sayYes = (session: Session) => {
    if (session.playerIds.includes(USER_ID)) return;
    if (session.playerIds.length >= session.spots) {
      const message = 'This session is full.';
      showToast(message);
      log({ type: 'error shown', detail: message });
      return;
    }
    const slot = joinSession(session.id);
    if (slot) showToast(`You are in! Slot #${slot}`);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <ScreenHeader title="My Games" />
      <main className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        <section>
          <h2 className="text-lg font-semibold">Upcoming</h2>
          {upcoming.length === 0 ? <p className="mt-2 text-base text-muted">No upcoming sessions.</p> : null}
          <div className="mt-3 flex flex-col gap-3">
            {upcoming.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border-[1.5px] border-[rgba(27,36,51,0.12)] bg-white p-4 shadow-card"
              >
                <button
                  type="button"
                  data-testid={`open-session-${session.id}`}
                  className="flex w-full items-start justify-between gap-3 text-left"
                  onClick={() => navigate(`/session/${session.id}`)}
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <SportIcon sport={session.sport} />
                      {session.sport}
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-cobalt">Lineup Sheet</span>
                  </span>
                  <CounterBadge count={session.playerIds.length} spots={session.spots} testId={`games-counter-${session.id}`} />
                </button>
                <p className="mt-2 text-base">{formatWhen(session.startsAt, now)}</p>
                <p className="mt-1 text-base text-muted">{session.meetingPoint}</p>
                {isOneHourReminder(session.startsAt, now) ? (
                  <div className="mt-3">
                    <ReminderBadge />
                  </div>
                ) : null}
                <p className="mb-2 mt-4 text-sm font-semibold">Are you going?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-testid={`yes-${session.id}`}
                    aria-pressed="true"
                    className={choiceClass(true, 'yes')}
                    onClick={() => sayYes(session)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    data-testid={`no-${session.id}`}
                    aria-pressed="false"
                    className={choiceClass(false, 'no')}
                    onClick={() => leaveSession(session.id, { undo: true })}
                  >
                    No
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold">Past</h2>
          <div className="mt-3 flex flex-col gap-3">
            {past.map((game) => (
              <article
                key={game.id}
                className="rounded-2xl border-[1.5px] border-[rgba(27,36,51,0.12)] bg-white p-4 shadow-card"
              >
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <SportIcon sport={game.sport} />
                  {game.sport}
                </div>
                <p className="mt-2 text-base">{formatWhen(game.startsAt, now)}</p>
                <p className="mt-1 text-base text-muted">{game.meetingPoint}</p>
                <p className={`mt-3 text-base font-semibold ${game.userResult === 'No-show' ? 'text-danger' : 'text-success'}`}>
                  {game.userResult}
                </p>
                {game.hostId === USER_ID ? (
                  <button
                    type="button"
                    data-testid={`confirm-attendance-${game.id}`}
                    className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-xl border-[1.5px] border-ink text-base font-semibold"
                    onClick={() =>
                      setChecklist({
                        id: game.id,
                        playerIds: game.playerIds,
                        showedUp: { ...game.showedUp },
                      })
                    }
                  >
                    Confirm attendance
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
      {checklist ? (
        <ConfirmDialog
          testId="attendance-dialog"
          title="Confirm attendance"
          body="Tick the confirmed players who showed up."
          confirmLabel="Save attendance"
          cancelLabel="Cancel"
          confirmTestId="save-attendance"
          onCancel={() => setChecklist(null)}
          onConfirm={() => {
            confirmAttendance(checklist.id, checklist.showedUp);
            showToast('Attendance saved');
            setChecklist(null);
          }}
        >
          <ul className="mt-3 max-h-52 space-y-1 overflow-y-auto">
            {checklist.playerIds.map((playerId) => {
              const player = findPlayer(state.players, playerId);
              const checked = checklist.showedUp[playerId] !== false;
              return (
                <li key={playerId}>
                  <label className="flex min-h-12 items-center gap-3 text-base">
                    <input
                      type="checkbox"
                      className="h-6 w-6 accent-cobalt"
                      data-testid={`attendance-${playerId}`}
                      checked={checked}
                      onChange={(event) =>
                        setChecklist((current) =>
                          current
                            ? { ...current, showedUp: { ...current.showedUp, [playerId]: event.target.checked } }
                            : current,
                        )
                      }
                    />
                    {player?.name ?? 'Player'}
                  </label>
                </li>
              );
            })}
          </ul>
        </ConfirmDialog>
      ) : null}
    </div>
  );
}
