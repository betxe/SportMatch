import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { EvalEvent, EvalEventType, TaskRun } from './eval-logger';
import { EVAL_TASKS } from './eval-logger';

interface LogInput {
  type: EvalEventType;
  detail: string;
  characters?: number;
}

interface EvalValue {
  active: boolean;
  tasks: TaskRun[];
  runningId: string | null;
  selectedId: string;
  setSelectedId: (id: string) => void;
  startTask: () => void;
  endTask: () => void;
  log: (event: LogInput) => void;
}

const EvalContext = createContext<EvalValue | null>(null);

export function EvalProvider({ active, children }: { active: boolean; children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskRun[]>([]);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>(EVAL_TASKS[0].id);
  const runningRef = useRef<string | null>(null);
  const location = useLocation();
  const pathRef = useRef(location.pathname);

  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  const log = useCallback((event: LogInput) => {
    const id = runningRef.current;
    if (!id) return;
    const entry: EvalEvent = { ...event, at: Date.now() };
    setTasks((current) =>
      current.map((task) => (task.id === id && !task.endedAt ? { ...task, events: [...task.events, entry] } : task)),
    );
  }, []);

  const startTask = useCallback(() => {
    const preset = EVAL_TASKS.find((task) => task.id === selectedId);
    if (!preset) return;
    const startedAt = Date.now();
    runningRef.current = preset.id;
    setRunningId(preset.id);
    setTasks((current) => {
      const closed = current.map((task) => (task.endedAt ? task : { ...task, endedAt: startedAt }));
      return [
        ...closed,
        {
          id: preset.id,
          title: preset.title,
          startedAt,
          events: [{ type: 'screen change', at: startedAt, detail: pathRef.current }],
        },
      ];
    });
  }, [selectedId]);

  const endTask = useCallback(() => {
    const id = runningRef.current;
    if (!id) return;
    runningRef.current = null;
    setRunningId(null);
    const endedAt = Date.now();
    setTasks((current) => current.map((task) => (task.id === id && !task.endedAt ? { ...task, endedAt } : task)));
  }, []);

  useEffect(() => {
    if (!active) return;
    log({ type: 'screen change', detail: location.pathname });
  }, [active, location.pathname, log]);

  useEffect(() => {
    if (!active) return;
    const root = document.getElementById('app-screen');
    if (!root) return;
    const lengths = new WeakMap<EventTarget, string>();

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('[data-testid]');
      if (!target || !root.contains(target)) return;
      const label = (target.getAttribute('aria-label') || target.textContent || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 80);
      const testId = target.getAttribute('data-testid') || '';
      log({ type: 'tap', detail: `${testId} ${label}`.trim() });
    };

    const rememberValue = (event: Event) => {
      const element = event.target;
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) return;
      if (!root.contains(element)) return;
      lengths.set(element, element.value ?? '');
    };

    const onInput = (event: Event) => {
      const element = event.target;
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) return;
      if (!root.contains(element)) return;
      if (element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')) return;
      const next = element.value ?? '';
      const prev = lengths.get(element);
      if (prev === undefined) {
        lengths.set(element, next);
        return;
      }
      const added = next.startsWith(prev) ? next.length - prev.length : Math.max(0, next.length - prev.length);
      lengths.set(element, next);
      if (added > 0) {
        log({
          type: 'text input',
          detail: element.getAttribute('data-testid') || element.getAttribute('aria-label') || 'input',
          characters: added,
        });
      }
    };

    root.addEventListener('click', onClick);
    root.addEventListener('focusin', rememberValue);
    root.addEventListener('input', onInput);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('focusin', rememberValue);
      root.removeEventListener('input', onInput);
    };
  }, [active, log]);

  const value = useMemo<EvalValue>(
    () => ({ active, tasks, runningId, selectedId, setSelectedId, startTask, endTask, log }),
    [active, endTask, log, runningId, selectedId, startTask, tasks],
  );

  return <EvalContext.Provider value={value}>{children}</EvalContext.Provider>;
}

export function useEval(): EvalValue {
  const value = useContext(EvalContext);
  if (!value) throw new Error('useEval must be used within EvalProvider');
  return value;
}
