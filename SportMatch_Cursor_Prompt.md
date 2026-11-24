# SportMatch: Interactive Mock-up (Cursor Agent Prompt)

> How to use: open an empty folder in Cursor, switch to Agent mode, attach the Figure 1 image of the paper prototype (export it from the Class 6 PDF as a PNG and add it with `@`), and paste everything below the line. If Cursor asks for rules, save the "Hard constraints" and "Vocabulary" sections as `.cursor/rules/sportmatch.mdc` so they are applied to every later change.

---

## 0. Your role

You are a senior front-end engineer and UX-minded developer. Build a **clickable, high-fidelity electronic mock-up** of a mobile app called **SportMatch**. It is a university UX course prototype that will later be evaluated for usability (cognitive walkthrough, GOMS, KLM/TLM), so it must be **faithful to the design below, simple, predictable and fast**. It is NOT a production app: no real backend, no real authentication, no real maps. Everything works with simulated data in the browser.

Work in the phases of section 12. After each phase, run the app, check it against the checklist of that phase, fix problems, and only then continue. Do not add features that are not described here.

## 1. Product in one paragraph

SportMatch connects young adults (university students and amateur players, aged 18 to 30) who want to play sports together at a **balanced level**. A user sets a **different skill level for each sport**, browses upcoming **sessions** on a **Sports Noticeboard**, joins a game with one tap on a **Team Lineup Sheet** that shows who is coming (for example 6/10), gets a **1h reminder**, and confirms attendance. Reliable attendance is shown on the user's **Player Card**. The goal is to replace noisy WhatsApp groups with structured cards.

Primary persona: **Marc, 21**, engineering student in Barcelona, intermediate in basketball, advanced in football, often uses the phone outdoors in the sun, in a hurry, with one hand.

**Scope: young adults only.** There are NO child profiles, parent approval, elderly modes, voice search or "gentle pace" tiers. Do not build them.

## 2. Hard constraints

1. **Technology:** React 18 + TypeScript + Vite, Tailwind CSS, `react-router-dom` (HashRouter), `lucide-react` for icons. No backend. Persist state in `localStorage` (wrapped in try/catch) so a page refresh keeps the user's data. Provide a "Reset demo data" action.
2. **Mobile first:** design for a 390 x 844 px viewport. On desktop, render the app inside a centred phone frame (about 390 px wide, rounded corners, subtle shadow, light grey page background). Never require horizontal scrolling.
3. **English UI text only**, using exactly the vocabulary in section 4.
4. **Max. 50% icons:** most navigation and actions must be text labels. Icons only for sports, map pin, clock/bell and the back arrow, and always paired with a text label where possible.
5. **No heavy maps:** the meeting point is shown as a court name plus a small **static pin preview box** (a simple drawn placeholder, no map SDK, no network) and a text link "Open in Maps" that opens a Google Maps search URL in a new tab.
6. **Speed and simplicity:** creating a session takes at most 3 steps and joining takes one tap. No loading spinners longer than 300 ms; simulate everything instantly.
7. **No chat threads or feeds of messages on the home screen.** Chat exists only inside a session (section 7, view V3).
8. Everything must work offline after the first load. No external requests except Google Fonts (optional, with a system-font fallback).
9. Keep the code clean: small components, typed data, no unused dependencies, a short README with run instructions.

## 3. Visual design system

Look and feel: **index cards pinned on a noticeboard**, clean and legible outdoors. The paper prototype used white cards, dark ink text and cobalt blue highlights; keep that identity but as a polished digital UI.

- **Colours (define as CSS variables / Tailwind theme):**
  - Page background (noticeboard): `#EEF1F6`
  - Card surface: `#FFFFFF`, border `1.5px solid #1B2433` at 12% opacity, radius 16px, soft shadow
  - Ink (text): `#111827`; secondary text: `#4B5563` (never lighter than this on white)
  - Primary (cobalt blue): `#1F4FD8`, pressed `#173BA3`, text on primary `#FFFFFF`
  - Highlight (marker yellow) for the **1h reminder** badge only: `#FDE047` with dark ink text
  - Success `#15803D`, warning/full `#B45309`, error `#B91C1C`
  - Contrast ratio at least 4.5:1 for all text; 7:1 for primary text.
