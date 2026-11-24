import { useEffect, useState } from 'react';
import { formatClock } from '../lib/time';
import { downloadText, EVAL_TASKS, taskMetrics, tasksToCsv, tasksToJson } from '../lib/eval-logger';
import { useEval } from '../lib/eval-context';
import { useApp } from '../state/store';

export function EvalPanel() {
  const { tasks, runningId, selectedId, setSelectedId, startTask, endTask } = useEval();
  const { now, simulateFiveHours } = useApp();
  const [open, setOpen] = useState(false);
  const [clockMs, setClockMs] = useState(() => Date.now());

  useEffect(() => {
    if (!runningId) return;
    const timer = window.setInterval(() => setClockMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [runningId]);

  const latest = [...tasks].reverse().find((task) => task.id === selectedId);
  const metrics = latest ? taskMetrics(latest, latest.endedAt ?? clockMs) : null;

  const download = () => {
    downloadText('sportmatch-log.json', tasksToJson(tasks), 'application/json');
    window.setTimeout(() => {
      downloadText('sportmatch-log.csv', tasksToCsv(tasks), 'text/csv');
    }, 400);
  };

  return (
    <section className="mt-3 w-full max-w-[390px] rounded-2xl bg-white text-ink shadow-card" aria-label="Evaluation mode">
      <button
        type="button"
        className="flex h-12 w-full items-center justify-between px-4 text-sm font-semibold"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Evaluation mode
        <span>{open ? 'Hide' : 'Show'}</span>
      </button>
      {open ? (
        <div className="max-h-80 space-y-3 overflow-y-auto px-4 pb-4">
          <p className="text-sm text-muted">Demo clock: {formatClock(now)}</p>
          <ul className="space-y-2">
            {EVAL_TASKS.map((task) => {
              const selected = selectedId === task.id;
              return (
                <li key={task.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    className={`w-full rounded-xl border-[1.5px] px-3 py-2 text-left text-sm ${selected ? 'border-cobalt bg-[#E8EEFC]' : 'border-ink/20 bg-white'}`}
                    onClick={() => setSelectedId(task.id)}
                  >
                    <span className="font-semibold">{task.id}. </span>
                    {task.title}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2">
            <button type="button" className="h-12 flex-1 rounded-xl bg-cobalt text-sm font-semibold text-white" onClick={startTask}>
              Start task
            </button>
            <button
              type="button"
              className="h-12 flex-1 rounded-xl border-[1.5px] border-ink text-sm font-semibold disabled:opacity-40"
              onClick={endTask}
              disabled={!runningId}
            >
              End task
            </button>
          </div>
          {runningId ? <p className="text-sm font-semibold">Running {runningId}</p> : null}
          {metrics ? (
            <p className="text-sm text-ink">
              Time {(metrics.totalTimeMs / 1000).toFixed(1)}s · Taps {metrics.taps} · Keystrokes {metrics.keystrokes} ·
              Screens {metrics.screenChanges} · Errors {metrics.errors}
            </p>
          ) : (
            <p className="text-sm text-muted">Pick a task, then press Start task.</p>
          )}
          <button
            type="button"
            className="h-12 w-full rounded-xl border-[1.5px] border-ink px-3 text-sm font-semibold"
            onClick={simulateFiveHours}
          >
            Simulate +5h (show 1h reminder)
          </button>
          <button type="button" className="h-12 w-full rounded-xl border-[1.5px] border-ink px-3 text-sm font-semibold" onClick={download}>
            Download log (JSON and CSV)
          </button>
        </div>
      ) : null}
    </section>
  );
}
