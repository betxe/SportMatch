import type { ReactNode } from 'react';

export function PhoneFrame({
  children,
  evalMode,
}: {
  children: ReactNode;
  evalMode: boolean;
}) {
  return (
    <div
      id="app-screen"
      className="relative flex w-full max-w-[390px] flex-col overflow-hidden bg-board shadow-phone sm:rounded-[28px]"
      style={{
        height: evalMode ? 'min(844px, calc(100dvh - 80px))' : 'min(844px, 100dvh)',
      }}
    >
      {children}
    </div>
  );
}
