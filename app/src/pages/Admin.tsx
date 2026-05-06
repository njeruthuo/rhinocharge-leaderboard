import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoggedCheckpoint {
  time: string;
  odometer: string;
}

interface Car {
  id: number;
  no: string;
  name: string;
  team: string;
  cps: Record<string, LoggedCheckpoint>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CHECKPOINTS = [
  "CP1",
  "CP2",
  "CP3",
  "CP4",
  "CP5",
  "CP6",
  "CP7",
  "CP8",
  "CP9",
  "CP10",
  "CP11",
  "FINISH",
];

const INITIAL_CARS: Car[] = [
  {
    id: 1,
    no: "001",
    name: "James Mwangi",
    team: "Tusker Rally Crew",
    cps: {
      CP1: { time: "09:14", odometer: "12" },
      CP2: { time: "10:32", odometer: "28" },
      CP3: { time: "11:47", odometer: "43" },
      CP4: { time: "13:05", odometer: "61" },
      CP5: { time: "14:23", odometer: "79" },
    },
  },
  {
    id: 2,
    no: "007",
    name: "Sarah Kamau",
    team: "Nairobi Wildcats",
    cps: {
      CP1: { time: "09:22", odometer: "15" },
      CP2: { time: "10:58", odometer: "34" },
      CP3: { time: "12:31", odometer: "52" },
    },
  },
  {
    id: 3,
    no: "012",
    name: "Olaf Bjornsen",
    team: "Nordic Off-Road",
    cps: {
      CP1: { time: "09:08", odometer: "11" },
      CP2: { time: "10:15", odometer: "26" },
      CP3: { time: "11:33", odometer: "41" },
      CP4: { time: "12:50", odometer: "57" },
      CP5: { time: "14:02", odometer: "73" },
      CP6: { time: "15:19", odometer: "90" },
    },
  },
  {
    id: 4,
    no: "023",
    name: "Amina Odhiambo",
    team: "Savanna Speed Co",
    cps: { CP1: { time: "09:30", odometer: "18" } },
  },
  {
    id: 5,
    no: "031",
    name: "Tom Kariuki",
    team: "RedRock Racing",
    cps: {
      CP1: { time: "09:17", odometer: "14" },
      CP2: { time: "10:44", odometer: "31" },
      CP3: { time: "12:03", odometer: "47" },
      CP4: { time: "13:28", odometer: "65" },
    },
  },
  {
    id: 6,
    no: "045",
    name: "Priya Desai",
    team: "Monsoon Motorsport",
    cps: {},
  },
  { id: 7, no: "056", name: "Eliud Waweru", team: "Kilimanjaro Krew", cps: {} },
  {
    id: 8,
    no: "068",
    name: "Claire Fontaine",
    team: "Alpine Safari",
    cps: {
      CP1: { time: "09:41", odometer: "16" },
      CP2: { time: "11:10", odometer: "33" },
    },
  },
  {
    id: 9,
    no: "074",
    name: "Benson Mutuku",
    team: "Mara Mud Runners",
    cps: {},
  },
  {
    id: 10,
    no: "089",
    name: "Yuki Tanaka",
    team: "Tokyo Torque",
    cps: {
      CP1: { time: "09:55", odometer: "19" },
      CP2: { time: "11:25", odometer: "37" },
      CP3: { time: "12:58", odometer: "55" },
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

function cpCount(car: Car): number {
  return Object.keys(car.cps).length;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TreadBar({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      className={`fixed left-0 right-0 h-[7px] z-10 pointer-events-none ${position === "top" ? "top-0" : "bottom-0"}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg,#D97706 0px,#D97706 18px,#b45309 18px,#b45309 22px,transparent 22px,transparent 30px,#92400e 30px,#92400e 34px,transparent 34px,transparent 36px,#D97706 36px,#D97706 54px,transparent 54px,transparent 72px)",
        animation: "tread-scroll 2.4s linear infinite",
        opacity: 0.55,
      }}
    />
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: number | string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-3 sm:p-4"
      style={{
        background: "rgba(28,25,23,0.7)",
        borderColor: highlight
          ? "rgba(217,119,6,0.35)"
          : "rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1"
        style={{ color: "#78716c", fontFamily: "'Oswald', sans-serif" }}
      >
        {label}
      </div>
      <div
        className="text-2xl sm:text-3xl font-black leading-none"
        style={{
          color: highlight ? "#D97706" : "#e7e5e4",
          fontFamily: "'Oswald', sans-serif",
        }}
      >
        {value}
      </div>
      <div className="text-[9px] mt-1" style={{ color: "#57534e" }}>
        {sub}
      </div>
    </motion.div>
  );
}

function CheckpointBadge({
  cp,
  logged,
  isSelected,
  onSelect,
}: {
  cp: string;
  logged?: LoggedCheckpoint;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const status = logged ? "completed" : isSelected ? "selected" : "pending";

  const styles = {
    completed: {
      bg: "rgba(217,119,6,0.12)",
      border: "rgba(217,119,6,0.45)",
      nameColor: "#fbbf24",
      valueColor: "#fbbf24",
    },
    selected: {
      bg: "rgba(56,189,248,0.12)",
      border: "rgba(56,189,248,0.5)",
      nameColor: "#38bdf8",
      valueColor: "#38bdf8",
    },
    pending: {
      bg: "rgba(255,255,255,0.02)",
      border: "rgba(255,255,255,0.06)",
      nameColor: "#57534e",
      valueColor: "#3c3836",
    },
  }[status];

  return (
    <motion.div
      whileHover={!logged ? { scale: 1.03 } : {}}
      whileTap={!logged ? { scale: 0.97 } : {}}
      onClick={!logged ? onSelect : undefined}
      className="rounded-lg p-2 border transition-all"
      style={{
        background: styles.bg,
        borderColor: styles.border,
        cursor: logged ? "default" : "pointer",
      }}
    >
      <div
        className="text-[8px] font-black tracking-[0.18em] uppercase leading-none mb-1.5"
        style={{ color: styles.nameColor, fontFamily: "'Oswald', sans-serif" }}
      >
        {cp}
      </div>
      {logged ? (
        <>
          <div
            className="text-[10px] font-bold"
            style={{
              color: styles.valueColor,
              fontFamily: "'Oswald', sans-serif",
            }}
          >
            {logged.time}
          </div>
          <div
            className="text-[8px] mt-0.5 font-mono"
            style={{ color: styles.nameColor, opacity: 0.6 }}
          >
            {logged.odometer} KM
          </div>
        </>
      ) : isSelected ? (
        <div className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#38bdf8" }}
          />
          <span
            className="text-[9px] font-bold italic"
            style={{ color: "#38bdf8", fontFamily: "'Oswald', sans-serif" }}
          >
            SELECTED
          </span>
        </div>
      ) : (
        <div className="text-[10px]" style={{ color: "#3c3836" }}>
          —
        </div>
      )}
    </motion.div>
  );
}

function CarRow({
  car,
  isExpanded,
  onToggle,
  onLog,
}: {
  car: Car;
  isExpanded: boolean;
  onToggle: () => void;
  onLog: (carId: number, cp: string, time: string, odometer: string) => void;
}) {
  const [selectedCp, setSelectedCp] = useState("");
  const [time, setTime] = useState(getDefaultTime());
  const [odometer, setOdometer] = useState("");
  const [error, setError] = useState("");

  const n = cpCount(car);
  const pct = Math.round((n / CHECKPOINTS.length) * 100);
  const remaining = CHECKPOINTS.filter((cp) => !car.cps[cp]);

  const handleLog = () => {
    if (!selectedCp) return setError("Select a checkpoint");
    if (!time) return setError("Enter a time");
    setError("");
    onLog(car.id, selectedCp, time, odometer);
    setSelectedCp("");
    setOdometer("");
    setTime(getDefaultTime());
  };

  const statusColor =
    n === CHECKPOINTS.length ? "#4ade80" : n > 0 ? "#fbbf24" : "#57534e";

  return (
    <motion.div
      layout
      className="rounded-xl border overflow-hidden"
      style={{
        background: "rgba(28,25,23,0.7)",
        borderColor: isExpanded
          ? "rgba(217,119,6,0.4)"
          : "rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header row */}
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Car number */}
          <div
            className="shrink-0 text-xs font-black px-2 py-1 rounded-md tracking-widest"
            style={{
              fontFamily: "'Oswald', sans-serif",
              background: "rgba(217,119,6,0.15)",
              color: "#D97706",
              border: "1px solid rgba(217,119,6,0.3)",
              minWidth: 44,
              textAlign: "center",
            }}
          >
            {car.no}
          </div>

          {/* Driver info */}
          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-bold truncate"
              style={{
                color: "#f5f5f4",
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              {car.name}
            </div>
            <div
              className="text-[10px] uppercase tracking-wider truncate"
              style={{ color: "#78716c" }}
            >
              {car.team}
            </div>
          </div>

          {/* CPs logged count */}
          <div
            className="shrink-0 text-xs font-bold tracking-wider hidden sm:block"
            style={{ color: statusColor, fontFamily: "'Oswald', sans-serif" }}
          >
            {n}/{CHECKPOINTS.length} CPS
          </div>

          {/* Progress bar */}
          <div className="hidden md:flex flex-col gap-1 w-28 shrink-0">
            <div
              className="w-full h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ background: "#D97706" }}
              />
            </div>
            <span
              className="text-[9px] text-right"
              style={{ color: "#57534e" }}
            >
              {pct}%
            </span>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: "#57534e" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </button>

      {/* Expandable detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="mx-2 mb-2 rounded-xl p-4 border"
              style={{
                background: "rgba(12,10,9,0.6)",
                borderColor: "rgba(217,119,6,0.15)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Checkpoint grid */}
              <div
                className="text-[9px] font-black tracking-[0.2em] uppercase mb-3"
                style={{ color: "#D97706", fontFamily: "'Oswald', sans-serif" }}
              >
                Checkpoint Status · tap pending to select
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 mb-4">
                {CHECKPOINTS.map((cp) => (
                  <CheckpointBadge
                    key={cp}
                    cp={cp}
                    logged={car.cps[cp]}
                    isSelected={selectedCp === cp}
                    onSelect={() =>
                      setSelectedCp((prev) => (prev === cp ? "" : cp))
                    }
                  />
                ))}
              </div>

              {/* Log panel */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: "rgba(56,189,248,0.05)",
                  borderColor: "rgba(56,189,248,0.2)",
                }}
              >
                <div
                  className="text-[9px] font-black tracking-[0.2em] uppercase mb-3 flex items-center gap-2"
                  style={{
                    color: "#38bdf8",
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0a5.5 5.5 0 100 11A5.5 5.5 0 008 0zm.5 8.5h-1v-4h1v4zm0-5h-1v-1h1v1z" />
                  </svg>
                  Log Checkpoint
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                  {/* Checkpoint select */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[9px] uppercase tracking-[0.15em]"
                      style={{
                        color: "#57534e",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Checkpoint
                    </label>
                    <select
                      value={selectedCp}
                      onChange={(e) => setSelectedCp(e.target.value)}
                      className="rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                      style={{
                        background: "rgba(28,25,23,0.9)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: selectedCp ? "#e7e5e4" : "#57534e",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      <option value="">— Select —</option>
                      {remaining.map((cp) => (
                        <option
                          key={cp}
                          value={cp}
                          style={{ background: "#1C1917" }}
                        >
                          {cp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time input */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[9px] uppercase tracking-[0.15em]"
                      style={{
                        color: "#57534e",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="rounded-lg px-3 py-2 text-sm outline-none"
                      style={{
                        background: "rgba(28,25,23,0.9)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#e7e5e4",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    />
                  </div>

                  {/* Odometer input */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[9px] uppercase tracking-[0.15em]"
                      style={{
                        color: "#57534e",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Odometer (km)
                    </label>
                    <input
                      type="number"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      placeholder="e.g. 142"
                      min={0}
                      className="rounded-lg px-3 py-2 text-sm outline-none"
                      style={{
                        background: "rgba(28,25,23,0.9)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#e7e5e4",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    />
                  </div>

                  {/* Log button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLog}
                    disabled={!selectedCp || !time}
                    className="rounded-lg px-4 py-2 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
                    style={{
                      background:
                        selectedCp && time
                          ? "rgba(56,189,248,0.2)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selectedCp && time ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.06)"}`,
                      color: selectedCp && time ? "#38bdf8" : "#57534e",
                      fontFamily: "'Oswald', sans-serif",
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8l4 4 6-7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Log CP
                  </motion.button>
                </div>

                {error && (
                  <div
                    className="mt-2 text-[10px] font-bold tracking-wider"
                    style={{
                      color: "#f87171",
                      fontFamily: "'Oswald', sans-serif",
                    }}
                  >
                    ⚠ {error}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      onAnimationComplete={() => setTimeout(onDone, 2500)}
      className="fixed bottom-6 right-4 z-50 flex items-center gap-3 rounded-xl px-4 py-3 border text-xs font-bold tracking-wider"
      style={{
        background: "#1C1917",
        borderColor: "rgba(74,222,128,0.4)",
        color: "#4ade80",
        fontFamily: "'Oswald', sans-serif",
        letterSpacing: "0.05em",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "partial" | "none">("all");
  const [toast, setToast] = useState<string | null>(null);

  const stats = useMemo(() => {
    const started = cars.filter((c) => cpCount(c) > 0).length;
    const finished = cars.filter((c) => !!c.cps["FINISH"]).length;
    const total = cars.reduce((s, c) => s + cpCount(c), 0);
    return { started, finished, total, count: cars.length };
  }, [cars]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cars.filter((car) => {
      const matchQ =
        !q ||
        car.no.includes(q) ||
        car.name.toLowerCase().includes(q) ||
        car.team.toLowerCase().includes(q);
      const n = cpCount(car);
      const matchF =
        filter === "all" ||
        (filter === "partial" && n > 0 && !car.cps["FINISH"]) ||
        (filter === "none" && n === 0);
      return matchQ && matchF;
    });
  }, [cars, search, filter]);

  const handleLog = (
    carId: number,
    cp: string,
    time: string,
    odometer: string,
  ) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === carId
          ? {
              ...car,
              cps: { ...car.cps, [cp]: { time, odometer: odometer || "—" } },
            }
          : car,
      ),
    );
    const car = cars.find((c) => c.id === carId);
    setToast(`Car ${car?.no} · ${cp} logged at ${time}`);
  };

  const FilterBtn = ({
    value,
    label,
  }: {
    value: "all" | "partial" | "none";
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap');
        body { margin: 0; background: #1C1917; }
        @keyframes tread-scroll {
          0%   { background-position: 0 0; }
          100% { background-position: 72px 0; }
        }
        input[type="time"]::-webkit-calendar-picker-indicator,
        input[type="number"]::-webkit-inner-spin-button {
          filter: invert(0.4);
        }
        select option { background: #1C1917; color: #e7e5e4; }
      `}</style>

      <TreadBar position="top" />
      <TreadBar position="bottom" />

      {/* Rhino ghost watermark */}
      <svg
        className="fixed pointer-events-none z-0 opacity-[0.025]"
        style={{ width: 480, height: 320, bottom: "6%", right: "-3%" }}
        viewBox="0 0 520 340"
        fill="none"
        aria-hidden="true"
      >
        <ellipse cx="260" cy="210" rx="170" ry="100" fill="#D97706" />
        <ellipse cx="90" cy="185" rx="72" ry="58" fill="#D97706" />
        <path
          d="M130 160 Q160 155 165 200 Q160 240 130 235 Q100 240 88 210Z"
          fill="#D97706"
        />
        <path d="M30 155 Q18 110 38 95 Q55 108 50 150Z" fill="#D97706" />
        <path d="M62 148 Q55 118 68 108 Q78 118 76 145Z" fill="#D97706" />
        <rect x="130" y="295" width="32" height="44" rx="8" fill="#D97706" />
        <rect x="195" y="298" width="32" height="42" rx="8" fill="#D97706" />
        <rect x="290" y="298" width="32" height="42" rx="8" fill="#D97706" />
        <rect x="355" y="295" width="32" height="44" rx="8" fill="#D97706" />
        <path d="M425 195 Q460 180 470 200 Q460 218 430 215Z" fill="#D97706" />
      </svg>

      <div
        className="relative min-h-screen text-stone-100 py-6 px-4 pb-16"
        style={{
          background: "#1C1917",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(217,119,6,0.018) 39px, rgba(217,119,6,0.018) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(217,119,6,0.018) 39px, rgba(217,119,6,0.018) 40px)
          `,
          zIndex: 2,
        }}
      >
        <div className="max-w-4xl mx-auto">
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
            <div className="flex items-center gap-3">
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
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="Entrants"
              value={stats.count}
              sub="Registered cars"
            />
            <StatCard
              label="Running"
              value={stats.started}
              sub={`${stats.count - stats.started} not started`}
              highlight
            />
            <StatCard
              label="Finished"
              value={stats.finished}
              sub="Completed course"
            />
            <StatCard
              label="CPs Logged"
              value={stats.total}
              sub={`of ${stats.count * CHECKPOINTS.length} total`}
            />
          </div>

          {/* ── Search + Filters ── */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex-1 min-w-48 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
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
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-colors"
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

          {/* ── Car list ── */}
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                >
                  <CarRow
                    car={car}
                    isExpanded={expanded === car.id}
                    onToggle={() =>
                      setExpanded((prev) => (prev === car.id ? null : car.id))
                    }
                    onLog={handleLog}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div
                className="text-center py-16 text-sm tracking-widest uppercase"
                style={{ color: "#57534e", fontFamily: "'Oswald', sans-serif" }}
              >
                No entrants match your filters
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: "#292524" }} />
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{ color: "#44403c", fontFamily: "'Oswald', sans-serif" }}
            >
              {CHECKPOINTS.length} Checkpoints · {cars.length} Entrants
            </span>
            <div className="h-px flex-1" style={{ background: "#292524" }} />
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-5 flex-wrap justify-center">
            {[
              { color: "#D97706", label: "Completed" },
              { color: "#38bdf8", label: "Selected" },
              { color: "#3c3836", label: "Pending" },
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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast} message={toast} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
