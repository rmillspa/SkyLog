# SkyLog — UI/UX Design Specification

> **Version:** 2.1  
> **Author:** SkyLog maintainers  
> **Date:** 2026-07-28  
> **Stack:** React 19 + TypeScript + Vite + Tailwind CSS 4  
> **Backend:** Go (backend-go/)  
> **Auth:** Token-based with optional multi-user login

---

## 1. Design System

### 1.1 Color Palette (Light Mode)

| Token | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| Primary | `blue-600` | `#2563eb` | Buttons, links, active states |
| Primary Light | `blue-100` | `#dbeafe` | Active nav button bg |
| Primary Dark | `blue-700` | `#1d4ed8` | Button hover |
| Surface | `white` | `#ffffff` | Cards, header, table rows |
| Background | `gray-50` | `#f9fafb` | Page background |
| Border | `gray-200` | `#e5e7eb` | Table borders, card borders |
| Border Input | `gray-300` | `#d1d5db` | Form input borders |
| Text Primary | `gray-900` | `#111827` | Headings, primary text |
| Text Secondary | `gray-600` | `#4b5563` | Body text, labels |
| Text Muted | `gray-500` | `#6b7280` | Placeholder, hints |
| Success | `green-100`/`green-700` | — | Success messages |
| Error | `red-100`/`red-600` | — | Error messages, validation |
| Warning | `amber-50`/`amber-800` | — | Warning banners, active filter state |
| Accent (aviation) | `sky-500` | `#0ea5e9` | Icons, highlights |

See § 9 for the full dark mode palette (zinc-800/900 based).

Custom theme tokens defined in `index.css` via `@theme`:

```css
@theme {
  --color-aviation: #0ea5e9;   /* Sky blue accent */
  --color-surface: #ffffff;     /* Card/panel background */
  --color-muted: #6b7280;      /* Muted text */
}
```

### 1.2 Typography

| Element | Class | Size (desktop) | Weight |
|---------|-------|----------------|--------|
| Page heading | `text-2xl sm:text-3xl font-bold` | 24px→30px | 700 |
| Card heading | `text-xs sm:text-sm font-medium uppercase tracking-wide` | 12px→14px | 500 |
| Card value | `text-2xl sm:text-3xl font-bold` | 24px→30px | 700 |
| Table header | `text-xs sm:text-sm font-semibold` | 12px→14px | 600 |
| Table cell | `text-xs sm:text-sm` | 12px→14px | 400 |
| Form label | `text-sm font-medium` | 14px | 500 |
| Form input | `text-sm` | 14px | 400 |
| Nav button | `text-xs sm:text-sm font-medium` | 12px→14px | 500 |

**Font Family:** System UI stack (Tailwind default): `ui-sans-serif, system-ui, -apple-system, sans-serif`.

**Numerics & table values:** `tabular-nums` class for consistent digit widths in time/count columns (used in FAA 8710 tables).

### 1.3 Spacing Grid

- Page padding: `p-4 sm:p-8` (16px → 32px)
- Header padding: `px-2 sm:px-6` with inner `max-w-6xl mx-auto` wrapper
- Content max-width: `max-w-6xl` (Dashboard, Settings, Currency), `max-w-[95%]` (Logbook), `max-w-2xl` (Entry Form)
- Card padding: `p-6`
- Card gap: `gap-4`
- Section margin-bottom: `mb-6`
- Nav items: `gap-0.5 sm:gap-1`
- Header height: `h-14 sm:h-16`

### 1.4 Shadows & Border Radius

| Component | Border Radius | Shadow |
|-----------|--------------|--------|
| Cards | `rounded-xl` (12px) | `shadow-md` |
| Buttons | `rounded-lg` (8px) | None |
| Inputs | `rounded-lg` (8px) | None (border only) |
| Nav buttons | `rounded-lg` (8px) | None |
| Alert banners | `rounded-lg` (8px) | None |
| Dropdown menus | `rounded-lg` (8px) | `shadow-lg` |
| Stat cards (hover) | `rounded-xl` | lifts `translateY(-2px)` |

### 1.5 Animation Tokens

| Keyframe | Duration | Easing | Usage |
|----------|----------|--------|-------|
| `fade-in` | 0.3s | ease-out | Page content, banners, modals |
| `slide-up` | 0.4s | ease-out | Cards, sections, panels |
| `pulse-soft` | 2s | ease-in-out infinite | Loading indicators |
| `shimmer` | 1.5s | linear infinite | Skeleton loading blocks |
| `pulse` (Tailwind) | — | — | Loading airplane emoji (`animate-pulse`) |

The `<main>` element uses a `key` prop of ``${currentPage}-${editingFlightId ?? "new"}`` which forces React to remount the entire page on navigation, re-triggering the `animate-fade-in` animation. Individual rows and cards use `animationDelay` via inline styles (`style={{ animationDelay: \`${idx * 30}ms\` }}`) for a staggered cascade effect.

---

## 2. Layout & Navigation

### 2.1 Page Structure

