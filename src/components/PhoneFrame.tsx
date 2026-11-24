import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex w-full max-w-[390px] flex-col overflow-hidden bg-board shadow-phone sm:rounded-[28px]"
      style={{ height: 'min(844px, 100dvh)' }}
    >
      {children}
    </div>
  );
}
