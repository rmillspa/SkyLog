/**
 * SkyLog Client-Side Router
 *
 * A minimal URL/history integration layer that maps the app's six top-level
 * "pages" (plus the optional "editing a flight" state) to browser URLs.
 *
 * Before this module existed, page changes lived only in React state, so the
 * browser's Back/Forward buttons had no history entries to traverse. Keeping
 * ``window.location`` in sync with ``currentPage`` via pushState and listening
 * for ``popstate`` makes the standard browser navigation controls work — and
 * also gives deep links and refresh-on-page for free.
 *
 * URL scheme:
 *   /                 → dashboard
 *   /logbook          → logbook
 *   /currency         → currency
 *   /faa8710          → FAA 8710
 *   /settings         → settings
 *   /log/new          → add (create new flight)
 *   /log/:id/edit     → add (edit existing flight)
 *
 * The Go backend serves index.html for any non-API path (see
 * withStaticFallback in backend-go/main.go), and Vite's dev server does the
 * same, so these paths work in both development and production with no extra
 * configuration.
 *
 * @module router
 */

/** The set of top-level pages the user can navigate to. */
export type Page = "dashboard" | "logbook" | "currency" | "FAA8710" | "settings" | "add";

/** The parsed contents of the current URL. */
export interface Route {
  page: Page;
  /** When on the "add" page, the id of the flight being edited (null = new flight). */
  editFlightId: number | null;
  /** Whether the URL matched a known route (vs. a garbage/unrecognised path). */
  isKnown: boolean;
}

/** Map from URL root segment to page key. */
const SEGMENT_TO_PAGE: Record<string, Page> = {
  dashboard: "dashboard",
  logbook: "logbook",
  currency: "currency",
  faa8710: "FAA8710",
  settings: "settings",
};

/**
 * Parse `window.location.pathname` into the route it represents.
 * Unknown paths fall back to the dashboard with ``isKnown === false``.
 */
export function parsePath(): Route {
  const segments = window.location.pathname.split("/").filter(Boolean);

  // Root path → dashboard
  if (segments.length === 0) {
    return { page: "dashboard", editFlightId: null, isKnown: true };
  }

  // /log/new and /log/:id/edit → add page
  if (segments[0] === "log") {
    if (segments.length === 2 && segments[1] === "new") {
      return { page: "add", editFlightId: null, isKnown: true };
    }
    if (segments.length === 3 && segments[2] === "edit") {
      const id = Number(segments[1]);
      if (Number.isInteger(id) && id > 0) {
        return { page: "add", editFlightId: id, isKnown: true };
      }
    }
    return { page: "dashboard", editFlightId: null, isKnown: false };
  }

  const page = SEGMENT_TO_PAGE[segments[0]];
  if (page) {
    return { page, editFlightId: null, isKnown: true };
  }

  return { page: "dashboard", editFlightId: null, isKnown: false };
}

/**
 * Build the canonical URL for a page + optional edit-flight id.
 * Used with history.pushState/replaceState to keep the address bar in sync.
 */
export function pageToPath(page: Page, editFlightId: number | null = null): string {
  switch (page) {
    case "dashboard":
      return "/";
    case "logbook":
      return "/logbook";
    case "currency":
      return "/currency";
    case "FAA8710":
      return "/faa8710";
    case "settings":
      return "/settings";
    case "add":
      return editFlightId != null ? `/log/${editFlightId}/edit` : "/log/new";
  }
}