- **Typography:** `Inter` (fallback `system-ui`). Base 16px; card titles 18px semibold; screen titles 24px bold; live counter 20px bold; labels never below 14px.
- **Touch targets:** at least 48 x 48 px; primary action buttons are **full width, 56 px high, fixed at the bottom of the screen** (thumb zone), cobalt blue, uppercase label (JOIN GAME, NEXT, PUBLISH).
- **Filter chips:** pill shape, 40 px high, selected = filled cobalt with white text, unselected = white with ink border.
- **Spacing:** 16 px page padding, 12 px gap between cards.
- **Motion:** only short feedback (150 to 200 ms) such as a button press and the counter "ticking up". Respect `prefers-reduced-motion`.
- **Focus states:** visible 3 px outline on every interactive element; all controls reachable by keyboard.

## 4. Vocabulary (use these exact labels)

Use: **Session, Sport, Level (Beg., Int., Adv.), Pace / Intensity, Host, Spots, Confirmed players, Live counter, Join, Join Game, Leave Session, Lineup Sheet, Noticeboard feed, My Games, My Player Card, Attendance, No-show, Near Me, Meeting point, 1h reminder!, Are you going? (Yes / No), Session Chat.**

Never use: fixtures, league, tournament, contract, chat threads, lobby.

## 5. Navigation model

Bottom tab bar with **text labels** (icons optional and small): **Home** (Noticeboard feed), **My Games**, **My Player Card**. A prominent **"+ Create Session"** button on Home (floating or in the header). Onboarding (V1) is shown only the first time (or after "Reset demo data") and ends on Home. Back arrow top-left on detail and creation screens. Bell icon top-right on Home opens a simple notifications sheet listing the reminders of the user's upcoming games.

## 6. Mock data (seed)

Current user: **Marc, 21**, Attendance 95%, Basketball (Int.), Football (Adv.) after onboarding.

Other players: Leo, Alex, John, Sarah, Sam, Nora, Dani, Iker, Paula, Rubén.

Sessions (all in the near future, relative to "now"; compute times at load so "Today, 6 PM" always makes sense):

| Id | Sport | Level | Intensity | When | Meeting point | Host | Players / Spots |
|---|---|---|---|---|---|---|---|
| s1 | Basketball | Int. | Casual | Today, 6 PM | Campus Court #2 | Marc (Host) | Marc, Leo, Alex, John, Sarah, Sam = **6/10** |
| s2 | Football | Adv. | Competitive | Today, 8 PM | Turf Pitch B | Dani | **8/10** |
| s3 | Basketball | Adv. | Competitive | Tomorrow, 7 PM | Sports Hall Court 1 | Nora | **4/10** |
| s4 | Tennis | Beg. | Casual | Tomorrow, 5 PM | Park Courts | Paula | **2/4** |
| s5 | Football | Int. | Casual | Sat, 11 AM | Campus Field | Rubén | **9/10** |
| s6 | Basketball | Beg. | Casual | Sun, 10 AM | Campus Court #1 | Iker | **10/10 (full)** |

Marc starts as Host of s1 (slot 1) and already has one more upcoming joined game (s2) so that My Games shows a 1h reminder example. Add 3 past games to My Games (with attendance recorded) to support the 95% score.

## 7. Screens (the six core views)

### V1 · Create Player Card (onboarding)
- Title "Create Player Card". Name field (prefilled "Marc") and age field (prefilled 21, 18 to 30).
- Section "Sports you play": checkbox rows for **Basketball, Football, Tennis** (checked = reveals level pills).
- For each checked sport, three level pills **Beg. / Int. / Adv.** (one selectable, none preselected). Each sport has its own level.
- Bottom fixed **NEXT** button, disabled until at least one sport has a level. NEXT saves the profile and goes to Home.

