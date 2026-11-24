import { useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatSheet } from '../components/ChatSheet';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LineupSheet } from '../components/LineupSheet';
import { ScreenHeader } from '../components/ScreenHeader';
import { SportIcon } from '../components/SportIcon';
import { StaticPinPreview } from '../components/StaticPinPreview';
import { primaryButtonClass, secondaryButtonClass } from '../components/styles';
import { mapsSearchUrl } from '../lib/maps';
import { formatWhen } from '../lib/time';
import { useJoinFlow } from '../lib/useJoinFlow';
import { useApp } from '../state/store';
import { USER_ID } from '../types';

export function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, now, leaveSession, sendMessage, recentJoin } = useApp();
  const { tryJoin, dialog } = useJoinFlow();
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const session = state.sessions.find((item) => item.id === id);

  if (!session) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <ScreenHeader title="Session" onBack={() => navigate('/home')} />
        <p className="px-4 text-base">This session is no longer on the Noticeboard feed.</p>
      </div>
    );
  }

  const joined = session.playerIds.includes(USER_ID);
  const full = session.playerIds.length >= session.spots;
  const canChat = joined || session.hostId === USER_ID;
  const messages = state.messages.filter((message) => message.sessionId === session.id);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <ScreenHeader
        title={`${session.sport} Session`}
        onBack={() => navigate(-1)}
        right={<SportIcon sport={session.sport} />}
      />
      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
        <section>
          <p className="text-sm font-semibold text-muted">Meeting point</p>
          <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
            <MapPin size={18} aria-hidden />
            {session.meetingPoint}
          </p>
          <div className="mt-3">
            <StaticPinPreview place={session.meetingPoint} />
          </div>
          <a
            className="mt-2 inline-flex min-h-12 items-center text-base font-semibold text-cobalt underline"
            href={mapsSearchUrl(session.meetingPoint)}
            target="_blank"
            rel="noreferrer"
            data-testid="open-in-maps"
          >
            Open in Maps
          </a>
          <p className="mt-3 flex items-center gap-2 text-base">
            <Clock size={18} aria-hidden />
            <span>{formatWhen(session.startsAt, now)}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex h-8 items-center rounded-full border-[1.5px] border-ink/30 px-3 text-sm font-semibold">
              {session.level}
            </span>
            <span className="inline-flex h-8 items-center rounded-full border-[1.5px] border-ink/30 px-3 text-sm font-semibold">
              {session.intensity}
            </span>
          </div>
        </section>
        <LineupSheet
          session={session}
          players={state.players}
          highlightUser={recentJoin?.sessionId === session.id}
        />
        {canChat ? (
          <button
            type="button"
            data-testid="session-chat-button"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border-[1.5px] border-ink bg-white text-base font-semibold"
            onClick={() => setChatOpen(true)}
          >
            Session Chat
          </button>
        ) : null}
      </main>
      <div className="shrink-0 px-4 pb-4 pt-3">
        {joined ? (
          <button
            type="button"
            data-testid="leave-session-button"
            className={secondaryButtonClass}
            onClick={() => setLeaveOpen(true)}
          >
            LEAVE SESSION
          </button>
        ) : full ? (
          <button type="button" disabled data-testid="session-full-button" className={`${secondaryButtonClass} text-warning`}>
            SESSION FULL
          </button>
        ) : (
          <button type="button" data-testid="join-game-button" className={primaryButtonClass} onClick={() => tryJoin(session.id)}>
            JOIN GAME
          </button>
        )}
      </div>
      {dialog}
      {leaveOpen ? (
        <ConfirmDialog
          testId="leave-dialog"
          title="Leave Session"
          body="Leave this session? Your spot will open for someone else."
          confirmLabel="Leave Session"
          cancelLabel="Cancel"
          confirmTestId="confirm-leave-button"
          onCancel={() => setLeaveOpen(false)}
          onConfirm={() => {
            leaveSession(session.id);
            setLeaveOpen(false);
          }}
        />
      ) : null}
      {chatOpen ? (
        <ChatSheet
          messages={messages}
          players={state.players}
          onClose={() => setChatOpen(false)}
          onSend={(text) => sendMessage(session.id, text)}
        />
      ) : null}
    </div>
  );
}
