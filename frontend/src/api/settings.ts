/**
 * SkyLog Settings Types and Helpers
 *
 * This module defines the TypeScript types for visibility preferences
 * (which optional pages appear in the nav bar, which columns appear in
 * the logbook table) and provides helper functions for loading/saving
 * those preferences to both ``localStorage`` (for synchronous access)
 * and the backend API (for per-user persistence).
 *
 * Two storage layers exist:
 *   1. **localStorage** — fast, synchronous, survives page refreshes
 *      but is local to the browser.
 *   2. **Backend API** (via ``api.getVisibility`` / ``api.saveVisibility``) —
 *      per-user, server-side, survives cache clears and device switches.
 *
 * The helpers here synchronise both layers so that the app is responsive
 * (reads from localStorage) while keeping the server as the source of
 * truth.
 *
 * @module api/settings
 */

import { api } from "./client";

// ═════════════════════════════════════════════════
// Types
// ═════════════════════════════════════════════════

/** Which optional pages are visible in the navigation bar. */
export interface PageVisibility {
  currency: boolean;
  FAA8710: boolean;
}

/** Which columns are visible in the Logbook table and EntryForm.
 *  Each key corresponds to a field in the Flight record. */
export interface ColumnVisibility {
  date: boolean;
  pilotInCommand: boolean;
  aircraftType: boolean;
  aircraftReg: boolean;
  departure: boolean;
  arrival: boolean;
  departureTime: boolean;
  arrivalTime: boolean;
  totalTime: boolean;
  selTime: boolean;
  sesTime: boolean;
  melTime: boolean;
  mesTime: boolean;
  helicopterTime: boolean;
  gyroplaneTime: boolean;
  poweredLiftTime: boolean;
  gliderTime: boolean;
  balloonTime: boolean;
  airshipTime: boolean;
  soloTime: boolean;
  picTime: boolean;
  sicTime: boolean;
  dualTime: boolean;
  instructorTime: boolean;
  xcountryTime: boolean;
  nightTime: boolean;
  actInstrumentTime: boolean;
  simInstrumentTime: boolean;
  fullFlightSimulatorTime: boolean;
  flightTrainingDeviceTime: boolean;
  aviationTrainingDeviceTime: boolean;
  
  takeoffsDay: boolean;
  takeoffsNight: boolean;
  landingsDay: boolean;
  landingsNight: boolean;
  precisionApproaches: boolean;
  nonPrecisionApproaches: boolean;
  holdingPatterns: boolean;
  launchType: boolean;
  remarks: boolean;
}

/** Which major sections are visible on the Dashboard page. */
export interface DashboardSections {
  /** The grid of small stat tiles at the top of the dashboard. */
  statTiles: boolean;
  /** The "Recent Flights" table below the stat tiles. */
  recentFlights: boolean;
  /** The "Aircraft Totals by Type" table at the bottom. */
  aircraftTotals: boolean;
}

/** Which columns are visible on the Recent Flights dashboard tile.
 *  Mirrors every data column presented on the Logbook page. */
export interface RecentFlightsColumns {
  date: boolean;
  pilotInCommand: boolean;
  aircraftType: boolean;
  aircraftReg: boolean;
  departure: boolean;
  arrival: boolean;
  totalTime: boolean;
  selTime: boolean;
  sesTime: boolean;
  melTime: boolean;
  mesTime: boolean;
  helicopterTime: boolean;
  gyroplaneTime: boolean;
  poweredLiftTime: boolean;
  gliderTime: boolean;
  balloonTime: boolean;
  airshipTime: boolean;
  soloTime: boolean;
  picTime: boolean;
  sicTime: boolean;
  dualTime: boolean;
  instructorTime: boolean;
  xcountryTime: boolean;
  nightTime: boolean;
  actInstrumentTime: boolean;
  simInstrumentTime: boolean;
  fullFlightSimulatorTime: boolean;
  flightTrainingDeviceTime: boolean;
  aviationTrainingDeviceTime: boolean;
  takeoffsDay: boolean;
  takeoffsNight: boolean;
  landingsDay: boolean;
  landingsNight: boolean;
  precisionApproaches: boolean;
  nonPrecisionApproaches: boolean;
  holdingPatterns: boolean;
  launchType: boolean;
  remarks: boolean;
}

