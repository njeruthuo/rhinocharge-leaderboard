import { AnimatePresence } from "framer-motion";
// import CarRow from "./components/CarRow";

const Results = () => {
  const isLoading = false;
  return (
    <div>
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
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by car no. or driver…"
            className="w-[650px] pl-9 pr-4 py-2 rounded-lg text-lg outline-none"
            style={{
              background: "#FBF9E7",
              border: "1px solid rgba(217,119,6,0.4)",
              color: "#000",
              fontFamily: "'Oswald', sans-serif",
            }}
          />
        </div>
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
            <table className="w-full border-collapse" style={{ minWidth: 900 }}>
              <thead>
                <tr
                  className="border-b"
                  style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    // background: "rgba(0,0,0,0.3)",
                    background: "rgb(84, 89, 95)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    color: "white",
                  }}
                >
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
                  <th className="py-3 pr-4 text-left" style={{ minWidth: 160 }}>
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
                  <th className="py-3 pr-4 text-left" style={{ minWidth: 160 }}>
                    <span
                      className="text-[9px] font-black tracking-[0.2em] uppercase"
                      style={{
                        color: "white",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Position
                    </span>
                  </th>
                  <th className="py-3 pr-4 text-left" style={{ minWidth: 160 }}>
                    <span
                      className="text-[9px] font-black tracking-[0.2em] uppercase"
                      style={{
                        color: "white",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Sector
                    </span>
                  </th>
                  <th className="py-3 pr-4 text-left" style={{ minWidth: 160 }}>
                    <span
                      className="text-[9px] font-black tracking-[0.2em] uppercase"
                      style={{
                        color: "white",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Total Distance
                    </span>
                  </th>

                  <th className="pr-4 py-3 w-20" />
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {/* {filtered.map((car) => (
                    <CarRow
                      key={car.asset_id}
                      car={car as Driver}
                      isExpanded={expanded === car.asset_id}
                      onToggle={() =>
                        setExpanded((prev) =>
                          prev === car.asset_id ? null : car.asset_id,
                        )
                      }
                      selectedCp={selections[car.asset_id] ?? ""}
                      onSelectCp={(cp) =>
                        setSelections((prev) => ({
                          ...prev,
                          [car?.asset_id]: cp,
                        }))
                      }
                    />
                  ))} */}
                </AnimatePresence>

                {/* {filtered.length === 0 && (
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
                )} */}
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
          style={{
            color: "#44403c",
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          {/* {CHECKPOINTS.length + 1} Checkpoints · {data.length} Entrants */}
        </span>
        <div className="h-px flex-1" style={{ background: "#292524" }} />
      </div>
      {/* <button
        onClick={handleSaveStart}
        disabled={disabled || isLoading || !file}
        className="px-3 py-2 rounded-lg text-[10px] ml-auto shrink-0 font-bold tracking-[0.15em] uppercase transition-all disabled:cursor-not-allowed cursor-pointer"
        style={{
          fontFamily: "'Oswald', sans-serif",
          background: disabled ? "#FBF9E7" : "rgba(28,25,23,0.7)",
          border: `1px solid ${disabled || isLoading ? "rgba(217,119,6,0.4)" : "rgba(255,255,255,0.06)"}`,
          color: disabled || isLoading ? "rgba(28,25,23,0.7)" : "#FCFCFC",
        }}
      >
        Save start entries
      </button> */}
    </div>
  );
};
export default Results;
