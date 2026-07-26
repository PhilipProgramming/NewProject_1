# Pomegranate

**Pomegranate** by Tantalus Incorporated — a retail performance tracker for sales associates.

Version 0.1 is a local-only MVP: no backend, no POS integration. Associates manually log today's numbers and see calculated KPIs on a dashboard.

## Quick start

```bash
npm install
npm start
```

Then press `w` for web, scan the QR code with Expo Go on your phone, or use an emulator.

## What it does (V0.1)

### Manual inputs
- Total sales amount ($)
- Number of transactions
- Number of shoes sold
- Number of accessories sold

### Configurable settings
- Daily sales goal ($)
- Commission rate (%)
- Associate name (optional greeting)

### Auto-calculated KPIs
| Metric | Formula |
|--------|---------|
| Goal progress | total sales ÷ daily goal |
| Average transaction value (ATV) | total sales ÷ transactions |
| Commission earned | total sales × (commission rate ÷ 100) |
| FAR (Footwear Attach Rate) | accessories sold ÷ shoes sold |

## Architecture

```
Screens (app/) → Components → Hooks → Context → Storage (AsyncStorage)
                                    ↘ lib/calculations (pure functions)
```

| Folder | Purpose |
|--------|---------|
| `app/` | Expo Router screens and navigation |
| `components/` | Reusable UI (MetricCard, ProgressBar, etc.) |
| `context/` | Global state via React Context + useReducer |
| `hooks/` | Derived data (e.g. today's KPIs) |
| `lib/` | Pure utilities — calculations, dates, formatting |
| `storage/` | AsyncStorage read/write (repository boundary) |
| `types/` | TypeScript data models |
| `constants/` | Theme tokens and defaults |

**Why Context?** One user, small state tree — ideal for learning React Native patterns without Redux overhead.

**Why no stored KPIs?** Calculated fields are derived on read so changing commission rate or goal instantly updates the dashboard.

## Screens

| Screen | Route | Tab |
|--------|-------|-----|
| Dashboard | `/` | Yes |
| History | `/history` | Yes |
| Settings | `/settings` | Yes |
| Log Activity | `/log` | Modal from Dashboard |
| Day Detail | `/day/[date]` | Stack from History |

## Data persistence

AsyncStorage keys:
- `@pomegranate/settings`
- `@pomegranate/days`

Days are keyed by local calendar date (`YYYY-MM-DD`).

## Manual test checklist

- [ ] First launch shows default goal ($1,000) and commission (5%)
- [ ] Save settings → force-quit app → settings persist
- [ ] Log today's activity → Dashboard updates KPIs
- [ ] Change commission rate → commission on Dashboard recalculates without re-logging sales
- [ ] Log a day → appears in History → tap row → Day Detail shows same numbers
- [ ] FAR shows 0 when shoes sold is 0
- [ ] ATV shows 0 when transactions is 0
- [ ] Invalid inputs show field errors on Log screen

## What's next (V0.2+)

1. **SQLite** (`expo-sqlite`) for queryable history
2. **Auth** + multi-associate profiles
3. **Sync API** with conflict resolution via `updatedAt`
4. **POS / SQL warehouse** ingestion — importer writes normalized `DayActivity` rows
5. **Store-level analytics** dashboards

The `storage/persistence.ts` module is the swap point: replace AsyncStorage calls with API/SQL without rewriting screens.

## Tech stack

- Expo SDK 57
- React Native + TypeScript
- Expo Router (file-based navigation)
- React Context + useReducer
- AsyncStorage
- expo-linear-gradient, Fraunces + DM Sans fonts

---

*Tantalus Incorporated · Track today. Grow tomorrow.*