/** Full settings object stored in localStorage. */
export interface SettingsData {
  pageVisibility: PageVisibility;
  columnVisibility: ColumnVisibility;
  recentFlightsColumns: RecentFlightsColumns;
  dashboardSections: DashboardSections;
  username: string;
  pageSize: number;
  showLoginPage: boolean;
}

// ═════════════════════════════════════════════════
// Defaults
// ═════════════════════════════════════════════════

/** Default: all columns visible except Launch Type. */
export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  date: true,
  pilotInCommand: true,
  aircraftType: true,
  aircraftReg: true,
  departure: true,
  arrival: true,
  departureTime: true,
  arrivalTime: true,
  totalTime: true,
  selTime: true,
  sesTime: true,
  melTime: true,
  mesTime: true,
  helicopterTime: true,
  gyroplaneTime: true,
  poweredLiftTime: true,
  gliderTime: true,
  balloonTime: true,
  airshipTime: true,
  soloTime: true,
  picTime: true,
  sicTime: true,
  dualTime: true,
  instructorTime: true,
  xcountryTime: true,
  nightTime: true,
  actInstrumentTime: true,
  simInstrumentTime: true,
  fullFlightSimulatorTime: true,
  flightTrainingDeviceTime: true,
  aviationTrainingDeviceTime: true,
  takeoffsDay: true,
  takeoffsNight: true,
  landingsDay: true,
  landingsNight: true,
  precisionApproaches: true,
  nonPrecisionApproaches: true,
  holdingPatterns: true,
  launchType: false,
  remarks: true,
};

/** Default: both optional pages visible. */
export const DEFAULT_PAGE_VISIBILITY: PageVisibility = {
  currency: true,
  FAA8710: true,
};

/** Default: every major Dashboard section is visible. */
export const DEFAULT_DASHBOARD_SECTIONS: DashboardSections = {
  statTiles: true,
  recentFlights: true,
  aircraftTotals: true,
};

/**
 * Default: the original compact Recent Flights set is visible.
 * All additional logbook categories default to hidden so the tile
 * keeps its current look until the user opts in via Settings.
 */
export const DEFAULT_RECENT_FLIGHTS_COLUMNS: RecentFlightsColumns = {
  date: true,
  pilotInCommand: false,
  aircraftType: true,
  aircraftReg: true,
  departure: true,
  arrival: true,
  totalTime: true,
  selTime: false,
  sesTime: false,
  melTime: false,
  mesTime: false,
  helicopterTime: false,
  gyroplaneTime: false,
  poweredLiftTime: false,
  gliderTime: false,
  balloonTime: false,
  airshipTime: false,
  soloTime: false,
  picTime: true,
  sicTime: true,
  dualTime: false,
  instructorTime: false,
  xcountryTime: false,
  nightTime: false,
  actInstrumentTime: false,
  simInstrumentTime: false,
  fullFlightSimulatorTime: false,
  flightTrainingDeviceTime: false,
  aviationTrainingDeviceTime: false,
  takeoffsDay: false,
  takeoffsNight: false,
  landingsDay: false,
  landingsNight: false,
  precisionApproaches: false,
  nonPrecisionApproaches: false,
  holdingPatterns: false,
  launchType: false,
  remarks: false,
};

/**
 * Keys of aviation "Time Categories" that are user-toggleable both in
 * Settings → Time Category Visibility (ColumnVisibility) and on the
 * Recent Flights dashboard tile (RecentFlightsColumns).
 *
 * When a Time Category is hidden in the Time Category Visibility settings,
 * its Recent Flights tile column must not be offered in Dashboard Settings
 * or presented on the tile. `totalTime` is intentionally excluded — it has
 * no Time Category Visibility toggle and is always available.
 */
export const TIME_CATEGORY_COLUMN_KEYS: Array<
  keyof ColumnVisibility & keyof RecentFlightsColumns
> = [
  "selTime",
  "sesTime",
  "melTime",
  "mesTime",
  "helicopterTime",
  "gyroplaneTime",
  "poweredLiftTime",
  "gliderTime",
  "balloonTime",
  "airshipTime",
];

/**
 * Return a copy of `columns` with every Time Category tile column forced
 * off when the matching Time Category is hidden in `visibility`. Used to
 * keep Recent Flights tile preferences in sync with Time Category
 * Visibility (and to sanitise data loaded from storage/API).
 */
export function withVisibleTimeCategoriesOnly(
  columns: RecentFlightsColumns,
  visibility: ColumnVisibility,
): RecentFlightsColumns {
  const result = { ...columns };
  for (const key of TIME_CATEGORY_COLUMN_KEYS) {
    if (!visibility[key]) {
      result[key] = false;
    }
  }
  return result;
}

