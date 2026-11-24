import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { FilterChips } from '../components/FilterChips';
import type { FeedFilter } from '../components/FilterChips';
import { NotificationsSheet } from '../components/NotificationsSheet';
import { ScreenHeader } from '../components/ScreenHeader';
import { SessionCard } from '../components/SessionCard';
import { primaryButtonClass } from '../components/styles';
import { useJoinFlow } from '../lib/useJoinFlow';
import { useApp } from '../state/store';
import { USER_ID } from '../types';

export function Home() {
  const { state, now } = useApp();
  const navigate = useNavigate();
  const { tryJoin, dialog } = useJoinFlow();
  const [filter, setFilter] = useState<FeedFilter>('All');
  const [remindersOpen, setRemindersOpen] = useState(false);
  const playsTennis = state.profile.sports.some((skill) => skill.sport === 'Tennis');

  useEffect(() => {
    if (filter === 'Tennis' && !playsTennis) setFilter('All');
  }, [filter, playsTennis]);

  const upcoming = state.sessions.filter((session) => session.startsAt > now);
  let visible = upcoming.filter((session) => filter === 'All' || filter === 'Near Me' || session.sport === filter);
  visible =
    filter === 'Near Me'
      ? [...visible].sort((a, b) => a.distanceKm - b.distanceKm || a.startsAt - b.startsAt)
      : [...visible].sort((a, b) => b.createdAt - a.createdAt);

  const reminders = state.sessions
    .filter((session) => session.playerIds.includes(USER_ID) && session.startsAt > now)
    .sort((a, b) => a.startsAt - b.startsAt);
  const hasSoon = reminders.some((session) => session.startsAt - now <= 60 * 60 * 1000);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <ScreenHeader
        title="SportMatch"
        right={
          <button
            type="button"
            data-testid="reminders-button"
            aria-label={hasSoon ? 'Reminders, 1h reminder' : 'Reminders'}
            className="inline-flex h-12 shrink-0 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-ink"
            onClick={() => setRemindersOpen(true)}
          >
            <Bell size={18} aria-hidden />
            Reminders
          </button>
        }
      />
      <main className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        <FilterChips value={filter} playsTennis={playsTennis} onChange={setFilter} />
        <div>
          <h2 className="text-lg font-semibold">Noticeboard feed</h2>
          <p className="mt-1 text-sm text-muted">Tap a card to open the Lineup Sheet.</p>
        </div>
        {visible.length === 0 ? (
          <div className="rounded-2xl border-[1.5px] border-[rgba(27,36,51,0.12)] bg-white p-6 text-center shadow-card">
            <p className="text-base text-ink">No sessions yet. Create the first one.</p>
            <Link
              to="/create"
              data-testid="empty-create-session"
              className={`${primaryButtonClass} mt-4`}
            >
              + Create Session
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visible.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                now={now}
                showDistance={filter === 'Near Me'}
                onOpen={() => navigate(`/session/${session.id}`)}
                onJoin={() => tryJoin(session.id)}
              />
            ))}
          </div>
        )}
      </main>
      <div className="shrink-0 px-4 pb-2 pt-1">
        <Link to="/create" data-testid="create-session-button" className={primaryButtonClass}>
          + Create Session
        </Link>
      </div>
      <BottomNav />
      {dialog}
      {remindersOpen ? (
        <NotificationsSheet
          sessions={reminders}
          now={now}
          onClose={() => setRemindersOpen(false)}
          onOpen={(sessionId) => {
            setRemindersOpen(false);
            navigate(`/session/${sessionId}`);
          }}
        />
      ) : null}
    </div>
  );
}