```
┌──────────────────────────────────────────────────────────┐
│  HEADER (shrink-0, flex row)                              │
│  ┌──────┐  ┌─────────┐ ┌─────────┐ ┌──────┐ ┌────────┐  │
│  │ ✈️   │  │Dashboard│ │Logbook  │ │Curr. │ │+ Flight│  │
│  │SkyLog│  └─────────┘ └─────────┘ └──────┘ └────────┘  │
│  └──────┘  ┌──────────┐ ┌────────┐  │ Logout (multi-user)│
│            │ FAA 8710  │ │Settings│  └────────────────────┤
│            └──────────┘ └────────┘                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  MAIN CONTENT (flex-1, overflow-y-auto, scrollable)      │
│                                                          │
│  Page component fills available height.                  │
│  Each page has its own scroll context.                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- **Header** is a non-scrollable top bar (`shrink-0` in a vertical flex container) with a white background, bottom border, and shadow.
- Navigation buttons scroll horizontally on mobile (`overflow-x-auto no-scrollbar`).
- The "SkyLog" text title is hidden on very small screens (<480px) via the `hide-xs` utility class; only the airplane emoji remains.
- Navigation buttons use inline SVG icons + text labels (icons always visible, text hidden on mobile via `hidden sm:inline`).
- **Active tab** gets `bg-blue-100 text-blue-700` (light) / `dark:bg-blue-800 dark:text-blue-100` (dark).
- Optional pages (Currency, FAA 8710) can be hidden via Settings → Page Visibility.
- **No sidebar** — tab-based navigation keeps it mobile-friendly.
- Multi-user mode adds a **Logout** button inline in the nav (separated by a `border-l` divider), styled with red text.
- The "New Flight" button uses a highlight state (`text-blue-600` / `dark:text-blue-400`) with hover bg tint.

### 2.2 Responsive Behavior

| Breakpoint | Width | Layout Changes |
|-----------|-------|----------------|
| Default (mobile) | <640px | Single column, nav text hidden (icons only), tables horizontally scrollable, stat grid 2-col, nav scrolls horizontally |
| `sm` | ≥640px | 2-column stat grid, 2-column form fields, nav labels visible, header height expands |
| `lg` | ≥1024px | 3-column stat grid on dashboard |

### 2.3 Utility Classes

Defined in `frontend/src/index.css`:

| Class | Breakpoint | Effect |
|-------|-----------|--------|
| `hide-xs` | <480px | `display: none` — hides the SkyLog text title |
| `px-mobile` | <480px | Reduced horizontal padding (0.75rem) |
| `mobile-stack` | <500px | `grid-template-columns: 1fr` — stacks 2-col grids |
| `table-cell-mobile` | <640px | Shrunk padding + font for table cells |
| `table-header-mobile` | <640px | Shrunk padding + font for table headers |
| `no-scrollbar` | — | Hides scrollbar (used by nav) |

Global base styles in `index.css`:
```css
html, body { overflow: hidden; }
#root { width: 100%; min-height: 100svh; }
html { overflow-x: hidden; }
/* Mobile touch targets */
button, a, input, select, textarea, label { touch-action: manipulation; }
```

---

## 3. Page Designs

### 3.1 Dashboard Page

**File:** `frontend/src/pages/Dashboard.tsx`

**Purpose:** Fully customizable at-a-glance overview of flying statistics.

**Components used:** `StatTile`, `RecentFlightsTile`, `AircraftTypeStatsTile`, `DashboardCustomizer`

```
┌──────────────────────────────────────────────────────┐
│  Dashboard                          [Tiles] [Edit]   │
│                                                        │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐            │
│  │Total Flt  │ │Total Hours│ │Night Hrs  │            │
│  │   185     │ │  289.3h   │ │   48.2h   │            │
│  └───────────┘ └───────────┘ └───────────┘            │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐            │
│  │30d Hours  │ │Total Ldg  │ │Unique AC  │            │
│  │   12.5h   │ │    84     │ │    3      │            │
│  └───────────┘ └───────────┘ └───────────┘            │
│                                                        │
│  ┌──────────────────────────────────────────────┐      │
│  │  Recent Flights (last 5)       [View All →]  │      │
│  │  ┌─────┬────────┬────┬────┬────┬────┬────┐  │      │
│  │  │Date │Aircraft│Reg │F→T │TOT │PIC │SIC │  │      │
│  │  ├─────┼────────┼────┼────┼────┼────┼────┤  │      │
│  │  │...  │  ...   │... │... │... │... │... │  │      │
│  │  └─────┴────────┴────┴────┴────┴────┴────┘  │      │
│  └──────────────────────────────────────────────┘      │
│                                                        │
│  ┌──────────────────────────────────────────────┐      │
│  │  Aircraft Type Totals                        │      │
│  │  ┌──────┬─────┬───┬───┬───┬───┬───┬───┬───┐ │      │
│  │  │ Type │ Tot │Flts│SEL│PIC│XC │...│...│   │ │      │
│  │  ├──────┼─────┼───┼───┼───┼───┼───┼───┼───┤ │      │
│  │  │ C172 │ 89h │ 45│45h│...│...│...│...│   │ │      │
│  │  │ ...  │ ... │...│...│...│...│...│...│   │ │      │
│  │  └──────┴─────┴───┴───┴───┴───┴───┴───┴───┘ │      │
│  │  ┌ Totals ──────────────────────────────────┐│      │
│  │  │ Combined totals across all types          ││      │
│  │  └──────────────────────────────────────────┘│      │
│  └──────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────┘
```

**Stat Cards:**

- Configurable grid of `StatTile` components.
- Drag-and-drop reorderable (desktop via HTML5 DnD, mobile via touch events).
- Each tile shows a label (uppercase, gray-500), a value (large bold), and an optional emoji icon.
- Tiles can be added/removed via the "Tiles" button → `DashboardCustomizer` slide-over panel.
- "Edit" toggle enters drag-reorder mode with numbered badges and grab cursors.
- Layout is persisted per-user via API (`getDashboardLayout` / `saveDashboardLayout`).
- Layout automatically syncs when column visibility changes in Settings: if a column is hidden, its corresponding tile type is replaced with the next non-hidden tile.
- Available tile types (see `src/dashboard/tileRegistry.ts`):
  - Total Flights, Total Hours, Night Hours, Hours Last 30 Days
  - Total Landings, Unique Aircraft
  - Per-category hours (SEL, SES, MEL, MES, Helicopter, Gyroplane, Powered Lift, Glider, Balloon, Airship)
  - Per-pilot-time hours (Solo, PIC, SIC, Dual, Instructor)
  - Special categories (Cross Country, Night, Actual/Simulated Instrument, FFS, FTD, ATD)
  - Takeoffs/Landings (Day, Night)
  - Instrument Procedures (Precision, Non-Precision, Holding)

**Recent Flights Section:**

- Static table below the stat cards showing the 5 most recent entries.
- Columns: Date, Aircraft Type, Registration, From→To, Total Time, PIC, SIC.
- "View All" link dispatches a `navigate` event to switch to the Logbook.

**Aircraft Type Totals:**

- Per-aircraft-type table with total hours, flights, days since last flight.
- Columns respect column visibility settings (hidden categories are excluded from the header and cells).
- Sticky header + sticky first column (aircraft type).
- Sticky totals row at the bottom (`tfoot` with `sticky bottom-0 z-10`).
- Table has `max-h-[calc(100vh-16rem)]` for vertical scroll containment.

**States:**
- **Loading:** Skeleton cards (6 grey blocks with shimmer animation).
- **Empty (no flights):** Welcome card with airplane emoji and "Log Your First Flight" CTA.
- **Error:** Red error banner.

---

### 3.2 Logbook Page

**File:** `frontend/src/pages/Logbook.tsx`

**Purpose:** Full searchable, filterable, sortable, paginated table of all flight entries with per-column visibility.

```
┌───────────────────────────────────────────────────────────────┐
│  Logbook                                                       │
│                                                                  │
│  [Sort: Date ▼] [Filter ▼] [🔍 Search flights...]               │
│                                                                  │
│  ┌─────┬──────┬──────────┬────┬────┬────┬────┬────┬────┬────┐ │
│  │Date │Aircraft│Reg     │From│ To │ TOT│ SEL│ PIC│... │ ⚙  │ │
│  ├─────┼──────┼──────────┼────┼────┼────┼────┼────┼────┼────┤ │
│  │06/15│ C172 │ N2860Q  │KLAX│KCRQ│ 1.2│ 1.2│ 1.2│... │ ✎🗑│ │
│  │...  │ ...  │  ...    │... │... │ ...│ ...│ ...│... │    │ │
│  └─────┴──────┴──────────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                  │
│  Rows: [25 ▼]     Showing 1-25 of 185 flights    ‹ 1 2 3 … 8 › │
└───────────────────────────────────────────────────────────────┘
```

**Sorting:**
- Dropdown menu selecting any column to sort by.
- Direction toggle (asc/desc) inline in the dropdown as two buttons.
- Active sort has a direction indicator icon next to the option.
- Sort options filtered to only include columns visible in settings ("attachments" is always available).
- Tapping the same field toggles direction; tapping a new field defaults to descending.

**Filtering:**
- Dropdown menu with per-category quick filters (e.g. "SEL", "Night", "Helicopter", "Has Attachments").
- Active filter shows an amber badge with dismiss "×" chip.
- Filter options filtered to only include columns visible in settings ("has_attachments" is always available).
- Also supports free-text search across: aircraft type, registration, departure, arrival, PIC, remarks.

**All columns** (configurable via Settings → Column Visibility):

| Column Group | Columns |
|-------------|---------|
| Basic Info | Date (always visible, sticky), Pilot in Command, Aircraft Type, Registration, Departure, Arrival |
| Times | Total Time, SEL, SES, MEL, MES, Helicopter, Gyroplane, Powered Lift, Glider, Balloon, Airship |
| Pilot Time | Solo, PIC, SIC, Dual Received, Instructor |
| Categories | Cross Country, Night, Actual Instrument, Sim Instrument, FFS, FTD, ATD |
| Takeoffs/Landings | Day Takeoffs, Night Takeoffs, Day Landings, Night Landings |
| Instrument | Precision Approaches, Non-Precision Approaches, Holding Patterns |
| Other | Glider/LTA Launch Type, Remarks |
| Actions | Edit + Delete buttons (always visible) |

**Features:**
- **Date column** is sticky left with its own z-index (`z-40` on header, `z-10` on cells; cells use `group-hover:bg-gray-50` for row hover consistency).
- **Attachment indicator** — a paperclip icon + count is shown in the Date column when a flight has attachments.
- **Pagination** — configurable page size (10, 15, 25, 50, 100, All). Page-number buttons (max 5 shown, centred around current page). When pageSize is 0, all rows are shown.
- **Sort/filter dropdowns** have `z-50` to appear above the sticky table header (`z-30`).
- Outside-click handling closes open dropdowns via `mousedown` event listener.
- Column visibility respects the `sortToColumnKey` mapping — hidden columns cannot be sorted or filtered on.
- Row actions (edit/delete) are always visible (mobile-friendly) via `opacity: 1` on `.row-actions`.
- Delete triggers a `confirm()` dialog.
- Table has `max-h-[calc(100vh-16rem)]` for vertical scroll containment.

**States:**
- **Loading:** Skeleton rows + skeleton control buttons.
- **Empty (no flights):** Book emoji + "No flights logged yet" CTA.
- **Search no results:** "No flights match your search or filter." with clear link.
- **Error:** Red error banner.

---

### 3.3 Entry Form Page

**File:** `frontend/src/pages/EntryForm.tsx`

**Purpose:** Add new flight entries or edit existing ones, with file attachments.

```
┌────────────────────────────────────────────┐
│  Log a New Flight      [Edit Mode]         │
│                                             │
│  ┌───Success banner───────────────────────┐│
│  │ ✓ Flight logged successfully!          ││
│  └────────────────────────────────────────┘│
│                                             │
│  2-column grid of fields                   │
│  ┌───────────────┐ ┌──────────────────────┐│
│  │ Date*         │ │ Pilot in Command    ││
│  │ [2026-07-06]  │ │ [Mike Brogan       ] ││
│  └───────────────┘ └──────────────────────┘│
│  ┌───────────────┐ ┌──────────────────────┐│
│  │ Aircraft Type*│ │ Registration*        ││
│  │ [Cessna 172]  │ │ [N2860Q            ] ││
│  └───────────────┘ └──────────────────────┘│
│  ... (all time/count category fields)      │
│                                             │
│  Launch Type field (appears when glider/   │
│  balloon/airship time > 0)                 │
│  ┌────────────────────────────────────────┐│
│  │ [Select launch type...]   ⚠ required   ││
│  └────────────────────────────────────────┘│
│                                             │
│  Remarks:                                   │
│  ┌────────────────────────────────────────┐│
│  │ VFR flight, smooth air                 ││
│  └────────────────────────────────────────┘│
│                                             │
│  ┌─ Attachments (collapsible) ────────────┐│
│  │ │ 📎 Attachments (2)                  ▼││
│  │ │ ┌─ file.pdf  2.3 MB · Jul 6 [⬇][🗑]││
│  │ │ │_ flight.jpg 1.1 MB · Jul 6 [⬇][🗑]││
│  │ │ [Attach File]  Max 25 MB             ││
│  └────────────────────────────────────────┘│
│                                             │
│  ┌────────────────────────────────────────┐│
│  │        [Log Flight / Update Flight]    ││
│  └────────────────────────────────────────┘│
└────────────────────────────────────────────┘
```

**Field layout:**
- Two-column grid on tablet/desktop, single column on mobile.
- Fields are conditionally rendered based on column visibility settings (hidden columns hide the corresponding form field).
- Required fields marked with red asterisk (`*`): only **Date, Aircraft Type, Registration, Departure, Arrival, Total Time**. Pilot in Command is **not** required — the field is text input without validation.
- Inputs with `<datalist>` autocomplete suggestions populated from previously logged values (PIC, aircraft type/reg, airports).
- Auto-calculation of total time from departure/arrival times (Zulu HHMM format). Respects overnight crossings. Only fires when the user hasn't manually typed into the total_time field (tracked via `totalTimeManuallySet` ref).
- ICAO airport codes auto-uppercased on submit.

**Launch Type:**
- Only shown when glider, balloon, or airship time > 0.
- Required in that case — shows a warning banner if missing with amber styling.
- Values: Aero-Tow, Ground Launch, Powered Launch.
- Automatically enables the "Launch Type" column visibility in Logbook settings when a glider/LTA flight is saved.

**All time fields:**
- All 21 FAA categories: SEL, SES, MEL, MES, Helicopter, Gyroplane, Powered Lift, Glider, Balloon, Airship, Solo, PIC, SIC, Dual, Instructor, Cross Country, Night, Actual Instrument, Simulated Instrument, FFS, FTD, ATD.
- All count fields: Day/Night Takeoffs, Day/Night Landings, Precision/Non-Precision Approaches, Holding Patterns.

**Attachments:**
- Collapsible section using `AttachmentsSection` component (see § 4.1).
- Before save: files are staged locally, submitted together with the form (via `createFlightWithAttachments` / `updateFlightWithAttachments`).
- After save: files upload directly to the API (`uploadAttachment`), visible immediately.
- Max file size: 25 MB per file.

**Auto-transition to edit mode:** After creating a flight, the form transitions to edit mode via `setCreatedFlightId(created.id)` so the user can immediately attach files.

**Validation rules (client-side):**
- **Required**: date (not empty), aircraft_type (non-empty), aircraft_reg (non-empty), departure (non-empty), arrival (non-empty), total_time (must be > 0).
- **Numeric non-negative**: all time/count fields parsed as floats/ints, validated to not be negative.
- **night_time ≤ total_time**: night_time cannot exceed total_time.
- **Launch type**: required when glider/balloon/airship time > 0.

**States:**
- **Create mode:** Empty form, today's date pre-filled.
- **Edit mode:** Form pre-populated, button says "Update Flight".
- **Loading (edit):** Full-width skeleton rows.
- **Saving:** Button shows spinner + "Saving..." / "Updating...".
- **Success:** Green banner with slide-up animation, form stays populated.
- **Error:** Red banner.
- **Validation:** Red border + error text on invalid fields.

---

### 3.4 Settings Page

**File:** `frontend/src/pages/Settings.tsx`

**Purpose:** Central configuration hub with collapsible sections (Theme and Default Page are always expanded).

```
┌──────────────────────────────────────────────────────┐
│  Settings                                             │
│                                                        │
│  ┌── Theme (always open) ───────────────────────────┐│
│  │  [System Theme 🖥️]  [Light Mode ☀️]  [Dark Mode 🌙]││
│  └──────────────────────────────────────────────────┘│
│                                                        │
│  ┌── Default Page (always open) ────────────────────┐│
│  │  [Dashboard] [Logbook] [Currency] [New Flight]   ││
│  └──────────────────────────────────────────────────┘│
│                                                        │
│  ▼ Page Visibility                                    │
│  ▼ Time Category Visibility                           │
│  ▼ User Settings                                      │
│  ▼ CSV Management                                     │
│  ▼ Reset Settings                                     │
│  ▼ Danger Zone (Wipe Database)                        │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │              [ Save All Settings ]              │   │
│  └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

