import { useEffect, useRef, useState } from 'react';
import { findPlayer } from '../lib/players';
import type { ChatMessage, Player } from '../types';

export function ChatSheet({
  messages,
  players,
  onSend,
  onClose,
}: {
  messages: ChatMessage[];
  players: Player[];
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-[rgba(17,24,39,0.45)] p-3">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Session Chat"
        data-testid="chat-sheet"
        className="flex max-h-[75%] w-full flex-col rounded-2xl bg-white p-4 shadow-card"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Session Chat</h2>
          <button ref={closeRef} type="button" data-testid="chat-close" className="h-12 px-3 text-base font-semibold" onClick={onClose}>
            Close
          </button>
        </div>
        <div ref={listRef} className="flex min-h-[8rem] flex-1 flex-col gap-2 overflow-y-auto">
          {messages.length === 0 ? <p className="text-sm text-muted">No messages yet.</p> : null}
          {messages.map((message) => {
            const author = findPlayer(players, message.authorId);
            return (
              <p key={message.id} className="rounded-xl bg-board px-3 py-2 text-base text-ink">
                <span className="font-semibold">{author?.name ?? 'Player'}: </span>
                {message.text}
              </p>
            );
          })}
        </div>
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!text.trim()) return;
            onSend(text);
            setText('');
          }}
        >
          <label className="sr-only" htmlFor="chat-input">
            Message
          </label>
          <input
            id="chat-input"
            data-testid="chat-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="h-12 min-w-0 flex-1 rounded-xl border-[1.5px] border-ink/40 px-3 text-base"
            placeholder="Write a message"
          />
          <button
            type="submit"
            data-testid="chat-send"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-cobalt px-4 text-base font-semibold text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
