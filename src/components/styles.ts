export const primaryButtonClass =
  'inline-flex h-14 w-full items-center justify-center rounded-2xl bg-cobalt px-4 text-center text-base font-semibold text-white no-underline transition-colors active:bg-cobalt-pressed disabled:cursor-not-allowed disabled:bg-[#D1D5DB] disabled:text-[#1F2937]';

export const secondaryButtonClass =
  'inline-flex h-14 w-full items-center justify-center rounded-2xl border-[1.5px] border-ink bg-white px-4 text-center text-base font-semibold text-ink no-underline';

export const fieldClass =
  'h-12 w-full rounded-xl border-[1.5px] border-ink/40 bg-white px-3 text-base text-ink';

export function pillClass(selected: boolean, size: 'filter' | 'control' = 'control'): string {
  const height = size === 'filter' ? 'h-10' : 'h-12';
  return [
    `inline-flex ${height} items-center justify-center rounded-full px-4 text-sm font-semibold`,
    selected ? 'bg-cobalt text-white' : 'border-[1.5px] border-ink bg-white text-ink',
  ].join(' ');
}
