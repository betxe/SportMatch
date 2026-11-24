import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PlayerCard } from '../components/PlayerCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { primaryButtonClass } from '../components/styles';
import { findPlayer, reliability } from '../lib/players';
import { useApp } from '../state/store';
import { USER_ID } from '../types';

export function MyPlayerCard() {
  const { state, resetDemo } = useApp();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const player = findPlayer(state.players, USER_ID);
  const attendance = player ? reliability(player) : 0;

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <ScreenHeader title="My Player Card" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <PlayerCard
          name={state.profile.name}
          age={state.profile.age}
          attendance={attendance}
          sports={state.profile.sports}
        />
      </main>
      <div className="flex shrink-0 flex-col gap-2 px-4 pb-3">
        <button
          type="button"
          data-testid="edit-sports-button"
          className={primaryButtonClass}
          onClick={() => navigate('/card/edit')}
        >
          Edit sports and levels
        </button>
        <button
          type="button"
          data-testid="reset-demo-button"
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl border-[1.5px] border-ink bg-white text-base font-semibold"
          onClick={() => setConfirmReset(true)}
        >
          Reset demo data
        </button>
      </div>
      <BottomNav />
      {confirmReset ? (
        <ConfirmDialog
          testId="reset-dialog"
          title="Reset demo data"
          body="Reset demo data? This clears the Player Card and restores sample sessions."
          confirmLabel="Reset demo data"
          cancelLabel="Cancel"
          confirmTestId="confirm-reset-button"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            resetDemo();
            navigate('/');
          }}
        />
      ) : null}
    </div>
  );
}
