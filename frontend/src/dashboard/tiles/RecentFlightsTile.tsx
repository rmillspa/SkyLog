/**
 * RecentFlightsTile — displays the 5 most recent flight entries in a compact table.
 *
 * This tile spans 2 columns by default.
 *
 * Which columns appear is configurable in Settings → Recent Flights Columns.
 * Every data column presented on the Logbook page can be toggled on/off.
 * When no `columns` prop is supplied (e.g. older callers), the default
 * compact set is shown.
 *
 * @module dashboard/tiles/RecentFlightsTile
 */

import type { Flight } from "../../api/types";
import type { RecentFlightsColumns } from "../../api/settings";
import { DEFAULT_RECENT_FLIGHTS_COLUMNS } from "../../api/settings";

interface RecentFlightsTileProps {
  flights: Flight[];
  /** Which columns to display. Defaults to the default compact set. */
  columns?: RecentFlightsColumns;
}

/** Static column metadata for the tile. */
interface ColumnDef {
  key: keyof RecentFlightsColumns;
  header: string;
  render: (flight: Flight) => React.ReactNode;
}

const LAUNCH_TYPE_LABELS: Record<string, string> = {
  "aero_tow": "Aero-Tow",
  "ground_launch": "Ground Launch",
  "powered_launch": "Powered Launch",
};

const COLUMN_DEFS: ColumnDef[] = [
  { key: "date", header: "Date", render: (f) => f.date },
  { key: "pilotInCommand", header: "Pilot", render: (f) => f.pilot_in_command },
  { key: "aircraftType", header: "Aircraft", render: (f) => f.aircraft_type },
  { key: "aircraftReg", header: "Reg.", render: (f) => f.aircraft_reg },
  { key: "departure", header: "From", render: (f) => f.departure },
  { key: "arrival", header: "To", render: (f) => f.arrival },
  { key: "totalTime", header: "Total", render: (f) => f.total_time.toFixed(1) },
  { key: "selTime", header: "SEL", render: (f) => f.sel_time.toFixed(1) },
  { key: "sesTime", header: "SES", render: (f) => f.ses_time.toFixed(1) },
  { key: "melTime", header: "MEL", render: (f) => f.mel_time.toFixed(1) },
  { key: "mesTime", header: "MES", render: (f) => f.mes_time.toFixed(1) },
  { key: "helicopterTime", header: "Helicopter", render: (f) => f.helicopter_time.toFixed(1) },
  { key: "gyroplaneTime", header: "Gyroplane", render: (f) => f.gyroplane_time.toFixed(1) },
  { key: "poweredLiftTime", header: "Pwr Lift", render: (f) => f.powered_lift_time.toFixed(1) },
  { key: "gliderTime", header: "Glider", render: (f) => f.glider_time.toFixed(1) },
  { key: "balloonTime", header: "Balloon", render: (f) => f.balloon_time.toFixed(1) },
  { key: "airshipTime", header: "Airship", render: (f) => f.airship_time.toFixed(1) },
  { key: "soloTime", header: "Solo", render: (f) => f.solo_time.toFixed(1) },
  { key: "picTime", header: "PIC", render: (f) => f.pic_time.toFixed(1) },
  { key: "sicTime", header: "SIC", render: (f) => f.sic_time.toFixed(1) },
  { key: "dualTime", header: "Dual", render: (f) => f.dual_time.toFixed(1) },
  { key: "instructorTime", header: "Instructor", render: (f) => f.instructor_time.toFixed(1) },
  { key: "xcountryTime", header: "X-Country", render: (f) => f.xcountry_time.toFixed(1) },
  { key: "nightTime", header: "Night", render: (f) => f.night_time.toFixed(1) },
  { key: "actInstrumentTime", header: "Act Instr", render: (f) => f.act_instrument_time.toFixed(1) },
  { key: "simInstrumentTime", header: "Sim Instr", render: (f) => f.sim_instrument_time.toFixed(1) },
  { key: "fullFlightSimulatorTime", header: "FFS", render: (f) => f.full_flight_simulator_time.toFixed(1) },
  { key: "flightTrainingDeviceTime", header: "FTD", render: (f) => f.flight_training_device_time.toFixed(1) },
  { key: "aviationTrainingDeviceTime", header: "ATD", render: (f) => f.aviation_training_device_time.toFixed(1) },
  { key: "takeoffsDay", header: "Day TO", render: (f) => f.takeoffs_day },
  { key: "takeoffsNight", header: "Night TO", render: (f) => f.takeoffs_night },
  { key: "landingsDay", header: "Day Ldg", render: (f) => f.landings_day },
  { key: "landingsNight", header: "Night Ldg", render: (f) => f.landings_night },
  { key: "precisionApproaches", header: "Precision", render: (f) => f.precision_approaches },
  { key: "nonPrecisionApproaches", header: "Non-Prec", render: (f) => f.non_precision_approaches },
  { key: "holdingPatterns", header: "Holding", render: (f) => f.holding_patterns },
  {
    key: "launchType",
    header: "Launch Type",
    render: (f) => (f.launch_type ? LAUNCH_TYPE_LABELS[f.launch_type] || f.launch_type : ""),
  },
  { key: "remarks", header: "Remarks", render: (f) => f.remarks },
];

export function RecentFlightsTile({ flights, columns }: RecentFlightsTileProps) {
  const activeColumns = COLUMN_DEFS.filter(
    (col) => columns?.[col.key] ?? DEFAULT_RECENT_FLIGHTS_COLUMNS[col.key],
  );

  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center dark:bg-zinc-900 dark:border-zinc-400 animate-slide-up">
        <p className="text-gray-500 dark:text-gray-400">No recent flights to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-slide-up dark:bg-zinc-900 dark:border-zinc-400">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Flights</h2>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "logbook" }))}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-800">
              {activeColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-600 dark:text-white whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, idx) => (
              <tr
                key={flight.id}
                className="border-b border-gray-50 hover:bg-gray-50 logbook-row dark:border-zinc-400 dark:hover:bg-zinc-700"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {activeColumns.map((col) => (
                  <td
                    key={col.key}
                    className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {col.render(flight)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
