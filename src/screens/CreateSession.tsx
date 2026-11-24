import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScreenHeader } from '../components/ScreenHeader';
import { SessionCard } from '../components/SessionCard';
import { fieldClass, pillClass, primaryButtonClass } from '../components/styles';
import { useEval } from '../lib/eval-context';
import { defaultSessionStart, fromDateAndTime, toDateInput, toTimeInput } from '../lib/time';
import { useApp } from '../state/store';
import type { Intensity, Level, Session, SportName } from '../types';
import { INTENSITIES, PLACE_SUGGESTIONS, USER_ID } from '../types';

function placeTestId(place: string): string {
  return `place-${place.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function CreateSession() {
  const { state, now, publishSession, showToast } = useApp();
  const { log } = useEval();
  const navigate = useNavigate();
  const sports = state.profile.sports;
  const initialSport = sports[0]?.sport ?? 'Football';
  const initialStart = defaultSessionStart(now);
  const [step, setStep] = useState(1);
  const [sport, setSport] = useState<SportName>(initialSport);
  const [date, setDate] = useState(toDateInput(initialStart));
  const [time, setTime] = useState(toTimeInput(initialStart));
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState<Level>(sports[0]?.level ?? 'Int.');
  const [intensity, setIntensity] = useState<Intensity>('Casual');
  const [spots, setSpots] = useState(10);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 1) return;
    log({ type: 'screen change', detail: `Step ${step} of 3` });
  }, [log, step]);

  const startsAt = fromDateAndTime(date, time);

  const preview = useMemo<Session>(
    () => ({
      id: 'preview',
      sport,
      level,
      intensity,
      startsAt: startsAt ?? now,
      meetingPoint: location.trim() || 'Meeting point',
      hostId: USER_ID,
      spots,
      playerIds: [USER_ID],
      distanceKm: 0.5,
      createdAt: now,
    }),
    [intensity, level, location, now, sport, spots, startsAt],
  );

  if (sports.length === 0) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <ScreenHeader title="Create Session" onBack={() => navigate('/home')} />
        <div className="px-4">
          <p className="text-base">Add a sport on your Player Card first.</p>
          <Link to="/card/edit" data-testid="edit-sports-button" className={`${primaryButtonClass} mt-4`}>
            Edit sports and levels
          </Link>
        </div>
      </div>
    );
  }

  const fail = (message: string) => {
    setError(message);
    log({ type: 'error shown', detail: message });
  };

  const validateWhen = (): number | null => {
    if (!startsAt) {
      fail('Enter a date and a time.');
      return null;
    }
    if (startsAt < now) {
      fail('Date and time cannot be in the past.');
      return null;
    }
    return startsAt;
  };

  const goNext = () => {
    if (step === 1) {
      if (!sport) {
        fail('Choose a sport.');
        return;
      }
      if (!location.trim()) {
        fail('Enter a meeting point.');
        return;
      }
      if (!validateWhen()) return;
      setError('');
      setStep(2);
      return;
    }
    if (step === 2) {
      setError('');
      setStep(3);
    }
  };

  const publish = () => {
    const when = validateWhen();
    if (!when) return;
    if (!location.trim()) {
      fail('Enter a meeting point.');
      return;
    }
    publishSession({
      sport,
      level,
      intensity,
      startsAt: when,
      meetingPoint: location.trim(),
      spots,
    });
    showToast('Session published');
    navigate('/home');
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <ScreenHeader
        title="Create Session"
        onBack={() => {
          if (step === 1) navigate('/home');
          else setStep((current) => current - 1);
        }}
      />
      <div className="px-4">
        <p className="text-sm font-semibold">Step {step} of 3</p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-white"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step}
          aria-label={`Step ${step} of 3`}
        >
          <div className="h-full rounded-full bg-cobalt" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="sport-select" className="mb-1 block text-sm font-semibold">
                Sport
              </label>
              <select
                id="sport-select"
                data-testid="sport-select"
                className={fieldClass}
                value={sport}
                onChange={(event) => {
                  const next = event.target.value as SportName;
                  setSport(next);
                  const skill = sports.find((item) => item.sport === next);
                  if (skill) setLevel(skill.level);
                }}
              >
                {sports.map((skill) => (
                  <option key={skill.sport} value={skill.sport}>
                    {skill.sport}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="date-input" className="mb-1 block text-sm font-semibold">
                  Date
                </label>
                <input
                  id="date-input"
                  data-testid="date-input"
                  type="date"
                  className={fieldClass}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="time-input" className="mb-1 block text-sm font-semibold">
                  Time
                </label>
                <input
                  id="time-input"
                  data-testid="time-input"
                  type="time"
                  className={fieldClass}
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="location-input" className="mb-1 block text-sm font-semibold">
                Meeting point
              </label>
              <input
                id="location-input"
                data-testid="location-input"
                className={fieldClass}
                list="place-suggestions"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              <datalist id="place-suggestions">
                {PLACE_SUGGESTIONS.map((place) => (
                  <option key={place} value={place} />
                ))}
              </datalist>
              <div className="mt-2 flex flex-wrap gap-2">
                {PLACE_SUGGESTIONS.map((place) => (
                  <button
                    key={place}
                    type="button"
                    data-testid={placeTestId(place)}
                    aria-pressed={location === place}
                    className={pillClass(location === place)}
                    onClick={() => setLocation(place)}
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {step === 2 ? (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold">Level</p>
              <div className="flex flex-wrap gap-2">
                {(['Beg.', 'Int.', 'Adv.'] as Level[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-testid={`session-level-${item.replace('.', '').toLowerCase()}`}
                    aria-pressed={level === item}
                    className={pillClass(level === item)}
                    onClick={() => setLevel(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Pace / Intensity</p>
              <div className="flex flex-wrap gap-2">
                {INTENSITIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-testid={`intensity-${item.toLowerCase()}`}
                    aria-pressed={intensity === item}
                    className={pillClass(intensity === item)}
                    onClick={() => setIntensity(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Spots</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-testid="spots-decrease"
                  aria-label="Fewer spots"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-ink text-xl font-semibold"
                  onClick={() => setSpots((current) => Math.max(2, current - 1))}
                >
                  −
                </button>
                <span data-testid="spots-value" className="min-w-10 text-center text-xl font-bold" aria-live="polite">
                  {spots}
                </span>
                <button
                  type="button"
                  data-testid="spots-increase"
                  aria-label="More spots"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-ink text-xl font-semibold"
                  onClick={() => setSpots((current) => Math.min(22, current + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {step === 3 ? (
          <div className="space-y-3">
            <p className="text-base">You will be Host in slot #1.</p>
            <SessionCard session={preview} now={now} />
          </div>
        ) : null}
        {error ? (
          <p className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <div className="shrink-0 px-4 pb-4 pt-3">
        {step < 3 ? (
          <button type="button" data-testid="next-button" className={primaryButtonClass} onClick={goNext}>
            NEXT
          </button>
        ) : (
          <button type="button" data-testid="publish-button" className={primaryButtonClass} onClick={publish}>
            PUBLISH
          </button>
        )}
      </div>
    </div>
  );
}