/** O(1) membership lookup for Time Category column keys. */
const TIME_CATEGORY_COLUMN_SET: ReadonlySet<string> = new Set(TIME_CATEGORY_COLUMN_KEYS);

/** Whether a column key is a user-toggleable Time Category. */
export function isTimeCategoryColumn(key: string): boolean {
  return TIME_CATEGORY_COLUMN_SET.has(key);
}

const DEFAULT_PAGE_SIZE = 15;

// ═════════════════════════════════════════════════
// Synchronous localStorage helpers
// ═════════════════════════════════════════════════

/** Serialise page + column visibility into the JSON string format
 *  that the backend API expects. */
function serializeVisibility(pv: PageVisibility, cv: ColumnVisibility): { page_visibility: string; column_visibility: string } {
  return {
    page_visibility: JSON.stringify(pv),
    column_visibility: JSON.stringify(cv),
  };
}

/**
 * Load settings from localStorage.
 *
 * This is a synchronous operation used by components at render time.
 * If no saved settings exist, returns sensible defaults.
 * This is a **fallback** — the real source of truth for visibility
 * is the backend API (loaded asynchronously on mount).
 */
export function loadSettings(): SettingsData {
  try {
    const raw = localStorage.getItem("flightLogbookSettings");
    if (raw) {
      const parsed = JSON.parse(raw);
      const columnVisibility: ColumnVisibility = {
        ...DEFAULT_COLUMN_VISIBILITY,
        ...parsed.columnVisibility,
      };
      const recentFlightsColumns: RecentFlightsColumns = withVisibleTimeCategoriesOnly(
        {
          ...DEFAULT_RECENT_FLIGHTS_COLUMNS,
          ...parsed.recentFlightsColumns,
        },
        columnVisibility,
      );
      return {
        pageVisibility: { ...DEFAULT_PAGE_VISIBILITY, ...parsed.pageVisibility },
        columnVisibility,
        recentFlightsColumns,
        dashboardSections: {
          ...DEFAULT_DASHBOARD_SECTIONS,
          ...parsed.dashboardSections,
        },
        username: parsed.username ?? "",
        pageSize: parsed.pageSize ?? DEFAULT_PAGE_SIZE,
        showLoginPage: parsed.showLoginPage ?? true,
      };
    }
  } catch {
    // Corrupted localStorage — ignore and return defaults
  }
  return {
    pageVisibility: { ...DEFAULT_PAGE_VISIBILITY },
    columnVisibility: { ...DEFAULT_COLUMN_VISIBILITY },
    recentFlightsColumns: { ...DEFAULT_RECENT_FLIGHTS_COLUMNS },
    dashboardSections: { ...DEFAULT_DASHBOARD_SECTIONS },
    username: "",
    pageSize: DEFAULT_PAGE_SIZE,
    showLoginPage: true,
  };
}

/**
 * Save the full settings object to localStorage and broadcast a
 * ``settingsUpdated`` custom event so all open tabs/components
 * that listen for it (App.tsx, Logbook, EntryForm, Settings) pick
 * up the change immediately.
 */
export function saveSettings(settings: SettingsData): void {
  localStorage.setItem("flightLogbookSettings", JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: settings }));
}

/**
 * Save only page + column visibility to localStorage and broadcast.
 * This is a convenience wrapper around ``saveSettings`` that preserves
 * all other settings fields.
 */
export function saveVisibilityLocal(
  pageVisibility: PageVisibility,
  columnVisibility: ColumnVisibility,
): void {
  const current = loadSettings();
  current.pageVisibility = pageVisibility;
  current.columnVisibility = columnVisibility;
  localStorage.setItem("flightLogbookSettings", JSON.stringify(current));
  window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: current }));
}

// ═════════════════════════════════════════════════
// Async API-backed visibility helpers
// ═════════════════════════════════════════════════

/**
 * Load visibility settings from the backend API.
 *
 * Falls back to localStorage if the API call fails (e.g. backend
 * not running, or the user's session expired).
 * Also **syncs** the result into localStorage and fires a
 * ``settingsUpdated`` event so that App.tsx, Logbook, EntryForm,
 * and Settings all receive the update without needing a page reload.
 *
 * This is called by App.tsx and Settings.tsx on mount.
 */