**Sections:**

| Section | Contents |
|---------|----------|
| **Theme** | Three visual cards: System Theme, Light Mode, Dark Mode. Active card has blue border + blue bg tint. |
| **Default Page** | Cards for each page, with visibility-filtered options (hidden optional pages excluded). Description text dynamically explains each choice. Persisted via API `saveDefaultPage`. |
| **Page Visibility** | Core pages (Dashboard, Logbook, Settings, New Flight) listed as informational "Always On" cards. Optional pages (Currency, FAA 8710) have toggle switches. |
| **Time Category Visibility** | All FAA time/count categories grouped into 7 sections: Basic Information, Time Categories, Pilot Time, Special Categories, Takeoffs & Landings, Instrument Procedures, Other. Custom checkbox toggles. "Show All" / "Hide All" bulk buttons. |
| **User Settings** | Username input + Update button. Password change (current + new + confirm). Multi-user mode toggle (admin only, with password confirmation modal that has cartoon brutalist styling: `border-2 border-black`). |
| **CSV Management** | Export button → downloads all flights as CSV (40 columns). Import button → file picker for CSV upload, with per-row error reporting in an expandable error table. |
| **Reset Settings** | Three-step confirmation to reset page/column visibility + currency thresholds to defaults. |
| **Danger Zone** | Three-step wipe (type "DELETE" to confirm, then final warning) to delete ALL flights via `api.wipeFlights()`. |

