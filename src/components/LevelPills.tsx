import type { Level } from '../types';
import { LEVELS } from '../types';
import { pillClass } from './styles';

function levelSlug(level: Level): string {
  return level.replace('.', '').toLowerCase();
}

export function LevelPills({
  value,
  onChange,
  label,
  testIdPrefix,
}: {
  value: Level | null;
  onChange: (level: Level) => void;
  label: string;
  testIdPrefix: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          role="radio"
          aria-checked={value === level}
          data-testid={`${testIdPrefix}-${levelSlug(level)}`}
          className={pillClass(value === level)}
          onClick={() => onChange(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
