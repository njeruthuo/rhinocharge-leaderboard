import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Driver } from "@/types";
import useDriverList from "@/hooks/useDriverList";
import { CHECKPOINTS } from "@/data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

function cpCount(car: Driver): number {
  return car.checkpoints?.filter((cp) => cp.time).length ?? 0;
}

// ─── Log Modal ────────────────────────────────────────────────────────────────

function LogModal({
  car,
  checkpoint,
  onConfirm,
  onCancel,
}: {
  car: Driver;
  checkpoint: string;
  onConfirm: (time: string, odometer: string) => void;
  onCancel: () => void;
}) {
  const [time, setTime] = useState(getDefaultTime());
  const [odometer, setOdometer] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border p-6"
        style={{
          background: "#1C1917",
          borderColor: "rgba(217,119,6,0.4)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="text-[9px] font-black tracking-[0.25em] uppercase mb-1"
          style={{ color: "#D97706", fontFamily: "'Oswald', sans-serif" }}
        >
          Log Checkpoint
        </div>
        <div
          className="text-xl font-black mb-1"
          style={{
            color: "#f5f5f4",
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          {checkpoint}
        </div>
        <div
          className="text-[11px] uppercase tracking-wider mb-5 pb-4 border-b"
          style={{ color: "#78716c", borderColor: "rgba(255,255,255,0.06)" }}
        >
          Car {car.carNo} · {car.entrantName}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[9px] uppercase tracking-[0.2em]"
              style={{ color: "#57534e", fontFamily: "'Oswald', sans-serif" }}
            >
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-lg px-3 py-2.5 text-sm outline-none w-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e7e5e4",
                fontFamily: "'Oswald', sans-serif",
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[9px] uppercase tracking-[0.2em]"
              style={{ color: "#57534e", fontFamily: "'Oswald', sans-serif" }}
            >
              Odometer (km) — optional
            </label>
            <input
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              placeholder="e.g. 142"
              min={0}
              className="rounded-lg px-3 py-2.5 text-sm outline-none w-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e7e5e4",
                fontFamily: "'Oswald', sans-serif",
              }}
            />
          </div>

          <div className="flex gap-2 mt-1">
            <button
              onClick={onCancel}
              className="flex-1 rounded-lg px-4 py-2.5 text-xs font-black tracking-widest uppercase transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#78716c",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(time, odometer)}
              disabled={!time}
              className="flex-1 rounded-lg px-4 py-2.5 text-xs font-black tracking-widest uppercase transition-all disabled:opacity-40"
              style={{
                background: "rgba(217,119,6,0.2)",
                border: "1px solid rgba(217,119,6,0.5)",
                color: "#D97706",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      onAnimationComplete={() => setTimeout(onDone, 2800)}
      className="fixed bottom-6 right-4 z-50 flex items-center gap-3 rounded-xl px-4 py-3 border text-xs font-bold tracking-wider"
      style={{
        background: "#1C1917",
        borderColor: "rgba(74,222,128,0.4)",
        color: "#4ade80",
        fontFamily: "'Oswald', sans-serif",
        letterSpacing: "0.05em",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "#4ade80" }}
      />
      {message}
    </motion.div>
  );
}

// ─── CP Column Header ─────────────────────────────────────────────────────────

function CpColumnHeader({ cp }: { cp: string }) {
  const isFinish = cp === "FINISH";
  return (
    <th className="text-center py-3 px-1" style={{ minWidth: 64 }}>
      <div
        className="text-[8px] font-black tracking-[0.15em] uppercase leading-none"
        style={{
          fontFamily: "'Oswald', sans-serif",
          color: isFinish ? "#4ade80" : "#57534e",
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
            onChange={onSelect}
            className="sr-only"
          />
          <div
            onClick={onSelect}
            className="w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center"
            style={{
              borderColor: isSelected ? "#38bdf8" : "rgba(255,255,255,0.12)",
              background: isSelected ? "rgba(56,189,248,0.15)" : "transparent",
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

// ─── Car Row ──────────────────────────────────────────────────────────────────

function CarRow({
  car,
  isExpanded,
  selectedCp,
  onSelectCp,
}: {
  car: Driver;
  isExpanded: boolean;
  onToggle: () => void;
  onLog: (carId: number, cp: string, time: string, odometer: string) => void;
  selectedCp: string;
  onSelectCp: (cp: string) => void;
}) {
  const n = cpCount(car);
  const cpMap = useMemo(() => {
    const map: Record<string, { time: string; odometer: string }> = {};
    car.checkpoints?.forEach((cp) => {
      if (cp.time)
        map[cp.point] = { time: cp.time, odometer: cp.odometer ?? "" };
    });
    return map;
  }, [car.checkpoints]);

  return (
    <>
      <tr
        className="border-b transition-colors cursor-pointer group"
        style={{
          borderColor: "rgba(255,255,255,0.04)",
          background: isExpanded ? "rgba(217,119,6,0.06)" : "transparent",
        }}
        // onClick={onToggle}
      >
        {/* Rank / expand indicator */}
        <td className="pl-4 pr-2 py-3 w-8">
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: "#57534e" }}
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M4 3l4 3-4 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </td>

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
              color: "#f5f5f4",
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            {car.entrantName}
          </div>
          <div
            className="text-[9px] uppercase tracking-wider truncate mt-0.5"
            style={{ color: "#78716c" }}
          >
            {car.team_name}
          </div>
        </td>

        {/* CP cells — one per checkpoint */}
        {CHECKPOINTS.map((cp) => (
          <CpCell
            key={cp}
            cp={cp}
            logged={cpMap[cp]}
            isSelected={selectedCp === cp}
            onSelect={(e) => {
              e?.stopPropagation?.();
              onSelectCp(selectedCp === cp ? "" : cp);
            }}
          />
        ))}
      </tr>

      {/* Expanded detail row */}
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={4 + CHECKPOINTS.length + 1}>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div
                  className="mx-4 my-2 rounded-xl p-4 border grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
                  style={{
                    background: "rgba(12,10,9,0.6)",
                    borderColor: "rgba(217,119,6,0.15)",
                  }}
                >
                  {CHECKPOINTS.map((cp) => {
                    const logged = cpMap[cp];
                    return (
                      <div
                        key={cp}
                        className="rounded-lg p-2.5 border"
                        style={{
                          background: logged
                            ? "rgba(217,119,6,0.1)"
                            : "rgba(255,255,255,0.02)",
                          borderColor: logged
                            ? "rgba(217,119,6,0.35)"
                            : "rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          className="text-[8px] font-black tracking-[0.15em] uppercase mb-1"
                          style={{
                            color: logged ? "#fbbf24" : "#44403c",
                            fontFamily: "'Oswald', sans-serif",
                          }}
                        >
                          {cp}
                        </div>
                        {logged ? (
                          <>
                            <div
                              className="text-[11px] font-bold"
                              style={{ color: "#fbbf24" }}
                            >
                              {logged.time}
                            </div>
                            {logged.odometer && (
                              <div
                                className="text-[8px] font-mono mt-0.5"
                                style={{ color: "#78716c" }}
                              >
                                {logged.odometer} km
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="text-[10px]"
                            style={{ color: "#3c3836" }}
                          >
                            —
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { data, LoadingVehicleList, LoadingCheckPoints } = useDriverList();

  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "partial" | "none">("all");
  const [toast, setToast] = useState<string | null>(null);
  // Per-car selected checkpoint: { [carId]: cpName }
  const [selections, setSelections] = useState<Record<number, string>>({});
  // Modal state
  const [modal, setModal] = useState<{ car: Driver; cp: string } | null>(null);

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

  const handleLog = (carId: number, cp: string) => {
    const car = data.find((c) => c.id === carId);
    if (!car) return;
    setModal({ car, cp });
  };

  const handleConfirm = (time: string, odometer: string) => {
    if (!modal) return;
    // TODO: wire up your real API/mutation here
    // e.g. logCheckpoint({ carId: modal.car.id, cp: modal.cp, time, odometer })
    setSelections((prev) => ({ ...prev, [modal.car.id]: "" }));
    setModal(null);
    setToast(`Car ${modal.car.carNo} · ${modal.cp} logged at ${time}`);
  };

  const FilterBtn = ({
    value,
    label,
  }: {
    value: typeof filter;
    label: string;
  }) => (
    <button
      onClick={() => setFilter(value)}
      className="px-3 py-2 rounded-lg text-[10px] font-bold tracking-[0.15em] uppercase transition-all"
      style={{
        fontFamily: "'Oswald', sans-serif",
        background:
          filter === value ? "rgba(217,119,6,0.15)" : "rgba(28,25,23,0.7)",
        border: `1px solid ${filter === value ? "rgba(217,119,6,0.4)" : "rgba(255,255,255,0.06)"}`,
        color: filter === value ? "#D97706" : "#78716c",
      }}
    >
      {label}
    </button>
  );

  const isLoading = LoadingVehicleList || LoadingCheckPoints;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap');
        body { margin: 0; background: #1C1917; }
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

      <div className="tread-bar" style={{ top: 0 }} />
      <div className="tread-bar" style={{ bottom: 0 }} />

      <div
        className="min-h-screen text-stone-100 pt-8 pb-16 px-4"
        style={{
          background: "#1C1917",
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(217,119,6,0.018) 39px,rgba(217,119,6,0.018) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(217,119,6,0.018) 39px,rgba(217,119,6,0.018) 40px)",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
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
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest uppercase"
              style={{
                borderColor: "rgba(217,119,6,0.4)",
                background: "rgba(217,119,6,0.1)",
                color: "#D97706",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#D97706" }}
              />
              Admin
            </div>
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
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "rgba(28,25,23,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#e7e5e4",
                  fontFamily: "'Oswald', sans-serif",
                }}
              />
            </div>
            <FilterBtn value="all" label="All" />
            <FilterBtn value="partial" label="In Progress" />
            <FilterBtn value="none" label="Not Started" />
          </div>

          {/* ── Table ── */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "rgba(28,25,23,0.5)",
              backdropFilter: "blur(8px)",
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
              <div style={{ overflowX: "auto" }}>
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
                      }}
                    >
                      {/* Fixed left columns */}
                      <th className="w-8 pl-4 pr-2 py-3" />
                      <th className="pr-2 py-3 w-14 text-left">
                        <span
                          className="text-[9px] font-black tracking-[0.2em] uppercase"
                          style={{
                            color: "#57534e",
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
                            color: "#57534e",
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
                          key={car.id}
                          car={car}
                          isExpanded={expanded === car.id}
                          onToggle={() =>
                            setExpanded((prev) =>
                              prev === car.id ? null : car.id,
                            )
                          }
                          onLog={(carId, cp) => handleLog(carId, cp)}
                          selectedCp={selections[car.id] ?? ""}
                          onSelectCp={(cp) =>
                            setSelections((prev) => ({ ...prev, [car.id]: cp }))
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
              {CHECKPOINTS.length} Checkpoints · {data.length} Entrants
            </span>
            <div className="h-px flex-1" style={{ background: "#292524" }} />
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-5 flex-wrap justify-center">
            {[
              { color: "#D97706", label: "Completed" },
              { color: "#38bdf8", label: "Selected / Next" },
              { color: "#3c3836", label: "Pending" },
              { color: "#4ade80", label: "Finish" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span
                  className="text-[9px] uppercase tracking-wider"
                  style={{
                    color: "#57534e",
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Log Modal ── */}
      <AnimatePresence>
        {modal && (
          <LogModal
            car={modal.car}
            checkpoint={modal.cp}
            onConfirm={handleConfirm}
            onCancel={() => setModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast} message={toast} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