### V2 · SportMatch Home (Noticeboard feed)
- Header: "SportMatch" title, bell at right.
- Filter chips row: **All, Basketball, Football, Near Me** (single selection; "Tennis" appears as a chip only if the user plays tennis). **Filtering is instant, there is no Apply button.** "Near Me" sorts by a fake distance value stored in the data and shows it on the card ("0.4 km").
- Sub-heading "Noticeboard feed".
- Cards (scannable): sport icon + sport name, **Live counter at top-right (6/10)**, when ("Today, 6 PM"), meeting point, level and intensity tags, and a **JOIN** button. If full, show "FULL" in warning colour and disable JOIN. If the user is already in, show "JOINED" with a tick and no JOIN button.
- Tapping the card (not the button) opens V3.
- Tapping JOIN on the card joins immediately (same logic as V3), shows a short confirmation toast "You are in! Slot #7", and the counter updates on the card. If the user's level for that sport does not match the session level, show a **confirmation dialog** ("This session is Adv. and your level is Int. Join anyway?" with Join anyway / Cancel). If the user does not have that sport on their Player Card, show a dialog offering to add it.
- Empty state if a filter has no results: "No sessions yet. Create the first one." with a button.

### V3 · Session Detail (Lineup Sheet)
- Header with back arrow, sport icon and "Basketball Session".
- Meeting point block: court name (e.g. "Campus Court #2") with the **static pin preview box** and "Open in Maps" link; date and time; level and intensity tags.
- **Lineup Sheet (6/10):** a numbered list that looks like a handwritten sheet or index card with ruled lines: `1. Marc (Host)`, `2. Leo`, ... up to the number of spots. **Empty slots are shown as blank numbered lines** (for example `7.`). Each player shows their reliability percentage in small text.
- Sticky bottom primary button **JOIN GAME**. After tapping: the user's name is **written into the next empty slot** (with a short "ink" fade-in), the counter updates (7/10), and the button changes to **LEAVE SESSION** (secondary style, with a confirmation dialog). If the session is full, the button reads "SESSION FULL" and is disabled.
- **Session Chat** (only visible to the Host and confirmed players): a button "Session Chat" under the Lineup Sheet that opens a bottom sheet with a simple message list and an input. Seed 2 messages ("What should I bring?" / "Just water, balls are there."). Messages are simulated and local. No chat appears anywhere else in the app.