**Column Visibility Groups** (in Settings UI):

| Group | Columns |
|-------|---------|
| Basic Information | Pilot in Command, Aircraft Type, Registration, Departure, Arrival, Departure Time, Arrival Time |
| Time Categories | SEL, SES, MEL, MES, Helicopter, Gyroplane, Powered Lift, Glider, Balloon, Airship |
| Pilot Time | Solo, PIC, SIC, Dual Received, Instructor |
| Special Categories | Cross Country, Night, Actual Instrument, Simulated Instrument, FFS, FTD, ATD |
| Takeoffs & Landings | Day Takeoffs, Night Takeoffs, Day Landings, Night Landings |
| Instrument Procedures | Precision Approaches, Non-Precision Approaches, Holding Patterns |
| Other | Glider/LTA Launch Type, Remarks |

**States:**
- **Saving:** "Save All Settings" button shows spinner.
- **Toast notifications:** Green success / red error banners (auto-dismiss after 3s).
- **Import errors:** Expandable table showing row number + error message.

---

### 3.5 Currency Page

**File:** `frontend/src/pages/Currency.tsx`

**Purpose:** Track flight currency requirements per FAA categories with configurable thresholds.

```
┌─────────────────────────────────────────────────────┐
│  Currency [🛫 🛬 🌙 🌃 📡 🔄]                        │
│                                                       │
│  ╔══ IFR Currency ══════════════════════════════╗    │
│  ║  📡 IFR Currency         [Current ✓]          ║    │
│  ║  ┌──────────┬──────┬──────────┬──────────┐    ║    │
│  ║  │Approaches│ Holds│ Combined │ Expires  │    ║    │
│  ║  │    8     │  2   │  10 / 7  │ Oct 12   │    ║    │
│  ║  └──────────┴──────┴──────────┴──────────┘    ║    │
│  ╚═══════════════════════════════════════════════╝    │
│                                                       │
│  All Categories                                       │
│  ┌───────────────┐ ┌──────────────┐ ┌─────────────┐  │
│  │ 🛫 Day T/O    │ │ 🛬 Day Ldg   │ │ 🌙 Night T/O│  │
│  │ [Current ✓]   │ │ [Expiring ⚠]│ │ [Not ✗]     │  │
│  │ Last: Jul 15  │ │ Last: Jun 2  │ │ Last: —     │  │
│  │ ████████░░ 3/3│ │ ██░░░░░░ 1/3│ │ ░░░░░░░░ 0/3│  │
│  └───────────────┘ └──────────────┘ └─────────────┘  │
│  ... (more cards)                                     │
│                                                       │
│  Recent Entries                           50 total   │
│  ┌──────────────────────────────────────────────┐    │
│  │ Jul 15  🛫 Day Takeoffs  3 day takeoffs      │    │
│  │ Jul 15  🛬 Day Landings  3 day landings      │    │
│  │ ...                                           │    │
│  └──────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
```

