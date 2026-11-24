import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LevelPills } from '../components/LevelPills';
import { ScreenHeader } from '../components/ScreenHeader';
import { fieldClass, primaryButtonClass } from '../components/styles';
import { useEval } from '../lib/eval-context';
import { useApp } from '../state/store';
import type { Level, SportName, SportSkill } from '../types';
import { SPORTS } from '../types';

export function OnboardingPlayerCard({ mode }: { mode: 'create' | 'edit' }) {
  const { state, completeProfile } = useApp();
  const { log } = useEval();
  const navigate = useNavigate();
  const { profile } = state;
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [nameTouched, setNameTouched] = useState(false);
  const [ageTouched, setAgeTouched] = useState(false);
  const [checked, setChecked] = useState<Record<SportName, boolean>>(() => ({
    Basketball: profile.sports.some((skill) => skill.sport === 'Basketball'),
    Football: profile.sports.some((skill) => skill.sport === 'Football'),
    Tennis: profile.sports.some((skill) => skill.sport === 'Tennis'),
  }));
  const [levels, setLevels] = useState<Record<SportName, Level | null>>(() => {
    const initial: Record<SportName, Level | null> = { Basketball: null, Football: null, Tennis: null };
    for (const skill of profile.sports) initial[skill.sport] = skill.level;
    return initial;
  });

  const ageNumber = Number(age);
  const nameOk = name.trim().length > 0;
  const ageOk = Number.isInteger(ageNumber) && ageNumber >= 18 && ageNumber <= 30;
  const sports: SportSkill[] = SPORTS.flatMap((sport) => {
    const level = levels[sport];
    return checked[sport] && level ? [{ sport, level }] : [];
  });
  const sportsOk = sports.length > 0;
  const canNext = nameOk && ageOk && sportsOk;

  let hint = '';
  if (!nameOk) hint = 'Enter your name.';
  else if (!ageOk) hint = 'Age must be between 18 and 30.';
  else if (!sportsOk) hint = 'Choose a level for at least one sport.';

  const showHintError = (!nameOk && nameTouched) || (!ageOk && ageTouched);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <ScreenHeader title="Create Player Card" onBack={mode === 'edit' ? () => navigate('/card') : undefined} />
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canNext) {
            if (hint) log({ type: 'error shown', detail: hint });
            setNameTouched(true);
            setAgeTouched(true);
            return;
          }
          completeProfile(name, ageNumber, sports);
          navigate(mode === 'edit' ? '/card' : '/home');
        }}
      >
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
          <div>
            <label htmlFor="name-input" className="mb-1 block text-sm font-semibold">
              Name
            </label>
            <input
              id="name-input"
              data-testid="name-input"
              className={fieldClass}
              value={name}
              autoComplete="name"
              onBlur={() => {
                setNameTouched(true);
                if (!name.trim()) log({ type: 'error shown', detail: 'Enter your name.' });
              }}
              onChange={(event) => setName(event.target.value)}
            />
            {nameTouched && !nameOk ? (
              <p className="mt-1 text-sm text-danger" role="alert">
                Enter your name.
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="age-input" className="mb-1 block text-sm font-semibold">
              Age
            </label>
            <input
              id="age-input"
              data-testid="age-input"
              className={fieldClass}
              inputMode="numeric"
              min={18}
              max={30}
              value={age}
              onBlur={() => {
                setAgeTouched(true);
                const next = Number(age);
                if (!Number.isInteger(next) || next < 18 || next > 30) {
                  log({ type: 'error shown', detail: 'Age must be between 18 and 30.' });
                }
              }}
              onChange={(event) => setAge(event.target.value)}
            />
            {ageTouched && !ageOk ? (
              <p className="mt-1 text-sm text-danger" role="alert">
                Age must be between 18 and 30.
              </p>
            ) : null}
          </div>
          <fieldset>
            <legend className="mb-2 text-lg font-semibold">Sports you play</legend>
            <div className="space-y-3">
              {SPORTS.map((sport) => (
                <div key={sport} className="rounded-2xl border-[1.5px] border-[rgba(27,36,51,0.12)] bg-white px-3 py-1">
                  <label
                    data-testid={`sport-checkbox-${sport.toLowerCase()}`}
                    className="flex min-h-12 items-center gap-3 text-base font-semibold"
                  >
                    <input
                      type="checkbox"
                      className="h-6 w-6 accent-cobalt"
                      checked={checked[sport]}
                      onChange={(event) => {
                        const on = event.target.checked;
                        setChecked((current) => ({ ...current, [sport]: on }));
                        if (!on) setLevels((current) => ({ ...current, [sport]: null }));
                      }}
                    />
                    {sport}
                  </label>
                  {checked[sport] ? (
                    <div className="pb-3">
                      <LevelPills
                        label={`${sport} level`}
                        value={levels[sport]}
                        testIdPrefix={`level-${sport.toLowerCase()}`}
                        onChange={(level) => setLevels((current) => ({ ...current, [sport]: level }))}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="shrink-0 px-4 pb-4 pt-3">
          {hint ? (
            <p className={`mb-2 text-sm ${showHintError ? 'text-danger' : 'text-muted'}`}>{hint}</p>
          ) : null}
          <button type="submit" data-testid="next-button" className={primaryButtonClass} disabled={!canNext}>
            NEXT
          </button>
        </div>
      </form>
    </div>
  );
}
