import type { SportName } from '../types';
import { pillClass } from './styles';

export type FeedFilter = 'All' | 'Near Me' | SportName;

const BASE_CHIPS: { id: FeedFilter; label: string; testId: string }[] = [
  { id: 'All', label: 'All', testId: 'filter-chip-all' },
  { id: 'Basketball', label: 'Basketball', testId: 'filter-chip-basketball' },
  { id: 'Football', label: 'Football', testId: 'filter-chip-football' },
  { id: 'Near Me', label: 'Near Me', testId: 'filter-chip-near-me' },
];

export function FilterChips({
  value,
  playsTennis,
  onChange,
}: {
  value: FeedFilter;
  playsTennis: boolean;
  onChange: (filter: FeedFilter) => void;
}) {
  const chips = playsTennis
    ? [...BASE_CHIPS, { id: 'Tennis' as const, label: 'Tennis', testId: 'filter-chip-tennis' }]
    : BASE_CHIPS;
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter sessions">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          role="radio"
          aria-checked={value === chip.id}
          data-testid={chip.testId}
          className={pillClass(value === chip.id, 'filter')}
          onClick={() => onChange(chip.id)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
