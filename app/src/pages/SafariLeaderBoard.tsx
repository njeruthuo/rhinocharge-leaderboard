import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import type { CheckPoint, Driver, DriverTypeProps } from "@/types";
import { colors, permanentColors, spinner } from "@/constants";
import DesktopTable from "@/components/DesktopTable";
import { CHECKPOINTS } from "@/data";
import { getCheckpointStatus } from "@/utils";
import { useLocation } from "react-router-dom";
import LeaderboardHeader from "@/components/LeaderboardHeader";

function CheckpointBadge({
  cp,
  isViewer,
}: {
  cp: CheckPoint;
  isViewer: boolean;
}) {
  const status = getCheckpointStatus(cp);

  const badgeStyle =
    status === "completed"
      ? "bg-amber-900/40 border-amber-600/50 text-amber-300"
      : status === "active"
        ? "bg-sky-900/40 border-sky-500/50 text-sky-300"
        : "bg-stone-800/50 border-stone-700/40 text-stone-600";

  return (
    <div
      className={`flex flex-col gap-1 border rounded-md p-2 transition-all ${badgeStyle}`}
    >
      <span className="text-[9px] font-bold tracking-widest uppercase leading-none opacity-70 truncate">
        {cp.point}
      </span>

      <div className="flex flex-col gap-0.5 mt-1">
        {status === "completed" ? (
          <>
            <span className="text-[10px] font-bold">{cp.time}</span>
            {isViewer && (
              <span className="text-[8px] opacity-60 font-mono">
                {cp.odometer} KM
              </span>
            )}
          </>
        ) : status === "active" ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[10px] font-bold italic">NEXT</span>
          </div>
        ) : (
          <span className="text-[10px] opacity-30">—</span>
        )}
      </div>
    </div>
  );
}

function LeaderboardRow({
  driver,
  rank,
  checkpoints,
  isViewer,
}: {
  driver: Driver;
  rank: number;
  checkpoints: CheckPoint[];
  isViewer: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const totalCheckpoints = checkpoints.length;
  const progress = Math.round(
    (driver.orderedCheckpoints.length / totalCheckpoints) * 100,
  );

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
              className="shrink-0 font-black text-xs tracking-widest px-2 py-1 rounded"
              style={{
                background: "rgba(217,119,6,0.15)",
                color: "#D97706",
                border: "1px solid rgba(217,119,6,0.3)",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              {driver.carNo}
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
              <div className="text-gray-300 text-[10px] tracking-wider truncate uppercase">
                {driver.team_name}
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 w-28 shrink-0">
              <div className="w-full h-1 rounded-full bg-stone-800">
                <motion.div
                  className={`h-full rounded-full ${colors.bgPrimary}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="text-[14px] text-stone-500 tracking-widest">
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
                  <span className="text-[10px] text-gray-300">
                    {driver.totalCps} of {totalCheckpoints} completed
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {driver.checkpoints.map((cp: CheckPoint) => (
                    <CheckpointBadge
                      isViewer={isViewer}
                      key={`${cp.point}-${cp.time}`}
                      cp={cp}
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

function SafariLeaderBoard({
  showHeader = true,
  data,
  LoadingCheckPoints,
  LoadingVehicleList,
}: {
  showHeader?: boolean;
} & DriverTypeProps) {
  const { pathname } = useLocation();

  const loadingState = useMemo(() => {
    return data.length < 1 && (LoadingVehicleList || LoadingCheckPoints);
  }, [data, LoadingVehicleList, LoadingCheckPoints]);

  // 4. Sorts dynamically whenever the active resolved dataset shifts
  const drivers = data;

  const isViewer = useMemo((): boolean => {
    return pathname !== "/";
  }, [pathname]);

  // console.log(drivers, "driver");

  return (
    <div style={{ background: "#FBFBFB" }}>
      <div
        className={`${showHeader ? "min-h-[90vh] py-3" : "max-h-[85vh]"} text-stone-100  px-4`}
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
        <div className="xl:max-w-[95vw] max-w-400 mx-auto">
          {showHeader && <LeaderboardHeader />}
          <div className="hidden lg:block mb-2">
            {loadingState ? (
              <div
                className="flex justify-center items-center"
                style={{
                  borderColor: "rgba(217,119,6,0.15)",
                  backdropFilter: "blur(8px)",
                  overflowX: "auto",
                  overflowY: "auto",
                  minHeight: "78vh",
                }}
              >
                <img
                  src={spinner}
                  alt="loading..."
                  className="animate-spin h-10 w-10 text-gray-900"
                />
              </div>
            ) : (
              <DesktopTable
                reduceHeight={showHeader}
                isViewer={isViewer}
                drivers={drivers as Driver[]}
              />
            )}
          </div>
          <div className="lg:hidden">
            <div className="hidden sm:grid grid-cols-[48px_56px_1fr_112px_56px_28px] gap-3 px-4 mb-2">
              {["Car", "Driver / Team", "Progress", "CPS", ""].map((h) => (
                <div
                  key={h}
                  className="text-[9px] font-bold tracking-[0.2em] text-stone-600 uppercase"
                >
                  {h}
                </div>
              ))}
            </div>
            <Reorder.Group
              axis="y"
              values={drivers}
              onReorder={() => {}}
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
                    <LeaderboardRow
                      isViewer={isViewer}
                      driver={driver as unknown as Driver}
                      rank={index + 1}
                      checkpoints={driver.checkpoints}
                    />
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="h-px flex-1 bg-stone-800" />
            <span className="text-[9px] tracking-widest text-stone-700 uppercase">
              {CHECKPOINTS ? CHECKPOINTS.length + 1 : 0} Checkpoints ·{" "}
              {drivers.length} Entrants
            </span>
            <div className="h-px flex-1 bg-stone-800" />
          </div>
          <div className="mt-3 flex items-center gap-4 flex-wrap justify-center">
            {[
              { color: permanentColors.complete, label: "Completed" },
              { color: permanentColors.active, label: "Active" },
              { color: permanentColors.pending, label: "Pending" },
              { color: permanentColors.start, label: "Start" },
              { color: permanentColors.finish, label: "Finish" },
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

      {/* <p className="text-sm text-center">Powered by Bluetrax</p> */}
      <footer className="w-full py-2 mt-6 border-t border-stone-200/60">
        <div className="flex flex-col items-center justify-center text-center gap-1">
          <p className="text-xs font-medium tracking-wide text-stone-500">
            © {new Date().getFullYear()} Rivercross Technologies. All rights
            reserved.
          </p>
          <p className="text-[11px] tracking-wider uppercase text-stone-400 font-light">
            Powered by{" "}
            <span className="font-normal text-stone-500">Bluetrax</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
export default memo(SafariLeaderBoard);
