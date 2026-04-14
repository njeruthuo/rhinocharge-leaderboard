import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import type { Driver } from "./types";
import { CHECKPOINTS, INITIAL_DRIVERS, type CheckpointName } from "./data";

function getRankStyle(rank: number): string {
  if (rank === 1) return "text-amber-400";
  if (rank === 2) return "text-slate-300";
  if (rank === 3) return "text-amber-700";
  return "text-stone-500";
}

function getRankLabel(rank: number): string {
  if (rank === 1) return "P1";
  if (rank === 2) return "P2";
  if (rank === 3) return "P3";
  return `P${rank}`;
}

function getCheckpointStatus(
  value: string,
): "completed" | "active" | "pending" {
  if (!value) return "pending";
  if (value === "START") return "completed";
  return "active";
}

function shuffleDrivers(drivers: Driver[]): Driver[] {
  return drivers
    .map((d) => {
      const cpKeys = Object.keys(d.checkpoints);
      const completedCount = Math.floor(Math.random() * (cpKeys.length + 1));
      const newCheckpoints: Record<string, string> = {};
      cpKeys.forEach((k, i) => {
        newCheckpoints[k] = i < completedCount ? "START" : "";
      });
      return { ...d, checkpoints: newCheckpoints, totalCps: completedCount };
    })
    .sort((a, b) => b.totalCps - a.totalCps);
}

function CheckpointBadge({
  name,
  value,
}: {
  name: CheckpointName;
  value: string;
}) {
  const status = getCheckpointStatus(value);
  const badgeStyle =
    status === "completed"
      ? "bg-amber-900/40 border-amber-600/50 text-amber-300"
      : status === "active"
        ? "bg-sky-900/40 border-sky-500/50 text-sky-300"
        : "bg-stone-800/50 border-stone-700/40 text-stone-600";

  const icon =
    status === "completed" ? (
      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
        <path
          d="M10 3L5 8.5 2 5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : status === "active" ? (
      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse inline-block" />
    ) : (
      <span className="w-2 h-2 rounded-full bg-stone-600 inline-block" />
    );

  return (
    <div className={`flex flex-col gap-1 border rounded-md p-2 ${badgeStyle}`}>
      <span className="text-[9px] font-bold tracking-widest uppercase leading-none opacity-70 truncate">
        {name}
      </span>
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] font-semibold tracking-wider">
          {status === "completed"
            ? "Done"
            : status === "active"
              ? "Active"
              : "—"}
        </span>
      </div>
    </div>
  );
}

function CheckpointCell({ value }: { value: string }) {
  const status = getCheckpointStatus(value);
  if (status === "completed")
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-amber-900/50 border border-amber-600/40 flex items-center justify-center">
          <svg className="w-3 h-3 text-amber-400" viewBox="0 0 12 12">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  if (status === "active")
    return (
      <div className="flex flex-col items-center justify-center gap-0.5">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        <span
          className="text-[8px] font-bold tracking-wider uppercase"
          style={{ color: "#38bdf8", lineHeight: 1 }}
        >
          {/* Active */}
        </span>
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center gap-0.5">
      <span className="w-2 h-2 rounded-full bg-stone-600" />
      <span
        className="text-[8px] font-bold tracking-wider uppercase"
        style={{ color: "#57534e", lineHeight: 1 }}
      >
        {/* Pending */}
      </span>
    </div>
  );
}

