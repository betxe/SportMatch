import { Star } from 'lucide-react';
import type { SportSkill } from '../types';
import { SportIcon } from './SportIcon';

export function PlayerCard({
  name,
  age,
  attendance,
  sports,
}: {
  name: string;
  age: number;
  attendance: number;
  sports: SportSkill[];
}) {
  const initial = name.trim().charAt(0).toUpperCase() || 'M';
  return (
    <article className="rounded-2xl border-[1.5px] border-[rgba(27,36,51,0.12)] bg-white p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-cobalt text-2xl font-bold text-white"
          aria-hidden
        >
          {initial}
        </div>
        <p className="text-2xl font-bold">
          {name}, {age}
        </p>
      </div>
      <div
        className="mt-4 rounded-2xl border-[1.5px] border-success bg-[#DCFCE7] px-4 py-4 text-center"
        data-testid="attendance-percentage"
      >
        <p className="text-4xl font-bold text-ink">{attendance}%</p>
        <p className="text-base font-semibold text-ink">Attendance</p>
      </div>
      <h2 className="mt-5 text-lg font-semibold">Sports you play</h2>
      <ul className="mt-2 space-y-1">
        {sports.map((skill) => (
          <li key={skill.sport} className="flex min-h-12 items-center gap-2 text-base">
            <SportIcon sport={skill.sport} />
            <span className="font-semibold">
              {skill.sport} ({skill.level})
            </span>
            <Star size={16} aria-hidden className="text-warning" />
          </li>
        ))}
      </ul>
    </article>
  );
}