### V4 · Create Session (3-step form)
Show a progress bar and the text "Step 1 of 3".
- **Step 1:** Select Sport (dropdown limited to the user's sports), Date & Time (native date and time inputs with sensible defaults, "Today, 6 PM"), Location (text field with suggestions: Campus Court #2, Campus Field, Turf Pitch B, Park Courts). Bottom button **NEXT**.
- **Step 2:** Level (Beg. / Int. / Adv. pills, default = the user's level for that sport), Intensity (Casual / Competitive), Spots (stepper, 2 to 22, default 10). Bottom button **NEXT**.
- **Step 3:** Review card that looks like the final Noticeboard card. Bottom button **PUBLISH**.
- Validation: date cannot be in the past; sport and location are required; inline error messages in plain words. Back goes to the previous step without losing data.
- PUBLISH adds the session to the feed, the creator is **Host in slot #1**, shows a toast "Session published", and returns to Home with the new card at the top.

### V5 · My Games
- Two sections: **Upcoming** and **Past**.
- Upcoming cards show sport, time, meeting point, the counter, and, when the start is within 1 hour, a highlighted yellow badge **"1h reminder!"** with a clock icon. Include a demo toggle (see section 9) to simulate time passing so the badge can be shown on demand.
- Each upcoming card has **"Are you going?"** with two large toggle buttons **Yes / No**. Choosing No leaves the session and updates its counter (with an Undo toast).
- Past games show an attendance result (Attended / No-show) and, for the Host, an action "Confirm attendance" that opens a checklist of players (tick who showed up). Saving it updates those players' reliability percentages.

### V6 · My Player Card
- A big index-card style profile: avatar placeholder, **Marc, 21**, a large highlighted **95% Attendance** badge, and "Sports you play" with one row per sport and its own level and star icon (`Basketball (Int.)`, `Football (Adv.)`).
- Buttons: "Edit sports and levels" (reopens V1 as editor), "Reset demo data".

## 8. Interaction rules (from the participatory sessions)

1. Filters apply instantly; no Apply button.
2. One-tap Join / Join Game. The counter updates immediately everywhere (feed card, detail, My Games).
3. Session creation never exceeds 3 steps and should be completable in under 30 seconds.
4. The meeting point is always a court or park name plus a small static pin preview, never a full interactive map.
5. Session Chat exists only inside a session and only for the Host and confirmed players.
6. Attendance can be changed with Yes / No in My Games if plans change.
7. Primary buttons are always at the bottom of the screen.

## 9. Accessibility and quality

- Semantic HTML, labels for all inputs, `aria-live="polite"` for the counter and toasts, `alt`/`aria-label` for icons.
- All text contrast at least 4.5:1; do not use colour alone to convey meaning (the FULL and JOINED states must also have text).
- Keyboard navigation and visible focus on every control.
- Check there are no console errors or TypeScript errors, and that `npm run build` succeeds.

## 10. Suggested file structure

```
src/
  main.tsx, App.tsx, routes.tsx
  data/seed.ts, types.ts
  state/store.tsx            (React context + reducer + localStorage)
  components/                (PhoneFrame, BottomNav, FilterChips, SessionCard, LineupSheet,
                              LevelPills, CounterBadge, StaticPinPreview, Toast, ConfirmDialog,
                              ChatSheet, ReminderBadge, PlayerCard)
  screens/                   (OnboardingPlayerCard, Home, SessionDetail, CreateSession,
                              MyGames, MyPlayerCard)
  lib/time.ts
README.md
```

## 11. Build order (do not skip the checks)

1. **Phase 1, foundations:** project setup, theme, PhoneFrame, router, data types, seed data, store with localStorage. Check: app runs, phone frame renders, theme colours applied.
2. **Phase 2, V1 and V6:** onboarding Player Card and My Player Card. Check: per-sport levels saved and shown.
3. **Phase 3, V2 and V3:** Noticeboard feed with instant filters, Session Detail with Lineup Sheet, Join / Leave with live counters, level mismatch dialogs, full state, Session Chat. Check: joining on a card and on the detail screen both update the counter in both places.
4. **Phase 4, V4:** 3-step Create Session with validation. Check: published session appears first in the feed and the user is slot #1.
5. **Phase 5, V5:** My Games with Yes / No, 1h reminder badge, host attendance confirmation, notifications sheet.
6. **Phase 6, polish:** accessibility pass, empty states, README, `npm run build`.

## 12. Acceptance checklist (verify before finishing)

- [ ] Six core views exist and match the descriptions (V1 to V6).
- [ ] Per-sport levels, never one global level.
- [ ] Live counter is visible on cards, in the Lineup Sheet and in My Games, and always consistent.
- [ ] Join is one tap; the name is written into the next empty slot of the Lineup Sheet.
- [ ] Session creation has exactly 3 steps and shows "Step X of 3".
- [ ] No Apply button on filters; results change instantly.
- [ ] No full interactive map anywhere; static pin preview plus "Open in Maps".
- [ ] Session Chat only inside sessions, only for Host and confirmed players.
- [ ] Icons are a minority of the interface; actions have text labels.
- [ ] Primary buttons fixed at the bottom, at least 56 px high.
- [ ] Nothing about parents, children, elderly users, GPS routes or verified badges.
- [ ] `npm run build` passes without errors.

## 13. Out of scope (do not build)

Real login, real database, real push notifications, GPS routes, verified skill badges, interactive maps, payment, parent/child profiles, elderly mode, voice search, gym-partner matching, running and cycling pace filters.

When finished, summarise in 10 lines what was built, how to run it, and list any deviation from this specification with the reason.