function LeaderboardRow({ driver, rank }: { driver: Driver; rank: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const totalCheckpoints = CHECKPOINTS.length;
  const progress = Math.round((driver.totalCps / totalCheckpoints) * 100);

  return (
    <motion.div layout className="relative">
      <motion.div
        whileHover={{ x: [0, -1, 1, -0.5, 0.5, 0] }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative"
      >
        {rank <= 3 && (
          <div
            className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
            style={{
              background:
                rank === 1
                  ? "linear-gradient(90deg, #D97706 0%, transparent 40%)"
                  : rank === 2
                    ? "linear-gradient(90deg, #94a3b8 0%, transparent 40%)"
                    : "linear-gradient(90deg, #92400e 0%, transparent 40%)",
            }}
          />
        )}

        <button
          onClick={() => setIsOpen((p) => !p)}
          className="w-full text-left"
        >
          <div
            className="relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors duration-150"
            style={{
              background: "rgba(28,25,23,0.7)",
              backdropFilter: "blur(8px)",
              borderColor: isOpen
                ? "rgba(217,119,6,0.4)"
                : "rgba(255,255,255,0.06)",
              borderLeft: `3px solid ${rank === 1 ? "#D97706" : rank === 2 ? "#94a3b8" : rank === 3 ? "#92400e" : "#44403c"}`,
            }}
          >
            <div
              className={`font-black text-lg w-8 shrink-0 font-mono ${getRankStyle(rank)}`}
            >
              {getRankLabel(rank)}
            </div>
            <div
              className="shrink-0 font-black text-xs tracking-widest px-2 py-1 rounded"
              style={{
                background: "rgba(217,119,6,0.15)",
                color: "#D97706",
                border: "1px solid rgba(217,119,6,0.3)",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              #{driver.carNo}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-stone-100 font-bold text-sm truncate"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: "0.04em",
                }}
              >
                {driver.entrantName}
              </div>
              <div className="text-stone-500 text-[10px] tracking-wider truncate uppercase">
                {driver.teamName}
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 w-28 shrink-0">
              <div className="w-full h-1 rounded-full bg-stone-800">
                <motion.div
                  className="h-full rounded-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="text-[9px] text-stone-500 tracking-widest">
                {driver.totalCps}/{totalCheckpoints} CPS
              </span>
            </div>
            <div
              className="shrink-0 font-black text-base px-3 py-1 rounded-lg"
              style={{
                fontFamily: "'Oswald', sans-serif",
                background:
                  rank === 1
                    ? "rgba(217,119,6,0.25)"
                    : "rgba(255,255,255,0.06)",
                color: rank === 1 ? "#fbbf24" : "#d6d3d1",
                border: `1px solid ${rank === 1 ? "rgba(217,119,6,0.4)" : "rgba(255,255,255,0.08)"}`,
                minWidth: 44,
                textAlign: "center",
              }}
            >
              {driver.totalCps}
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-stone-600 shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="mt-1 mx-1 rounded-xl p-4 border"
                style={{
                  background: "rgba(12,10,9,0.65)",
                  backdropFilter: "blur(16px)",
                  borderColor: "rgba(217,119,6,0.2)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold tracking-[0.2em] text-amber-600 uppercase"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    Checkpoint Breakdown
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {driver.totalCps} of {totalCheckpoints} completed
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {CHECKPOINTS.map((cp) => (
                    <CheckpointBadge
                      key={cp}
                      name={cp}
                      value={driver.checkpoints[cp] ?? ""}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const TD_V = 12;
const TD_CELL: React.CSSProperties = {
  paddingTop: TD_V,
  paddingBottom: TD_V,
  verticalAlign: "middle",
};

function DesktopTableRow({ driver, rank }: { driver: Driver; rank: number }) {
  const totalCheckpoints = CHECKPOINTS.length;
  const progress = Math.round((driver.totalCps / totalCheckpoints) * 100);

  return (
    <>
      <td style={{ width: 4, padding: 0, verticalAlign: "middle" }}>
        <div
          style={{
            width: 4,
            minHeight: 52,
            height: "100%",
            borderRadius: "4px 0 0 4px",
            background:
              rank === 1
                ? "#D97706"
                : rank === 2
                  ? "#94a3b8"
                  : rank === 3
                    ? "#92400e"
                    : "#44403c",
          }}
        />
      </td>

      <td
        style={{
          ...TD_CELL,
          paddingLeft: 12,
          paddingRight: 12,
          whiteSpace: "nowrap",
        }}
      >
        <span
          className={`font-black text-base font-mono ${getRankStyle(rank)}`}
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          {getRankLabel(rank)}
        </span>
      </td>

      <td style={{ ...TD_CELL, paddingRight: 16, whiteSpace: "nowrap" }}>
        <span
          className="font-black text-xs tracking-widest px-2 py-1 rounded"
          style={{
            background: "rgba(217,119,6,0.15)",
            color: "#D97706",
            border: "1px solid rgba(217,119,6,0.3)",
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          #{driver.carNo}
        </span>
      </td>

      <td style={{ ...TD_CELL, paddingRight: 24, minWidth: 160 }}>
        <div
          className="font-bold text-sm text-[#716969] leading-tight"
          style={{
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          {driver.entrantName}
        </div>
        <div className="text-[10px] text-stone-500 tracking-wider uppercase">
          {driver.teamName}
        </div>
      </td>

      {CHECKPOINTS.map((cp) => (
        <td
          key={cp}
          style={{
            ...TD_CELL,
            width: 36,
            minWidth: 36,
            maxWidth: 36,
            textAlign: "center",
          }}
        >
          <CheckpointCell value={driver.checkpoints[cp] ?? ""} />
        </td>
      ))}

      <td
        style={{
          ...TD_CELL,
          paddingLeft: 16,
          paddingRight: 12,
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        <div className="flex flex-col items-end gap-1">
          <span
            className="font-black text-base"
            style={{
              fontFamily: "'Oswald', sans-serif",
              color: rank === 1 ? "#fbbf24" : "#d6d3d1",
            }}
          >
            {driver.totalCps}
            <span className="text-[10px] text-stone-600 font-normal ml-1">
              /{totalCheckpoints}
            </span>
          </span>
          <div className="w-16 h-0.5 rounded-full bg-stone-800">
            <motion.div
              className="h-full rounded-full bg-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </td>
    </>
  );
}

function DesktopTable({ drivers }: { drivers: Driver[] }) {
  return (
    <div
      className="w-full overflow-x-auto rounded-xl border"
      style={{
        borderColor: "rgba(217,119,6,0.15)",
        // background: "#BCABAE",
        // background: "#FBFBFB",
        // background: "rgba(28,25,23,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <table className="w-full border-separate">
        <thead>
          <tr
            style={{
              borderBottom: "1px solid rgba(217,119,6,0.15)",
              position: "sticky",
            }}
          >
            {/* accent spacer */}
            <th className="w-1" />
            <th className="py-3 pr-3 text-left">
              <span className="text-[9px] font-bold tracking-[0.2em] text-stone-600 uppercase">
                Rank
              </span>
            </th>
            <th className="py-3 pr-4 text-left">
              <span className="text-[9px] font-bold tracking-[0.2em] text-stone-600 uppercase">
                Car
              </span>
            </th>
            <th className="py-3 pr-6 text-left">
              <span className="text-[9px] font-bold tracking-[0.2em] text-stone-600 uppercase">
                Driver / Team
              </span>
            </th>
            {CHECKPOINTS.map((cp) => (
              <th
                key={cp}
                style={{
                  width: 36,
                  minWidth: 36,
                  maxWidth: 36,
                  padding: "12px 0 8px",
                  textAlign: "center",
                  verticalAlign: "bottom",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span
                    className="text-[9px] font-bold tracking-widest text-amber-700/70 uppercase"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      display: "block",
                      lineHeight: 1,
                    }}
                  >
                    {cp}
                  </span>
                </div>
              </th>
            ))}
            <th className="py-3 pl-4 pr-2 text-right">
              <span className="text-[9px] font-bold tracking-[0.2em] text-stone-600 uppercase">
                CPS
              </span>
            </th>
          </tr>
        </thead>
        <AnimatePresence>
          <tbody>
            {drivers.map((driver, index) => {
              const rank = index + 1;
              return (
                <motion.tr
                  key={driver.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background:
                      rank === 1
                        ? "rgba(217,119,6,0.06)"
                        : rank === 2
                          ? "rgba(148,163,184,0.04)"
                          : rank === 3
                            ? "rgba(146,64,14,0.05)"
                            : "transparent",
                  }}
                  className="hover:bg-white/[0.02] transition-colors duration-100"
                >
                  <DesktopTableRow driver={driver} rank={rank} />
                </motion.tr>
              );
            })}
          </tbody>
        </AnimatePresence>
      </table>
    </div>
  );
}

export default function SafariLeaderBoard() {
  const [drivers, setDrivers] = useState<Driver[]>(() =>
    [...INITIAL_DRIVERS].sort((a, b) => b.totalCps - a.totalCps),
  );
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);

  const handleShuffle = useCallback(() => {
    setIsShuffling(true);
    setTimeout(() => {
      setDrivers(shuffleDrivers(drivers));
      setShuffleCount((c) => c + 1);
      setIsShuffling(false);
    }, 150);
  }, [drivers]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap');
        body { margin: 0; background: #1C1917; }

        @keyframes rhino-drift {
          0%   { transform: translateX(0px) translateY(0px) rotate(-8deg); opacity: 0.028; }
          50%  { transform: translateX(6px) translateY(-4px) rotate(-8deg); opacity: 0.038; }
          100% { transform: translateX(0px) translateY(0px) rotate(-8deg); opacity: 0.028; }
        }
        @keyframes tread-scroll {
          0%   { background-position: 0 0; }
          100% { background-position: 72px 0; }
        }
        .rhino-ghost {
          position: fixed; pointer-events: none; z-index: 0;
          animation: rhino-drift 9s ease-in-out infinite;
        }
        .rhino-ghost-2 { animation-delay: -4.5s; animation-duration: 12s; }
        .tread-bar {
          position: fixed; left: 0; right: 0; height: 7px; z-index: 1; pointer-events: none;
          background-image: repeating-linear-gradient(
            90deg,
            #D97706 0px, #D97706 18px,
            #b45309 18px, #b45309 22px,
            transparent 22px, transparent 30px,
            #92400e 30px, #92400e 34px,
            transparent 34px, transparent 36px,
            #D97706 36px, #D97706 54px,
            transparent 54px, transparent 72px
          );
          animation: tread-scroll 2.4s linear infinite;
          opacity: 0.55;
        }
        .tread-top    { top: 0; }
        .tread-bottom { bottom: 0; }

        /* Desktop table: rotated headers need a fixed min-width per checkpoint col */
        .cp-col { width: 36px; min-width: 36px; }
      `}</style>

      <div className="tread-bar tread-top" />
      <div className="tread-bar tread-bottom" />

      <svg
        className="rhino-ghost"
        style={{ width: 520, height: 340, bottom: "8%", right: "-4%" }}
        viewBox="0 0 520 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
        <path d="M112 135 Q118 112 132 118 Q130 135 118 140Z" fill="#D97706" />
        <rect x="130" y="295" width="32" height="44" rx="8" fill="#D97706" />
        <rect x="195" y="298" width="32" height="42" rx="8" fill="#D97706" />
        <rect x="290" y="298" width="32" height="42" rx="8" fill="#D97706" />
        <rect x="355" y="295" width="32" height="44" rx="8" fill="#D97706" />
        <path d="M425 195 Q460 180 470 200 Q460 218 430 215Z" fill="#D97706" />
        <circle cx="72" cy="178" r="7" fill="#1C1917" />
        <circle cx="70" cy="176" r="2.5" fill="#D97706" />
        <path
          d="M150 140 Q165 180 150 220"
          stroke="#1C1917"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
          fill="none"
        />
        <path
          d="M320 120 Q330 170 322 220"
          stroke="#1C1917"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.25"
          fill="none"
        />
        <path
          d="M240 125 Q248 170 242 215"
          stroke="#1C1917"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.2"
          fill="none"
        />
      </svg>

      <svg
        className="rhino-ghost rhino-ghost-2"
        style={{ width: 220, height: 145, top: "12%", left: "2%" }}
        viewBox="0 0 520 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
        <path d="M112 135 Q118 112 132 118 Q130 135 118 140Z" fill="#D97706" />
        <rect x="130" y="295" width="32" height="44" rx="8" fill="#D97706" />
        <rect x="195" y="298" width="32" height="42" rx="8" fill="#D97706" />
        <rect x="290" y="298" width="32" height="42" rx="8" fill="#D97706" />
        <rect x="355" y="295" width="32" height="44" rx="8" fill="#D97706" />
        <path d="M425 195 Q460 180 470 200 Q460 218 430 215Z" fill="#D97706" />
        <circle cx="72" cy="178" r="7" fill="#1C1917" />
      </svg>

      <div
        className="min-h-screen text-stone-100 py-6 px-4"
        style={{
          background: "#FBFBFB",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(217,119,6,0.025) 39px, rgba(217,119,6,0.025) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(217,119,6,0.025) 39px, rgba(217,119,6,0.025) 40px),
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(217,119,6,0.07) 0%, transparent 70%)
          `,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="max-w-3xl xl:max-w-[95vw] 2xl:max-w-[1600px] mx-auto">
          {/* ── Header — unchanged ── */}
          <div className="mb-8">
            <div
              className="text-[10px] font-bold tracking-[0.3em] text-amber-600 mb-1 uppercase"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Rhino Charge · Edition 2026
            </div>
            <div
              className="text-3xl sm:text-4xl font-black text-[#716969] leading-none mb-1"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              Rhino Charge Kenya
            </div>
            <div className="text-stone-500 text-xs tracking-widest uppercase">
              Ol Pejeta Conservancy — Overall Leaderboard
            </div>

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-700/40 bg-amber-900/20">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                  Live
                </span>
              </div>

              <button
                onClick={handleShuffle}
                disabled={isShuffling}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border font-bold text-xs tracking-widest uppercase transition-all duration-150 disabled:opacity-50"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  borderColor: "rgba(217,119,6,0.4)",
                  color: "#D97706",
                  background: isShuffling
                    ? "rgba(217,119,6,0.2)"
                    : "transparent",
                  letterSpacing: "0.12em",
                }}
              >
                <motion.span
                  animate={{ rotate: isShuffling ? 360 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block"
                >
                  ⚡
                </motion.span>
                {isShuffling ? "Updating..." : "Shuffle Stage"}
              </button>

              {shuffleCount > 0 && (
                <span className="text-[10px] text-stone-600">
                  Update #{shuffleCount}
                </span>
              )}
            </div>
          </div>

          <div className="hidden lg:block mb-2">
            <DesktopTable drivers={drivers} />
          </div>

          <div className="lg:hidden">
            <div className="hidden sm:grid grid-cols-[48px_56px_1fr_112px_56px_28px] gap-3 px-4 mb-2">
              {["Rank", "Car", "Driver / Team", "Progress", "CPS", ""].map(
                (h) => (
                  <div
                    key={h}
                    className="text-[9px] font-bold tracking-[0.2em] text-stone-600 uppercase"
                  >
                    {h}
                  </div>
                ),
              )}
            </div>

            <Reorder.Group
              axis="y"
              values={drivers}
              onReorder={setDrivers}
              className="flex flex-col gap-2"
              as="div"
            >
              <AnimatePresence>
                {drivers.map((driver, index) => (
                  <Reorder.Item
                    key={driver.id}
                    value={driver}
                    dragListener={false}
                    as="div"
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <LeaderboardRow driver={driver} rank={index + 1} />
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>

          {/* ── Footer ── */}
          <div className="mt-8 flex items-center gap-4 flex-wrap">
            <div className="h-px flex-1 bg-stone-800" />
            <span className="text-[9px] tracking-widest text-stone-700 uppercase">
              {CHECKPOINTS.length} Checkpoints · {drivers.length} Entrants
            </span>
            <div className="h-px flex-1 bg-stone-800" />
          </div>

          <div className="mt-4 flex items-center gap-4 flex-wrap justify-center">
            {[
              { color: "bg-amber-500", label: "Completed" },
              { color: "bg-sky-400", label: "Active" },
              { color: "bg-stone-600", label: "Pending" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[10px] text-stone-600 tracking-wider uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