**Categories tracked:**
- Day Takeoffs, Day Landings, Night Takeoffs, Night Landings.
- IFR Approaches (precision + non-precision combined).
- Holding Procedures.

**Features:**
- Each category card has a progress bar (count / min), last event date, and status badge.
- Statuses: **Current** (green), **Expiring Soon** (yellow, >75% of window elapsed), **Not Current** (red).
- Progress bar colour: green (≥100%), yellow (≥75%), red (<75%).
- IFR card is a combined gradient card (`bg-gradient-to-br from-blue-50 to-indigo-50`) showing approaches, holds, combined total with min, and expiration date.
- Each card has a gear icon to edit thresholds inline (min count + days window) with cancel/save buttons. Thresholds persist via API (`saveCurrencyThresholds`).
- Recent Entries timeline shows last 50 qualifying events across all categories with date, icon, category label, and description.

**Default thresholds:** 3 in 90 days (takeoffs/landings), 6 in 180 days (approaches), 1 in 180 days (holds).

**States:**
- **Loading:** Skeleton IFR card + 6 skeleton category cards.
- **Empty:** Chart emoji + "No currency data yet" with CTA to add flights.
- **Error:** Red error banner.

---

### 3.6 FAA 8710 Page

**File:** `frontend/src/pages/FAA8710.tsx`

**Purpose:** Aggregated aeronautical experience totals in FAA Form 8710 format with aircraft-type-to-category mapping.

```
┌─────────────────────────────────────────────────────────────┐
│  FAA 8710 — Aeronautical Experience                          │
│                                                               │
│  ┌── Flight Time by Aircraft / Device ──────────────────┐    │
│  │ Aircraft/Device │Total│Dual│Solo│PIC│SIC│XC…│Instr│…│    │
│  ├─────────────────┼─────┼────┼────┼───┼───┼────┼────┼┤    │
│  │ Airplanes       │245.2│32.1│...│...│...│... │... ││    │
│  │ Rotorcraft      │ 12.5│ 8.0│...│...│...│... │... ││    │
│  │ Powered Lift    │  0.0│ 0.0│...│...│...│... │... ││    │
│  │ Glider          │  8.0│ 4.0│...│...│...│... │... ││    │
│  │ …               │ …   │ …  │ … │ … │ … │ …  │ …  ││    │
│  └─────────────────┴─────┴────┴────┴───┴───┴────┴────┘    │
│                                                               │
│  ┌── Glider & Lighter-than-Air ───── (launch totals) ──┐    │
│  │ Category │PIC Flts｜Dual Flts｜Total｜Tows｜Gnd｜Pwr││    │
│  ├──────────┼────────┼──────────┼──────┼─────┼───┼───┤│    │
│  │ Glider   │   8    │   2      │  12  │  8  │ 4  │ 0  ││    │
│  │ LTA      │   —    │   —      │   3  │  0  │ 3  │ 0  ││    │
│  └──────────┴────────┴──────────┴──────┴─────┴───┴───┘│    │
│                                                               │
│  ┌── Aircraft Class Totals ────────────────────────────┐    │
│  │ Airplane: SEL | MEL | SES | MES                     │    │
│  │ Rotorcraft: Helicopter | Gyroplane                   │    │
│  │ LTA: Balloon | Airship                               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌── Simulated Flight Device Totals ──────────────────┐    │
│  │ Device  │ SE  │ ME  │ Helicopter                    │    │
│  │ FFS     │ 2.3 │ 0.0 │ 0.0                          │    │
│  │ FTD     │ 1.0 │ 0.0 │ 0.0                          │    │
│  │ ATD     │ 0.0 │ 0.0 │ 0.0                          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  ▼ Aircraft / Simulator Type Mapping                         │
│  ┌─────────────────────────────────────────────────┐        │
│  │  Aircraft Type    │ 8710 Category              │        │
│  ├──────────────────┼────────────────────────────┤        │
│  │ Cessna 172S      │ [Single-Engine Land ▼]     │        │
│  │ Piper PA-28-181  │ [Single-Engine Land ▼]     │        │
│  │ Robinson R22     │ [Helicopter ▼]             │        │
│  │ …                │ …                          │        │
│  └─────────────────────────────────────────────────┘        │
│  [Save Mappings]                                            │
└─────────────────────────────────────────────────────────────┘
```

**Grid tables:**
1. **Flight Time by Aircraft/Device** — 17-column table: Total, Instruction Received, Solo, PIC, SIC, XC Instruction Received, XC Solo, XC PIC, XC SIC, Instrument, Night Instruction, Night T/O & Ldg (counts), Night PIC, Night SIC, Night T/O & Ldg PIC, Night T/O & Ldg SIC. Greyed-out cells per row (simulators, gliders have fewer required columns). Cross-country and night columns compute overlapping hours (e.g., XC PIC = hours where both xcountry_time AND pic_time > 0, using min of the two).
2. **Launch Totals** — Glider/LTA: PIC flights, dual flights, total flights, Aero-Tows, Ground Launches, Powered Launches. Glider row shows PIC/Dual/Total flight counts; LTA row shows Total flights only.
3. **Class Totals** — Airplane (SEL/MEL/SES/MES) with PIC/SIC/Instruction Received rows. Rotorcraft (Helicopter/Gyroplane) total hours. LTA (Balloon/Airship) total hours.
4. **Simulated Flight Totals** — By device type (FFS, FTD, ATD) × category (SE, ME, Helicopter).

**Aircraft Mapping:**
- Collapsible section (click header to expand/collapse, default state: open).
- Dropdown per unique aircraft type to map to its 8710 category.
- 13 available categories: SEL, SES, MEL, MES, Helicopter, Gyroplane, Powered Lift, Glider, Balloon, Airship, Full Flight Simulator, Flight Training Device, Aviation Training Device.
- Persisted per-user via API (`getFAA8710Mappings` / `saveFAA8710Mappings`).
- Mappings power all 8710 table calculations.

**States:**
- **Loading:** Table skeleton.
- **Empty:** Clipboard emoji + CTA.
- **Error:** Red error banner.
- **Mapping saving:** Inline success/error feedback.

---

### 3.7 Login Page

**File:** `frontend/src/pages/LoginPage.tsx`

**Purpose:** Authentication gateway when multi-user mode is enabled.

