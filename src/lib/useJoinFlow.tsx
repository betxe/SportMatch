import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LevelPills } from '../components/LevelPills';
import { useApp } from '../state/store';
import type { Level } from '../types';
import { USER_ID } from '../types';

type Pending =
  | { type: 'mismatch'; sessionId: string; userLevel: Level }
  | { type: 'add'; sessionId: string; level: Level };

export function useJoinFlow() {
  const { state, joinSession, addSport, showToast } = useApp();
  const [pending, setPending] = useState<Pending | null>(null);
  const session = pending ? state.sessions.find((item) => item.id === pending.sessionId) : undefined;

  const finishJoin = (sessionId: string) => {
    const slot = joinSession(sessionId);
    if (slot) showToast(`You are in! Slot #${slot}`);
    setPending(null);
  };

  const tryJoin = (sessionId: string) => {
    const target = state.sessions.find((item) => item.id === sessionId);
    if (!target || target.playerIds.includes(USER_ID) || target.playerIds.length >= target.spots) return;
    const skill = state.profile.sports.find((item) => item.sport === target.sport);
    if (!skill) {
      setPending({ type: 'add', sessionId, level: target.level });
      return;
    }
    if (skill.level !== target.level) {
      setPending({ type: 'mismatch', sessionId, userLevel: skill.level });
      return;
    }
    finishJoin(target.id);
  };

  let dialog = null;
  if (pending && session && pending.type === 'mismatch') {
    dialog = (
      <ConfirmDialog
        testId="mismatch-dialog"
        title="Different level"
        body={`This session is ${session.level} and your level is ${pending.userLevel} Join anyway?`}
        confirmLabel="Join anyway"
        cancelLabel="Cancel"
        confirmTestId="join-anyway-button"
        onConfirm={() => finishJoin(session.id)}
        onCancel={() => setPending(null)}
      />
    );
  } else if (pending && session && pending.type === 'add') {
    const level = pending.level;
    dialog = (
      <ConfirmDialog
        testId="add-sport-dialog"
        title={`Add ${session.sport}`}
        body={`${session.sport} is not on your Player Card. Choose a level to add it.`}
        confirmLabel="Add and join"
        cancelLabel="Cancel"
        confirmTestId="add-and-join-button"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          addSport(session.sport, level);
          if (level !== session.level) {
            setPending({ type: 'mismatch', sessionId: session.id, userLevel: level });
            return;
          }
          finishJoin(session.id);
        }}
      >
        <div className="mt-3">
          <LevelPills
            label={`${session.sport} level`}
            value={level}
            testIdPrefix="add-level"
            onChange={(next) => setPending({ type: 'add', sessionId: session.id, level: next })}
          />
        </div>
      </ConfirmDialog>
    );
  }

  return { tryJoin, dialog };
}