export async function loadVisibilityFromApi(): Promise<{
  pageVisibility: PageVisibility;
  columnVisibility: ColumnVisibility;
}> {
  try {
    const res = await api.getVisibility();
    const pageVisibility: PageVisibility = {
      ...DEFAULT_PAGE_VISIBILITY,
      ...JSON.parse(res.pageVisibility || "{}"),
    };
    const columnVisibility: ColumnVisibility = {
      ...DEFAULT_COLUMN_VISIBILITY,
      ...JSON.parse(res.columnVisibility || "{}"),
    };
    // Sync into localStorage so synchronous loadSettings() also sees the API data
    syncVisibilityToLocal(pageVisibility, columnVisibility);
    return { pageVisibility, columnVisibility };
  } catch {
    // Fall back to localStorage if API call fails
    const local = loadSettings();
    return {
      pageVisibility: local.pageVisibility,
      columnVisibility: local.columnVisibility,
    };
  }
}

/**
 * Write page + column visibility into localStorage and dispatch
 * a ``settingsUpdated`` event so all listeners pick up the change.
 */
function syncVisibilityToLocal(
  pageVisibility: PageVisibility,
  columnVisibility: ColumnVisibility,
): void {
  const current = loadSettings();
  current.pageVisibility = pageVisibility;
  current.columnVisibility = columnVisibility;
  // A time category that is now hidden must not stay enabled on the
  // Recent Flights tile, otherwise it would silently render on the Dashboard.
  current.recentFlightsColumns = withVisibleTimeCategoriesOnly(
    current.recentFlightsColumns,
    columnVisibility,
  );
  localStorage.setItem("flightLogbookSettings", JSON.stringify(current));
  window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: current }));
}

/**
 * Save page and column visibility to **both** the backend API and
 * localStorage.
 *
 * The localStorage save is synchronous (instant UI reactivity).
 * The API call is async and fire-and-forget — if it fails, the
 * local data is still correct and will be synced on next ``loadVisibilityFromApi()``.
 */
export async function saveVisibilityToApi(
  pageVisibility: PageVisibility,
  columnVisibility: ColumnVisibility,
): Promise<void> {
  // Always save to localStorage first (instant reactivity + event dispatch)
  syncVisibilityToLocal(pageVisibility, columnVisibility);

  // Then try to persist to the backend API
  const { page_visibility, column_visibility } = serializeVisibility(pageVisibility, columnVisibility);
  try {
    await api.saveVisibility(page_visibility, column_visibility);
  } catch {
    console.warn("Failed to save visibility to backend, localStorage fallback is in use");
  }
}

// ═════════════════════════════════════════════════
// Recent Flights tile column helpers
// ═════════════════════════════════════════════════

/**
 * Load Recent Flights tile column preferences from the backend API,
 * falling back to localStorage if the API call fails. Syncs the result
 * into localStorage so synchronous `loadSettings()` sees the data.
 */
export async function loadRecentFlightsColumnsFromApi(): Promise<RecentFlightsColumns> {
  try {
    const res = await api.getRecentFlightsColumns();
    const base: RecentFlightsColumns = {
      ...DEFAULT_RECENT_FLIGHTS_COLUMNS,
      ...(res.columns ?? {}),
    };
    const visibility = loadSettings().columnVisibility;
    const columns = withVisibleTimeCategoriesOnly(base, visibility);
    const current = loadSettings();
    current.recentFlightsColumns = columns;
    localStorage.setItem("flightLogbookSettings", JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: current }));
    return columns;
  } catch {
    return loadSettings().recentFlightsColumns;
  }
}

/**
 * Save Recent Flights tile column preferences to **both** the backend
 * API and localStorage.
 */
export async function saveRecentFlightsColumnsToApi(columns: RecentFlightsColumns): Promise<void> {
  const current = loadSettings();
  current.recentFlightsColumns = columns;
  localStorage.setItem("flightLogbookSettings", JSON.stringify(current));
  window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: current }));

  try {
    await api.saveRecentFlightsColumns(columns);
  } catch {
    console.warn("Failed to save recent flights columns to backend, localStorage fallback is in use");
  }
}

// ═════════════════════════════════════════════════
// Dashboard section visibility helpers
// ═════════════════════════════════════════════════

/**
 * Load Dashboard section visibility preferences from the backend API,
 * falling back to localStorage if the API call fails. Syncs the result
 * into localStorage so synchronous `loadSettings()` sees the data.
 */
