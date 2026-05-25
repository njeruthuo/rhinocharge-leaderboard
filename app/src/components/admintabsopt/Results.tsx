import { AnimatePresence } from "framer-motion";
import Search from "../Search";
import { useEffect, useRef, useState } from "react";
import { tune } from "@/constants";
// import CarRow from "./components/CarRow";

interface ResultsProps {
  setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>;
  openFilter?: boolean;
}

const Results = ({ setOpenFilter, openFilter }: ResultsProps) => {
  const [search, setSearch] = useState("");
  const isLoading = false;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenFilter]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
  };

  console.log(openFilter, "search");

  return (
    <div>
      <div className="flex space-x-3 flex-row place-items-center">
        <div className="relative" ref={dropdownRef}>
          <img
            style={{
              background: "#FBF9E7",
              border: "1px solid rgba(217,119,6,0.4)",
              color: "#000",
              fontFamily: "'Oswald', sans-serif",
            }}
            onClick={() => setOpenFilter((prev) => !prev)}
            className="flex hover:cursor-pointer mt-2 justify-center rounded-md p-2 text-black items-center border space-x-2 shrink-0 sm:mb-6 hover:bg-amber-50 transition-colors"
            src={tune}
            alt="Filter Toggle"
          />

          {/* Dropdown Menu */}
          {openFilter && (
            <div
              style={{
                minWidth: 268,
                background: "#1C1917",
                borderColor: "rgba(217,119,6,0.35)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
              }}
              className="absolute left-0 top-12 z-50 w-64 mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-xl transition-all animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between border-b pb-2 mb-3">
                <h3 className="font-semibold text-stone-300 text-sm uppercase tracking-wider">
                  Filters
                </h3>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-stone-400  hover:text-amber-800 font-medium underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Filter Group: Categories */}
              <div className="space-y-2">
                {["Vehicle class", "Full/Half charge"].map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 rounded border-gray-300 text-white focus:ring-amber-500 accent-amber-600"
                    />
                    <span className="text-sm text-stone-400  group-hover:text-gray-900 transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>

              {/* Apply Button */}
              {/* <button
                onClick={() => setOpenFilter(false)}
                className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white rounded-md py-1.5 text-sm font-medium transition-colors shadow-sm"
              >
                Apply Filters
              </button> */}

              <button
                // onClick={handleConfirm}
                onClick={() => setOpenFilter(false)}
                disabled={isLoading}
                className="flex-1 rounded-lg py-2 text-xs font-black tracking-wider uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white rounded-md py-1.5 text-sm font-medium transition-colors shadow-sm"
                style={{
                  background: "rgba(217,119,6,0.18)",
                  color: "#D97706",
                  border: "1px solid rgba(217,119,6,0.3)",
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                {isLoading ? "Syncing..." : "Lock in"}
              </button>
            </div>
          )}
        </div>

        <Search search={search} setSearch={setSearch} />
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