```
┌────────────────────────────────────────┐
│              ✈️                         │
│            SkyLog                       │
│                                         │
│  ┌─── Sign In / Create New User ────┐  │
│  │  Username: [___________]         │  │
│  │  Password: [___________]         │  │
│  │  [Confirm Pwd]  (if registering) │  │
│  │                                   │  │
│  │  [     Sign In / Create    ]     │  │
│  │                                   │  │
│  │  No account? Create one          │  │
│  │  Forgot Password?                │  │
│  └───────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**Features:**
- Toggle between Sign In and Create Account modes.
- Cartoon brutalist styling: `border-2 border-black` on all inputs, chunky drop shadow on button (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`), `rounded-2xl` on the card.
- Input validation: username required, password ≥ 6 chars, passwords must match (registration only).
- Forgot password hint (not yet implemented — tells user to delete database).
- The button text changes to "Signing in..." / "Creating Account..." when loading.

**States:**
- **Loading:** "Signing in..." / "Creating Account..." with disabled button.
- **Error:** Red banner below form.

---

## 4. Shared Components

### 4.1 Component Inventory

| File | Component | Props | Description |
|------|-----------|-------|-------------|
| `src/components/AttachmentsSection.tsx` | `AttachmentsSection` | `flightId`, `onStagedFilesChange?`, `clearStaged?` | File attachment management — view, download, delete, stage for unsaved flights. |
| (same) | `PaperclipIcon` | `className` | Paperclip SVG icon used as indicator in Logbook Date column. |
| `src/dashboard/tiles/StatTile.tsx` | `StatTile` | `label`, `value`, `icon?` | Dashboard stat display card with label + large value. |
| `src/dashboard/tiles/RecentFlightsTile.tsx` | `RecentFlightsTile` | `flights: Flight[]` | Compact 5-row table of recent flights with "View All" link. |
| `src/dashboard/tiles/AircraftTypeStatsTile.tsx` | `AircraftTypeStatsTile` | `stats`, `columnVisibility?` | Per-type aggregated stats table with sticky header + totals row. |
| `src/dashboard/DashboardCustomizer.tsx` | `DashboardCustomizer` | `layout`, `hiddenTileTypes`, `onSave`, `onClose` | Slide-over panel to toggle tiles on/off and reorder. |
| `src/App.tsx` (inline) | `NavButton` | `active`, `onClick`, `highlight?` | Navigation tab button in the header bar. |
| `src/pages/EntryForm.tsx` (inline) | `Field` | `label`, `name`, `type?`, `value`, `onChange`, `required?`, `error?`, `list?`, etc. | A single labelled form field with validation error display. |

### 4.2 Key Component Behaviours

**AttachmentsSection:**
- Collapsible accordion (starts closed, auto-opens when attachments exist or a file is staged).
- Before flight is saved: files staged locally, submitted with form (via `FlightCreate` multipart endpoints).
- After flight is saved: files upload directly to API (`api.uploadAttachment`).
- Max file size: 25 MB per file (validated client-side before upload).
- Download via API (fetches blob, creates temporary anchor element for browser download).
- Delete with confirmation dialog.
- Staged files shown with amber border styling, "will upload on save" label.

**StatTile:**
- White card with `shadow-md`, `border`, `rounded-xl`.
- Hover lift effect (`stat-card` CSS class: `translateY(-2px)` + enhanced shadow).
- Dark mode: zinc-900 background, zinc-400 border, white text.
- Mobile: heading `text-xs`, value `text-2xl`.

**DashboardCustomizer:**
- Fixed slide-over panel from right (max-w-md), backdrop `bg-black/40`, `animate-slide-left` animation.
- "Visible Tiles" section with toggle switches.
- "Add Tiles" section for tiles not in the layout.
- Hidden tile types (column-toggled-off) excluded from the add list.
- Save/Cancel footer.
- Each tile row shows icon, label, description, and toggle switch.

---

## 5. Application State Management

### 5.1 Authentication Flow (`App.tsx`)

```
               ┌──────────────┐
               │  App mounts   │
               └──────┬───────┘
                      │
              ┌───────▼────────┐
              │  Check auth:    │
              │  multiUserMode? │
              └───────┬────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    ┌────▼─────┐            ┌─────▼─────┐
    │  false   │            │   true    │
    │auth=auto │            │ check     │
    │login as  │            │ token in  │
    │admin     │            │localStore │
    └────┬─────┘            └─────┬─────┘
         │                       │
         │                 ┌─────┴─────┐
         │            ┌────┤ token?    ├────┐
         │            │    └───────────┘    │
         │            │ valid?              │ no token
         │       ┌────▼────┐          ┌────▼──────┐
         │       │complete │          │  show     │
         │       │ auth    │          │  login    │
         │       └────┬────┘          │  page     │
         │            │               └───────────┘
         │       ┌────▼────┐
         └──────►│authed   │
                 │render UI│
                 └─────────┘
```

**States:** `"loading"` → `"login"` | `"authenticated"`.

- Single-user mode (default): auto-login as admin, token stored in `localStorage`.
- Multi-user mode: user must sign in/register; `skylog_token` checked for validity via `api.getCurrentUser()`.
- Logout clears `skylog_token` from localStorage and shows login page.
- `multiUserModeChanged` event re-evaluates auth when toggled in Settings.
- Loading state shows centered airplane emoji with `animate-pulse` and "Loading..." text.

### 5.2 Navigation (Event-Driven)

Pages use custom DOM events rather than a router library:

| Event | Detail | Action |
|-------|--------|--------|
| `navigate` | `"dashboard"`, `"logbook"`, `"add"`, `"settings"`, `"currency"`, `"FAA8710"` | Switches current page, clears edit state |
| `edit-flight` | `flightId: number` | Opens EntryForm in edit mode |
| `settingsUpdated` | `{ columnVisibility, pageVisibility }` | Re-reads settings from localStorage |
| `flightsUpdated` | `Flight[]` | Signals other components (Dashboard, Currency) to refresh; re-checks glider launch type column |
| `multiUserModeChanged` | — | Re-evaluates auth |

The `<main>` element uses a React `key` prop of ``${currentPage}-${editingFlightId ?? "new"}`` to force remounting of the page component on every navigation, ensuring clean state and re-triggering entrance animations.

### 5.3 Settings Persistence

Settings are stored in `localStorage` under `"flightLogbookSettings"` and synced to the backend API via `saveVisibilityToApi` / `loadVisibilityFromApi` for per-user persistence across devices.

**Settings payload shape:**
```typescript
interface {
  pageSize: number;        // rows per page (0 = all)
  pageVisibility: {        // which optional pages are visible
    currency: boolean;
    FAA8710: boolean;
  };
  columnVisibility: {      // which logbook/entry-form columns are visible
    [columnKey: string]: boolean;  // 38+ keys (all FAA categories + metadata)
  };
  username: string;
  showLoginPage: boolean;
}
```

### 5.4 Theme Persistence