export async function loadDashboardSectionsFromApi(): Promise<DashboardSections> {
  try {
    const res = await api.getDashboardSections();
    const sections: DashboardSections = {
      ...DEFAULT_DASHBOARD_SECTIONS,
      ...(res.sections ?? {}),
    };
    const current = loadSettings();
    current.dashboardSections = sections;
    localStorage.setItem("flightLogbookSettings", JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: current }));
    return sections;
  } catch {
    return loadSettings().dashboardSections;
  }
}

/**
 * Save Dashboard section visibility preferences to **both** the backend
 * API and localStorage.
 */
export async function saveDashboardSectionsToApi(sections: DashboardSections): Promise<void> {
  const current = loadSettings();
  current.dashboardSections = sections;
  localStorage.setItem("flightLogbookSettings", JSON.stringify(current));
  window.dispatchEvent(new CustomEvent("settingsUpdated", { detail: current }));

  try {
    await api.saveDashboardSections(sections);
  } catch {
    console.warn("Failed to save dashboard sections to backend, localStorage fallback is in use");
  }
}

/** Pages that are always visible in the navigation and cannot be hidden. */
export const CORE_PAGES = ["dashboard", "logbook", "add", "settings"] as const;

/** Optional pages that users can toggle on/off via Settings. */
export const OPTIONAL_PAGES = ["currency", "FAA 8710"] as const;

// ═════════════════════════════════════════════════
// Column ↔ Form field name mapping
// ═════════════════════════════════════════════════

/** Maps ColumnVisibility keys (camelCase) to EntryForm field names (snake_case).
 *  Used by EntryForm to conditionally hide fields based on visibility settings. */
export const COLUMN_TO_FORM_FIELD: Record<string, string> = {
  date: "date",
  pilotInCommand: "pilot_in_command",
  aircraftType: "aircraft_type",
  aircraftReg: "aircraft_reg",
  departure: "departure",
  arrival: "arrival",
  departureTime: "departure_time",
  arrivalTime: "arrival_time",
  totalTime: "total_time",
  selTime: "sel_time",
  sesTime: "ses_time",
  melTime: "mel_time",
  mesTime: "mes_time",
  helicopterTime: "helicopter_time",
  gyroplaneTime: "gyroplane_time",
  poweredLiftTime: "powered_lift_time",
  gliderTime: "glider_time",
  balloonTime: "balloon_time",
  airshipTime: "airship_time",
  soloTime: "solo_time",
  picTime: "pic_time",
  sicTime: "sic_time",
  dualTime: "dual_time",
  instructorTime: "instructor_time",
  xcountryTime: "xcountry_time",
  nightTime: "night_time",
  actInstrumentTime: "act_instrument_time",
  simInstrumentTime: "sim_instrument_time",
  fullFlightSimulatorTime: "full_flight_simulator_time",
  flightTrainingDeviceTime: "flight_training_device_time",
  aviationTrainingDeviceTime: "aviation_training_device_time",
  takeoffsDay: "takeoffs_day",
  takeoffsNight: "takeoffs_night",
  landingsDay: "landings_day",
  landingsNight: "landings_night",
  precisionApproaches: "precision_approaches",
  nonPrecisionApproaches: "non_precision_approaches",
  holdingPatterns: "holding_patterns",
  launchType: "launch_type",
  remarks: "remarks",
};

/** Set of ColumnVisibility keys whose corresponding form fields are in
 *  the 2-column grid section of EntryForm. Used to decide whether
 *  a field should be wrapped in a grid cell. */
export const FORM_GRID_FIELDS = new Set([
  "date", "pilotInCommand", "aircraftType", "aircraftReg", "departure", "arrival",
  "departureTime", "arrivalTime", "totalTime", "selTime", "sesTime",
  "melTime", "mesTime", "helicopterTime", "gyroplaneTime", "poweredLiftTime",
  "gliderTime", "balloonTime", "airshipTime",
  "soloTime",
  "picTime", "sicTime", "dualTime", "instructorTime", "xcountryTime",
  "nightTime", "actInstrumentTime", "simInstrumentTime", "fullFlightSimulatorTime",
  "flightTrainingDeviceTime", "aviationTrainingDeviceTime",
 "takeoffsDay", "takeoffsNight", "landingsDay", "landingsNight",
  "precisionApproaches", "nonPrecisionApproaches", "holdingPatterns", 
  "launchType",
]);
