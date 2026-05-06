import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

import type { Driver } from "@/types";
import { CHECKPOINTS } from "@/data";
import Toast from "@/components/Toast";
import TimePicker from "@/components/RaceClock";
import type { FilterTypes } from "@/state/types";
import useDriverList from "@/hooks/useDriverList";
import { useConfigStartPointMutation } from "@/state/rhinoApi";

const d = new Date();

function cpCount(car: Driver): number {
  return car.checkpoints?.filter((cp) => cp.time).length ?? 0;
}

function CpColumnHeader({ cp }: { cp: string }) {
  return (
    <th className="text-center py-3 px-1" style={{ minWidth: 64 }}>
      <div
        className="text-[9px] font-black tracking-[0.15em] uppercase leading-none"
        style={{
          fontFamily: "'Oswald', sans-serif",
          color: "white",
        }}
      >
        {cp}
      </div>
    </th>
  );
}

function CpCell({
  isSelected,
  onSelect,
}: {
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <td className="text-center px-1 py-2">
      <div className="flex items-center justify-center">
        <label className="cursor-pointer relative flex items-center justify-center w-6 h-6">
          <input
            type="radio"
            checked={isSelected}
            onChange={() => onSelect()}
            className="sr-only"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center"
            style={{
              borderColor: isSelected ? "#38bdf8" : "rgba(28,25,23,0.7)",
              background: isSelected ? "rgba(28,25,23,0.7)" : "transparent",
            }}
          >
            {isSelected && (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#38bdf8" }}
              />
            )}
          </div>
        </label>
      </div>
    </td>
  );
}