Stored in `localStorage` under `"skylog_theme"`. Value: `"system"` | `"light"` | `"dark"`. No API sync. Theme is applied in `main.tsx` before the first render via `applyTheme(getThemeMode())` to prevent flash of wrong colour scheme.

### 5.5 Dashboard Layout Persistence

Tile layout (which tiles and their order) stored per-user via API (`getDashboardLayout` / `saveDashboardLayout`). Layout is automatically synced when column visibility changes: hidden-column tiles are replaced with the next non-hidden tile from the registry definition order.

### 5.6 Glider/LTA Launch Type Column Auto-Enable

When a flight with a glider/balloon/airship launch type is saved via the EntryForm or imported via CSV, the app auto-enables the "Launch Type" column visibility in settings. This is checked on Settings mount and after `flightsUpdated` events.

---

## 6. Interaction Design

### 6.1 Micro-interactions

| Element | Hover | Active/Focus | Transition |
|---------|-------|--------------|------------|
| Nav button | `bg-gray-100` / `dark:bg-zinc-800` | `bg-blue-100 text-blue-700` | `transition-colors` 150ms |
| Table row | `bg-gray-50` / `dark:bg-zinc-700` | — | 150ms ease |
| Primary button | `bg-blue-700` | scale(0.98) | `transition-colors` 150ms |
| Input field | — | `ring-2 ring-blue-500` | 150ms |
| Stat card | subtle lift (`translateY(-2px)`) | — | 200ms ease |
| Sort/Filter button | — | Border + bg colour change | 150ms |
| Action icons (edit/delete) | `bg-blue-50` / `bg-red-50` | — | 150ms |

### 6.2 Loading States

- **Initial load:** Skeleton/placeholder UI (grey shimmer bars via `.skeleton` class with `shimmer` animation) rather than full-page spinners. The loading airplane emoji uses `animate-pulse`.
- **Data refresh:** Renders stale data while fetching new data (no visible flash).
- **Action feedback:** Button loading state with spinner SVG + disabled interaction.

### 6.3 Empty States

| Page | Empty State |
|------|-------------|
| Dashboard | Welcome card: airplane emoji + "Log your first flight to see your stats!" + CTA button |
| Logbook | Book emoji + "No flights logged yet. Ready for takeoff?" + CTA |
| Logbook (search) | "No flights match your search or filter." + clear link |
| Currency | Chart emoji + "No currency data yet" + CTA |
| FAA 8710 | Clipboard emoji + "No flights logged yet" + CTA |

---

## 7. Accessibility

- All form inputs have associated `<label>` elements via `htmlFor` matching the input `id`.
- Color contrast: All text meets WCAG AA (handled by Tailwind defaults).
- Focus indicators: `ring-2 ring-blue-500` on all interactive elements.
- Navigation: Logical tab order matching visual order.
- Buttons: Descriptive text or `title` attributes for icon-only buttons.
- Click targets: Minimum 44×44px touch target on mobile (handled by `touch-action: manipulation` in CSS).
- Table row actions are always visible (not just on hover) for mobile users via `opacity: 1` on `.row-actions`. On desktop, actions become visible on row hover via `.logbook-row:hover .row-actions { opacity: 1 }`.
- Touch-based drag-and-drop for dashboard tiles (iOS/Android support) using `touchstart`, `touchmove`, `touchend` events with `elementFromPoint` detection.
- Inputs on mobile have `touch-action: manipulation` to prevent double-tap zoom.

---

## 8. Data Model (Flight)

```typescript
interface Flight {
  id: number;
  date: string;                      // "2026-07-15"
  pilot_in_command: string;
  aircraft_type: string;
  aircraft_reg: string;
  departure: string;                 // ICAO code
  arrival: string;                   // ICAO code
  departure_time: string | null;     // Zulu HH:MM (e.g. "14:30")
  arrival_time: string | null;       // Zulu HH:MM (e.g. "16:45")
  total_time: number;

  // FAA time categories (hours, defaults to 0)
  sel_time: number;
  ses_time: number;
  mel_time: number;
  mes_time: number;
  helicopter_time: number;
  gyroplane_time: number;
  powered_lift_time: number;
  glider_time: number;
  balloon_time: number;
  airship_time: number;
  solo_time: number;
  pic_time: number;
  sic_time: number;
  dual_time: number;
  instructor_time: number;
  xcountry_time: number;
  night_time: number;
  act_instrument_time: number;
  sim_instrument_time: number;
  full_flight_simulator_time: number;
  flight_training_device_time: number;
  aviation_training_device_time: number;

  // Count categories
  takeoffs_day: number;
  takeoffs_night: number;
  landings_day: number;
  landings_night: number;
  precision_approaches: number;
  non_precision_approaches: number;
  holding_patterns: number;

  // Optional
  launch_type: string | null;        // "aero_tow" | "ground_launch" | "powered_launch"
  remarks: string | null;
  attachment_count: number;          // computed by API
  created_at: string;                // ISO 8601 timestamp
}

interface FlightCreate {
  // All properties same as Flight except:
  //   - No id, attachment_count, created_at
  //   - departure_time and arrival_time are optional (?)
  //   - night_time, landings_day, landings_night are optional (?)
  //   - precision_approaches, non_precision_approaches, holding_patterns are optional (?)
  //   - launch_type and remarks are optional (can be null)
  date: string;
  pilot_in_command: string;
  aircraft_type: string;
  aircraft_reg: string;
  departure: string;
  arrival: string;
  departure_time?: string | null;
  arrival_time?: string | null;
  total_time: number;
  sel_time: number;
  ses_time: number;
  mel_time: number;
  mes_time: number;
  helicopter_time: number;
  gyroplane_time: number;
  powered_lift_time: number;
  glider_time: number;
  balloon_time: number;
  airship_time: number;
  solo_time: number;
  pic_time: number;
  sic_time: number;
  dual_time: number;
  instructor_time: number;
  xcountry_time: number;
  night_time?: number;
  act_instrument_time: number;
  sim_instrument_time: number;
  full_flight_simulator_time: number;
  flight_training_device_time: number;
  aviation_training_device_time: number;
  takeoffs_day: number;
  takeoffs_night: number;
  landings_day?: number;
  landings_night?: number;
  precision_approaches?: number;
  non_precision_approaches?: number;
  holding_patterns?: number;
  launch_type?: string | null;
  remarks?: string | null;
}

interface Attachment {
  id: number;
  flight_id: number;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;          // ISO 8601
}

interface DashboardStats {
  total_flights: number;
  total_hours: number;
  total_night_hours: number;
  hours_last_30_days: number;
  total_landings: number;
  unique_aircraft: number;
  // All 21 FAA time categories as aggregated sums
  sel_time: number;
  ses_time: number;
  mel_time: number;
  mes_time: number;
  helicopter_time: number;
  gyroplane_time: number;
  powered_lift_time: number;
  glider_time: number;
  balloon_time: number;
  airship_time: number;
  solo_time: number;
  pic_time: number;
  sic_time: number;
  dual_time: number;
  instructor_time: number;
  xcountry_time: number;
  night_time: number;
  act_instrument_time: number;
  sim_instrument_time: number;
  full_flight_simulator_time: number;
  flight_training_device_time: number;
  aviation_training_device_time: number;
  // Count categories
  takeoffs_day: number;
  takeoffs_night: number;
  landings_day: number;
  landings_night: number;
  precision_approaches: number;
  non_precision_approaches: number;
  holding_patterns: number;
}
```

