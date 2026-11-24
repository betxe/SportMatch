import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createSeed } from '../data/seed';
import { appNow, createClockOrigin } from '../lib/time';
import type { AppState, Level, PastGame, Player, SessionDraft, SportName, SportSkill } from '../types';
import { USER_ID } from '../types';

const STORAGE_KEY = 'sportmatch.v1';

export interface State extends AppState {
  pendingUndo: { sessionId: string; index: number } | null;
}

type Action =
  | { type: 'COMPLETE_PROFILE'; name: string; age: number; sports: SportSkill[] }
  | { type: 'JOIN'; sessionId: string }
  | { type: 'LEAVE'; sessionId: string }
  | { type: 'UNDO_LEAVE' }
  | { type: 'ADD_SPORT'; sport: SportName; level: Level }
  | { type: 'PUBLISH'; draft: SessionDraft; now: number }
  | { type: 'SEND'; sessionId: string; text: string; now: number }
  | { type: 'CONFIRM_ATTENDANCE'; gameId: string; showedUp: Record<string, boolean> }
  | { type: 'RESET' };

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false;
  const record = value as AppState;
  return Boolean(
    record.profile &&
      Array.isArray(record.sessions) &&
      Array.isArray(record.players) &&
      Array.isArray(record.pastGames) &&
      Array.isArray(record.messages) &&
      typeof record.clockOrigin === 'number',
  );
}

function shiftTimes(saved: AppState): AppState {
  const origin = createClockOrigin();
  const delta = origin - saved.clockOrigin;
  return {
    ...saved,
    clockOrigin: origin,
    timeOffsetMs: 0,
    sessions: saved.sessions.map((session) => ({
      ...session,
      startsAt: session.startsAt + delta,
      createdAt: session.createdAt + delta,
    })),
    pastGames: saved.pastGames.map((game) => ({
      ...game,
      startsAt: game.startsAt + delta,
      counted: game.counted ?? true,
    })),
    messages: saved.messages.map((message) => ({ ...message, at: message.at + delta })),
  };
}

export function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...createSeed(), pendingUndo: null };
    const parsed: unknown = JSON.parse(raw);
    if (!isAppState(parsed)) return { ...createSeed(), pendingUndo: null };
    return { ...shiftTimes(parsed), pendingUndo: null };
  } catch {
    return { ...createSeed(), pendingUndo: null };
  }
}

function saveState(state: State): void {
  try {
    const persisted: AppState = {
      profile: state.profile,
      players: state.players,
      sessions: state.sessions,
      pastGames: state.pastGames,
      messages: state.messages,
      clockOrigin: state.clockOrigin,
      timeOffsetMs: state.timeOffsetMs,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Ignore quota and private-mode failures. The prototype still runs in memory.
  }
}

function applyAttendance(
  players: Player[],
  playerIds: string[],
  before: Record<string, boolean>,
  after: Record<string, boolean>,
  counted: boolean,
): Player[] {
  return players.map((player) => {
    if (!playerIds.includes(player.id)) return player;
    const wasIn = before[player.id] !== false;
    const nowIn = after[player.id] !== false;
    if (!counted) {
      return nowIn ? { ...player, attended: player.attended + 1 } : { ...player, noShow: player.noShow + 1 };
    }
    if (wasIn === nowIn) return player;
    if (wasIn && !nowIn) {
      return { ...player, attended: Math.max(0, player.attended - 1), noShow: player.noShow + 1 };
    }
    return { ...player, attended: player.attended + 1, noShow: Math.max(0, player.noShow - 1) };
  });
}

function userResult(playerIds: string[], showedUp: Record<string, boolean>): PastGame['userResult'] {
  if (!playerIds.includes(USER_ID)) return 'Attended';
  return showedUp[USER_ID] === false ? 'No-show' : 'Attended';
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'COMPLETE_PROFILE': {
      const name = action.name.trim() || 'Marc';
      return {
        ...state,
        profile: { name, age: action.age, sports: action.sports, onboarded: true },
        players: state.players.map((player) => (player.id === USER_ID ? { ...player, name } : player)),
      };
    }
    case 'ADD_SPORT': {
      const exists = state.profile.sports.some((skill) => skill.sport === action.sport);
      const sports = exists
        ? state.profile.sports.map((skill) =>
            skill.sport === action.sport ? { sport: action.sport, level: action.level } : skill,
          )
        : [...state.profile.sports, { sport: action.sport, level: action.level }];
      return { ...state, profile: { ...state.profile, sports } };
    }
    case 'JOIN':
      return {
        ...state,
        pendingUndo: state.pendingUndo?.sessionId === action.sessionId ? null : state.pendingUndo,
        sessions: state.sessions.map((session) => {
          if (session.id !== action.sessionId) return session;
          if (session.playerIds.includes(USER_ID) || session.playerIds.length >= session.spots) return session;
          return { ...session, playerIds: [...session.playerIds, USER_ID] };
        }),
      };
    case 'LEAVE': {
      const session = state.sessions.find((item) => item.id === action.sessionId);
      if (!session) return state;
      const index = session.playerIds.indexOf(USER_ID);
      if (index < 0) return state;
      return {
        ...state,
        pendingUndo: { sessionId: session.id, index },
        sessions: state.sessions.map((item) =>
          item.id === session.id ? { ...item, playerIds: item.playerIds.filter((id) => id !== USER_ID) } : item,
        ),
      };
    }
    case 'UNDO_LEAVE': {
      const pending = state.pendingUndo;
      if (!pending) return state;
      return {
        ...state,
        pendingUndo: null,
        sessions: state.sessions.map((session) => {
          if (session.id !== pending.sessionId) return session;
          if (session.playerIds.includes(USER_ID) || session.playerIds.length >= session.spots) return session;
          const playerIds = [...session.playerIds];
          playerIds.splice(Math.min(pending.index, playerIds.length), 0, USER_ID);
          return { ...session, playerIds };
        }),
      };
    }
    case 'PUBLISH': {
      const session = {
        id: `s-${Date.now()}`,
        sport: action.draft.sport,
        level: action.draft.level,
        intensity: action.draft.intensity,
        startsAt: action.draft.startsAt,
        meetingPoint: action.draft.meetingPoint.trim(),
        hostId: USER_ID,
        spots: action.draft.spots,
        playerIds: [USER_ID],
        distanceKm: 0.5,
        createdAt: action.now + 1,
      };
      return { ...state, sessions: [session, ...state.sessions] };
    }
    case 'SEND': {
      const text = action.text.trim();
      if (!text) return state;
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: `m-${Date.now()}`,
            sessionId: action.sessionId,
            authorId: USER_ID,
            text,
            at: action.now,
          },
        ],
      };
    }
    case 'CONFIRM_ATTENDANCE': {
      if (action.gameId.startsWith('ended-')) {
        const sessionId = action.gameId.slice('ended-'.length);
        const session = state.sessions.find((item) => item.id === sessionId);
        if (!session) return state;
        const before = Object.fromEntries(session.playerIds.map((id) => [id, true]));
        const players = applyAttendance(state.players, session.playerIds, before, action.showedUp, false);
        const game: PastGame = {
          id: `p-${session.id}`,
          sport: session.sport,
          level: session.level,
          intensity: session.intensity,
          startsAt: session.startsAt,
          meetingPoint: session.meetingPoint,
          hostId: session.hostId,
          spots: session.spots,
          playerIds: session.playerIds,
          showedUp: action.showedUp,
          userResult: userResult(session.playerIds, action.showedUp),
          confirmed: true,
          counted: true,
        };
        return {
          ...state,
          players,
          sessions: state.sessions.filter((item) => item.id !== session.id),
          pastGames: [game, ...state.pastGames],
        };
      }
      const game = state.pastGames.find((item) => item.id === action.gameId);
      if (!game) return state;
      const players = applyAttendance(state.players, game.playerIds, game.showedUp, action.showedUp, game.counted);
      return {
        ...state,
        players,
        pastGames: state.pastGames.map((item) =>
          item.id === game.id
            ? {
                ...item,
                showedUp: action.showedUp,
                confirmed: true,
                counted: true,
                userResult: userResult(item.playerIds, action.showedUp),
              }
            : item,
        ),
      };
    }
    case 'RESET':
      return { ...createSeed(), pendingUndo: null };
    default:
      return state;
  }
}

