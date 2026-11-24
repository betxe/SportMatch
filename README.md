# SportMatch

Clickable mobile mock-up of SportMatch, a noticeboard for university students and amateur players who want to play at a balanced level. It runs entirely in the browser with sample data. There is no backend and no account.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). The first screen is **Create Player Card**. After that, the app opens on the Noticeboard feed.

Refresh keeps your Player Card, sessions, and messages. **My Player Card → Reset demo data** restores the sample sessions and shows the Player Card screen again.

## Evaluation mode

Open:

```text
http://localhost:5173/?eval=1#/
```

A collapsible **Evaluation mode** panel sits under the phone. It lists tasks T1–T6, times a task, and downloads `sportmatch-log.json` and `sportmatch-log.csv`.

**Simulate +5h (show 1h reminder)** moves the demo clock forward five hours. The demo clock starts at 12:50, so one press puts **Today, 6 PM** inside the 1h reminder window on **My Games**.

## Build

```bash
npm run build
```
