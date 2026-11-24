export const EVAL_TASKS = [
  { id: 'T1', title: 'Create the Player Card (Basketball Int., Football Adv.).' },
  { id: 'T2', title: 'Find a basketball session for today and join it.' },
  { id: 'T3', title: 'Create a Football session for tomorrow at 7 PM at Campus Field with 10 spots.' },
  { id: 'T4', title: 'Mark "No" for a game you cannot attend.' },
  { id: 'T5', title: 'Check your attendance percentage.' },
  { id: 'T6', title: 'Send a message in the Session Chat of a session you joined.' },
] as const;

export type EvalTaskId = (typeof EVAL_TASKS)[number]['id'];

export type EvalEventType = 'tap' | 'text input' | 'screen change' | 'error shown' | 'dialog shown' | 'back pressed';

export interface EvalEvent {
  type: EvalEventType;
  at: number;
  detail: string;
  characters?: number;
}

export interface TaskRun {
  id: string;
  title: string;
  startedAt: number;
  endedAt?: number;
  events: EvalEvent[];
}

export interface TaskMetrics {
  totalTimeMs: number;
  taps: number;
  keystrokes: number;
  screenChanges: number;
  errors: number;
}

export function isEvalMode(): boolean {
  const search = new URLSearchParams(window.location.search);
  if (search.get('eval') === '1') return true;
  return /[?&]eval=1(?:&|$)/.test(window.location.hash);
}

export function taskMetrics(task: TaskRun, now = Date.now()): TaskMetrics {
  const end = task.endedAt ?? now;
  return {
    totalTimeMs: Math.max(0, end - task.startedAt),
    taps: task.events.filter((event) => event.type === 'tap').length,
    keystrokes: task.events.reduce((sum, event) => sum + (event.characters ?? 0), 0),
    screenChanges: task.events.filter((event) => event.type === 'screen change').length,
    errors: task.events.filter((event) => event.type === 'error shown').length,
  };
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function tasksToJson(tasks: TaskRun[]): string {
  const payload = {
    generatedAt: new Date().toISOString(),
    tasks: tasks.map((task) => ({
      ...task,
      ...taskMetrics(task),
    })),
  };
  return JSON.stringify(payload, null, 2);
}

export function tasksToCsv(tasks: TaskRun[]): string {
  const lines = ['task,type,timestamp,detail,characters'];
  for (const task of tasks) {
    for (const event of task.events) {
      lines.push(
        [task.id, event.type, String(event.at), csvEscape(event.detail), event.characters ?? ''].join(','),
      );
    }
    const metrics = taskMetrics(task);
    lines.push(
      [
        task.id,
        'summary',
        String(task.endedAt ?? ''),
        csvEscape(
          `timeMs=${metrics.totalTimeMs};taps=${metrics.taps};keystrokes=${metrics.keystrokes};screens=${metrics.screenChanges};errors=${metrics.errors}`,
        ),
        '',
      ].join(','),
    );
  }
  return lines.join('\n');
}

export function downloadText(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