function CarRow({
  car,
  isExpanded,
  selectedCp,
  onSelectCp,
}: {
  car: Driver;
  isExpanded: boolean;
  onToggle: () => void;
  selectedCp: string;
  onSelectCp: (cp: string) => void;
}) {
  return (
    <>
      <tr
        className="border-b transition-colors cursor-pointer group"
        style={{
          borderColor: "rgba(255,255,255,0.04)",
          background: isExpanded ? "rgba(217,119,6,0.06)" : "transparent",
        }}
      >
        {/* Car number */}
        <td className="pr-2 py-3 w-14">
          <div
            className="text-xs font-black px-2 py-1 rounded-md text-center tracking-widest"
            style={{
              fontFamily: "'Oswald', sans-serif",
              background: "rgba(217,119,6,0.12)",
              color: "#D97706",
              border: "1px solid rgba(217,119,6,0.25)",
            }}
          >
            {car.carNo}
          </div>
        </td>

        {/* Driver name + team */}
        <td className="py-3 pr-4" style={{ minWidth: 160 }}>
          <div
            className="text-sm font-bold leading-tight truncate"
            style={{
              color: "rgba(28,25,23,0.7)",
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            {car.entrantName}
          </div>
          <div
            className="text-[10px] uppercase tracking-wider truncate mt-0.5"
            style={{ color: "#78716c" }}
          >
            {car.team_name}
          </div>
        </td>

        {/* CP cells — one per checkpoint */}
        {CHECKPOINTS.map((cp) => (
          <CpCell
            key={cp}
            isSelected={selectedCp === cp}
            onSelect={() => onSelectCp(selectedCp === cp ? "" : cp)}
          />
        ))}
      </tr>
    </>
  );
}

const FilterBtn = ({
  value,
  label,
  setFilter,
  filter,
}: {
  value: typeof filter;
  label: string;
  filter: string;
  setFilter: React.Dispatch<FilterTypes>;
}) => (
  <button
    onClick={() => setFilter(value as FilterTypes)}
    className="px-3 py-2 rounded-lg text-[10px] font-bold tracking-[0.15em] uppercase transition-all"
    style={{
      fontFamily: "'Oswald', sans-serif",
      background: filter === value ? "#FBF9E7" : "rgba(28,25,23,0.7)",
      border: `1px solid ${filter === value ? "rgba(217,119,6,0.4)" : "rgba(255,255,255,0.06)"}`,
      color: filter === value ? "rgba(28,25,23,0.7)" : "#FCFCFC",
    }}
  >
    {label}
  </button>
);

export default function AdminPage() {
  const { data, LoadingVehicleList, LoadingCheckPoints } = useDriverList();
  const [configStartPoint, { isLoading: LoadingCreateStart }] =
    useConfigStartPointMutation();
  const isLoading =
    LoadingVehicleList || LoadingCheckPoints || LoadingCreateStart;

  const [time, setTime] = useState(`${d.getHours()}:${d.getMinutes()}`);

  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTypes>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<number, string>>({});

  // console.log(selectioatans");, "selections");
  // console.log(data, "d

  const payload = useMemo(() => {
    const checkpoints = Object.entries(selections ?? {}).map(
      ([key, value]) => ({
        column_id: 1,
        column_value: value,
        asset_id: key,
      }),
    );

    if (checkpoints.length === 0 && !time) return [];

    return [...checkpoints, { column_id: 2, column_value: time }];
  }, [selections, time]);

  // console.log(payload, "payload");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...data]
      .sort((a, b) => b.totalCps - a.totalCps)
      .filter((car) => {
        const matchQ =
          !q ||
          car.carNo?.toString().includes(q) ||
          car.entrantName?.toLowerCase().includes(q) ||
          car.team_name?.toLowerCase().includes(q);
        const n = cpCount(car);
        const matchF =
          filter === "all" ||
          (filter === "partial" && n > 0 && n < CHECKPOINTS.length) ||
          (filter === "none" && n === 0);
        return matchQ && matchF;
      });
  }, [data, search, filter]);

  const handleSaveStart = async () => {
    try {
      await configStartPoint(payload).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap');
        
        @keyframes tread-scroll { 0% { background-position: 0 0; } 100% { background-position: 72px 0; } }
        .tread-bar {
          position: fixed; left: 0; right: 0; height: 6px; z-index: 10; pointer-events: none;
          background-image: repeating-linear-gradient(90deg,#D97706 0,#D97706 18px,#b45309 18px,#b45309 22px,transparent 22px,transparent 30px,#92400e 30px,#92400e 34px,transparent 34px,transparent 36px,#D97706 36px,#D97706 54px,transparent 54px,transparent 72px);
          animation: tread-scroll 2.4s linear infinite; opacity: 0.5;
        }
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
        input[type="number"]::-webkit-inner-spin-button { filter: invert(0.4); }
        select option { background: #1C1917; color: #e7e5e4; }
        /* Sticky column shadows */
        .sticky-col { position: sticky; left: 0; z-index: 2; background: #1C1917; }
        .sticky-col-2 { position: sticky; left: 32px; z-index: 2; background: #1C1917; }
        .sticky-col-3 { position: sticky; left: 80px; z-index: 2; background: #1C1917; }
      `}</style>

      <div
        className="min-h-screen text-stone-100 pt-8 pb-16 px-4"
        style={{
          background: "#fff",
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(217,119,6,0.018) 39px,rgba(217,119,6,0.018) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(217,119,6,0.018) 39px,rgba(217,119,6,0.018) 40px)",
        }}
      >
        <div className="max-w-[1400px] flex flex-col mx-auto">
          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-black leading-none mb-1"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: "0.04em",
                  color: "#716969",
                }}
              >
                Rhino Charge 2026
              </h1>
              <p
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{ color: "#57534e" }}
              >
                Admin · Checkpoint Control
              </p>
            </div>
            <TimePicker
              value={time}
              onChange={(selectedTime) => setTime(selectedTime)}
            />
          </div>

          {/* ── Search + Filters ── */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-48">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                viewBox="0 0 16 16"
                fill="none"
                style={{ color: "#57534e" }}
              >
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="4.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M10 10l3 3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by car no. or driver…"
                className="w-full pl-9 pr-4 py-2 rounded-lg text-lg outline-none"
                style={{
                  background: "#FBF9E7",
                  border: "1px solid rgba(217,119,6,0.4)",
                  color: "#000",
                  fontFamily: "'Oswald', sans-serif",
                }}
              />
            </div>
            <FilterBtn
              value="all"
              label="All"
              filter={filter}
              setFilter={setFilter}
            />
            <FilterBtn
              value="partial"
              label="In Progress"
              filter={filter}
              setFilter={setFilter}
            />
            <FilterBtn
              value="none"
              label="Not Started"
              filter={filter}
              setFilter={setFilter}
            />
          </div>

          {/* ── Table ── */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "#FBF9E7",
              backdropFilter: "blur(20px)",
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <div
                  className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{
                    borderColor: "rgba(217,119,6,0.4)",
                    borderTopColor: "#D97706",
                  }}
                />
              </div>
            ) : (
              <div style={{ overflowX: "auto", height: "72vh" }}>
                <table
                  className="w-full border-collapse"
                  style={{ minWidth: 900 }}
                >
                  <thead>
                    <tr
                      className="border-b"
                      style={{
                        borderColor: "rgba(255,255,255,0.06)",
                        background: "rgba(0,0,0,0.3)",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        color: "white",
                      }}
                    >
                      {/* <th className="w-8 pl-4 pr-2 py-3" /> */}
                      <th className="pr-2 py-3 pl-4 w-14 text-left">
                        <span
                          className="text-[9px] tracking-[0.2em] uppercase"
                          style={{
                            color: "white",
                            fontFamily: "'Oswald', sans-serif",
                          }}
                        >
                          Car
                        </span>
                      </th>
                      <th
                        className="py-3 pr-4 text-left"
                        style={{ minWidth: 160 }}
                      >
                        <span
                          className="text-[9px] font-black tracking-[0.2em] uppercase"
                          style={{
                            color: "white",
                            fontFamily: "'Oswald', sans-serif",
                          }}
                        >
                          Driver / Team
                        </span>
                      </th>

                      {/* Checkpoint columns */}
                      {CHECKPOINTS.map((cp) => (
                        <CpColumnHeader key={cp} cp={cp} />
                      ))}

                      <th className="pr-4 py-3 w-20" />
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {filtered.map((car) => (
                        <CarRow
                          key={car.asset_id}
                          car={car}
                          isExpanded={expanded === car.asset_id}
                          onToggle={() =>
                            setExpanded((prev) =>
                              prev === car.asset_id ? null : car.asset_id,
                            )
                          }
                          // onLog={(carId, cp) => handleLog(carId, cp)}
                          selectedCp={selections[car.asset_id] ?? ""}
                          onSelectCp={(cp) =>
                            setSelections((prev) => ({
                              ...prev,
                              [car?.asset_id]: cp,
                            }))
                          }
                        />
                      ))}
                    </AnimatePresence>

                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={4 + CHECKPOINTS.length + 1}
                          className="text-center py-16"
                        >
                          <span
                            className="text-sm tracking-widest uppercase"
                            style={{
                              color: "#57534e",
                              fontFamily: "'Oswald', sans-serif",
                            }}
                          >
                            No entrants match your filters
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: "#292524" }} />
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{ color: "#44403c", fontFamily: "'Oswald', sans-serif" }}
            >
              {CHECKPOINTS.length + 1} Checkpoints · {data.length} Entrants
            </span>
            <div className="h-px flex-1" style={{ background: "#292524" }} />
          </div>
          {/* <button className="ml-auto shrink-0">Hello world</button> */}
          <button
            onClick={handleSaveStart}
            disabled={payload.length - 1 !== data.length || isLoading}
            className="px-3 py-2 rounded-lg text-[10px] ml-auto shrink-0 font-bold tracking-[0.15em] uppercase transition-all disabled:cursor-not-allowed cursor-pointer"
            style={{
              fontFamily: "'Oswald', sans-serif",
              background:
                payload.length - 1 !== data.length
                  ? "#FBF9E7"
                  : "rgba(28,25,23,0.7)",
              border: `1px solid ${payload.length - 1 !== data.length || isLoading ? "rgba(217,119,6,0.4)" : "rgba(255,255,255,0.06)"}`,
              color:
                payload.length - 1 !== data.length || isLoading
                  ? "rgba(28,25,23,0.7)"
                  : "#FCFCFC",
            }}
          >
            Save start entries
          </button>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <Toast key={toast} message={toast} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