---

## 9. Dark Mode

**File:** `frontend/src/api/theme.ts`  
**Config:** `frontend/src/index.css` (uses Tailwind v4 class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *))`)

Three modes: `"system"` (follows OS, listens for changes via `MediaQueryListEvent`), `"light"`, `"dark"`. Applied by toggling the `.dark` class on `<html>`.

### 9.1 Dark Mode Palette

| Token | Tailwind Class | Light Hex | Dark Hex |
|-------|---------------|-----------|----------|
| Page Background | `dark:bg-zinc-800` | `#f9fafb` | `#27272a` |
| Card/Table Surface | `dark:bg-zinc-900` | `#ffffff` | `#18181b` |
| Header Surface | `dark:bg-zinc-900` | `#f9fafb` | `#18181b` |
| Border | `dark:border-zinc-400` | `#e5e7eb` | `#a1a1aa` |
| Text Primary | `dark:text-white` | `#111827` | `#ffffff` |
| Text Secondary | `dark:text-gray-300` | `#4b5563` | `#d4d4d8` |
| Text Muted | `dark:text-gray-400/500` | `#6b7280` | `#a1a1aa` |
| Input Background | `dark:bg-zinc-800` | `#ffffff` | `#27272a` |
| Dropdown Background | `dark:bg-zinc-800` | `#ffffff` | `#27272a` |
| Hover Surface | `dark:hover:bg-zinc-700` | `#f9fafb` | `#3f3f46` |
| Active Hover | `dark:hover:bg-zinc-600` | `#e5e7eb` | `#52525b` |

### 9.2 Key Principles

1. **Class-based** — Allows user override of OS preference.
2. **`zinc` palette** — Neutral grey-zinc tones, not pure black, for visual depth.
3. **`border-zinc-400`** — Sufficient contrast against zinc-900/800 surfaces.
4. **No image swaps** — All icons are SVGs inheriting `currentColor`.
5. **Blue accent unchanged** — Only backgrounds/borders shift; brand colour preserved.
6. **Instant toggle** — No global fade transition; individual elements may have `transition-colors`.

---

## 10. CSV Import / Export Format

The Settings page provides CSV export and import. The format uses 40 columns (matching the Flight model):

```
Date,Pilot in Command,Aircraft Type,Registration,Departure,Arrival,Departure Time,Arrival Time,Total Time,SEL,SES,MEL,MES,Helicopter,Gyroplane,Powered Lift,Glider,Balloon,Airship,Solo,PIC,SIC,Dual Received,Instructor,Cross Country,Night,Actual Instrument,Simulated Instrument,Full Flight Simulator,Flight Training Device,Aviation Training Device,Takeoffs Day,Takeoffs Night,Landings Day,Landings Night,Precision Approaches,Non-Precision Approaches,Holding Patterns,Glider/Lighter-than-Air Launch Type,Remarks
```

**Export:** Downloads `flights_YYYY-MM-DD.csv` via browser blob URL. Flights are sorted by date ascending. Launch type values are exported as human-readable labels (Aero-Tow, Ground Launch, Powered Launch).

**Import:** Parses CSV (respects double-quote escaping via custom parser), calls `api.createFlight` per row, reports per-row errors in an expandable table. Expects 40 columns. Launch type labels are reverse-mapped back to snake_case values. After import, dispatches `flightsUpdated` event and auto-enables the Launch Type column if glider/LTA flights were imported.

---

## 11. File Structure (Frontend)

```
frontend/src/
├── api/
│   ├── client.ts              // API client (fetch wrapper)
│   ├── settings.ts            // Settings persistence (localStorage + API)
│   ├── theme.ts               // Theme management
│   └── types.ts               // TypeScript interfaces (Flight, FlightCreate, etc.)
├── components/
│   └── AttachmentsSection.tsx  // File upload/download/delete/stage
├── dashboard/
│   ├── DashboardCustomizer.tsx // Tile toggle slide-over panel
│   ├── tileRegistry.ts         // Tile type definitions registry (30 tile types)
│   ├── types.ts                // Dashboard tile types
│   └── tiles/
│       ├── AircraftTypeStatsTile.tsx
│       ├── RecentFlightsTile.tsx
│       └── StatTile.tsx
├── pages/
│   ├── Currency.tsx            // Currency tracker with configurable thresholds
│   ├── Dashboard.tsx           // Main dashboard (customizable tiles + static sections)
│   ├── EntryForm.tsx           // Add/edit flight with attachments
│   ├── FAA8710.tsx             // FAA 8710 experience summary with mapping
│   ├── Logbook.tsx             // Flight log table (sort/filter/search/paginate)
│   ├── LoginPage.tsx           // Auth page (cartoon brutalist styling)
│   └── Settings.tsx            // App configuration hub
├── App.tsx                     // Root component (auth, nav, routing)
├── index.css                   // Global styles + Tailwind v4 config + animations
└── main.tsx                    // React entry point (theme applied before render)
```

---

## 12. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-18 | agent-designer | Initial design specification |
| 1.2 | 2026-07-28 | agent-designer | Added Dark Mode documentation |
| 2.0 | 2026-07-28 | maintainers | Full rewrite reflecting actual application state: dashboard customization, column visibility, sort/filter, autocomplete, currency tracker, FAA 8710, CSV import/export, multi-user auth, Settings page, attachment management, data model, file structure |
| 2.1 | 2026-07-28 | maintainers | Sync with actual source code: corrected Flight data model (removed `user_id`, `updated_at`), fixed EntryForm required fields (pilot_in_command not required), added `FlightCreate` interface details, documented mobile utility classes (`hide-xs`, `no-scrollbar`, `mobile-stack`, `table-cell-mobile`), added `@theme` tokens and base styles, added loading states (airplane animate-pulse, skeleton shimmer), documented column visibility groups from Settings, added animation-delay stagger pattern, added departure/arrival time format note, added glider/LTA auto-enable behaviour, expanded component inventory with `Field` |
