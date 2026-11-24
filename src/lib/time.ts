/** Demo clock starts at 12:50 so "Today, 6 PM" is still ahead, and +5h lands inside the 1h window. */
export function createClockOrigin(realNow = new Date()): number {
  return new Date(realNow.getFullYear(), realNow.getMonth(), realNow.getDate(), 12, 50, 0, 0).getTime();
}

export function appNow(clockOrigin: number, timeOffsetMs: number): number {
  return clockOrigin + timeOffsetMs;
}

export function formatTimeLabel(ts: number): string {
  const date = new Date(ts);
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  if (minutes === 0) return `${hour12} ${suffix}`;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function calendarDaysApart(ts: number, now: number): number {
  const event = new Date(ts);
  const current = new Date(now);
  const eventDay = new Date(event.getFullYear(), event.getMonth(), event.getDate()).getTime();
  const currentDay = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
  return Math.round((eventDay - currentDay) / 86_400_000);
}

export function formatWhen(ts: number, now: number): string {
  const time = formatTimeLabel(ts);
  const dayDiff = calendarDaysApart(ts, now);
  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Tomorrow, ${time}`;
  if (dayDiff === -1) return `Yesterday, ${time}`;
  const weekday = new Date(ts).toLocaleDateString('en-US', { weekday: 'short' });
  return `${weekday}, ${time}`;
}

export function toDateInput(ts: number): string {
  const date = new Date(ts);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function toTimeInput(ts: number): string {
  const date = new Date(ts);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function fromDateAndTime(date: string, time: string): number | null {
  if (!date || !time) return null;
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return new Date(year, month - 1, day, hour, minute, 0, 0).getTime();
}

export function defaultSessionStart(now: number): number {
  const current = new Date(now);
  const candidate = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 18, 0, 0, 0);
  if (candidate.getTime() <= now) candidate.setDate(candidate.getDate() + 1);
  return candidate.getTime();
}

export function isOneHourReminder(startsAt: number, now: number): boolean {
  const delta = startsAt - now;
  return delta > 0 && delta <= 60 * 60 * 1000;
}

export function atDayTime(origin: number, dayOffset: number, hour: number, minute = 0): number {
  const date = new Date(origin);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.getTime();
}

export function nextWeekdayTime(origin: number, weekday: number, hour: number, minute = 0): number {
  const originDate = new Date(origin);
  let delta = (weekday - originDate.getDay() + 7) % 7;
  const candidate = new Date(origin);
  candidate.setDate(originDate.getDate() + delta);
  candidate.setHours(hour, minute, 0, 0);
  if (candidate.getTime() <= origin) {
    candidate.setDate(candidate.getDate() + 7);
  }
  return candidate.getTime();
}