interface ToastState {
  message: string;
  undo: boolean;
}

interface StoreValue {
  state: State;
  now: number;
  toast: ToastState | null;
  recentJoin: { sessionId: string } | null;
  showToast: (message: string, undo?: boolean) => void;
  dismissToast: () => void;
  undoLeave: () => void;
  completeProfile: (name: string, age: number, sports: SportSkill[]) => void;
  addSport: (sport: SportName, level: Level) => void;
  joinSession: (sessionId: string) => number | null;
  leaveSession: (sessionId: string, options?: { undo?: boolean }) => void;
  publishSession: (draft: SessionDraft) => void;
  sendMessage: (sessionId: string, text: string) => void;
  confirmAttendance: (gameId: string, showedUp: Record<string, boolean>) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [recentJoin, setRecentJoin] = useState<{ sessionId: string } | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!recentJoin) return;
    const timer = window.setTimeout(() => setRecentJoin(null), 1600);
    return () => window.clearTimeout(timer);
  }, [recentJoin]);

  const now = appNow(state.clockOrigin, state.timeOffsetMs);

  const api = useMemo<StoreValue>(() => {
    const showToast = (message: string, undo = false) => {
      setToast({ message, undo });
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 5000);
    };
    const dismissToast = () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      setToast(null);
    };
    return {
      state,
      now,
      toast,
      recentJoin,
      showToast,
      dismissToast,
      undoLeave: () => {
        dispatch({ type: 'UNDO_LEAVE' });
        dismissToast();
      },
      completeProfile: (name, age, sports) => dispatch({ type: 'COMPLETE_PROFILE', name, age, sports }),
      addSport: (sport, level) => dispatch({ type: 'ADD_SPORT', sport, level }),
      joinSession: (sessionId) => {
        const session = state.sessions.find((item) => item.id === sessionId);
        if (!session || session.playerIds.includes(USER_ID) || session.playerIds.length >= session.spots) return null;
        const slot = session.playerIds.length + 1;
        dispatch({ type: 'JOIN', sessionId });
        setRecentJoin({ sessionId });
        return slot;
      },
      leaveSession: (sessionId, options) => {
        const session = state.sessions.find((item) => item.id === sessionId);
        if (!session?.playerIds.includes(USER_ID)) return;
        dispatch({ type: 'LEAVE', sessionId });
        showToast('You left the session.', Boolean(options?.undo));
      },
      publishSession: (draft) => dispatch({ type: 'PUBLISH', draft, now }),
      sendMessage: (sessionId, text) => dispatch({ type: 'SEND', sessionId, text, now }),
      confirmAttendance: (gameId, showedUp) => dispatch({ type: 'CONFIRM_ATTENDANCE', gameId, showedUp }),
      resetDemo: () => {
        dispatch({ type: 'RESET' });
        setRecentJoin(null);
        dismissToast();
      },
    };
  }, [now, recentJoin, state, toast]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useApp(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useApp must be used within StoreProvider');
  return value;
}
