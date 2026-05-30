import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";

// import Search from "../Search";
// import { tune } from "@/constants";
import type { DataType, ResultsProps } from "@/types";

const Results = ({
  setOpenFilter,
  data,
  LoadingCheckPoints,
  LoadingVehicleList,
}: ResultsProps & {
  data: DataType[];
  LoadingVehicleList: boolean;
  LoadingCheckPoints: boolean;
}) => {
  // const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoading = useMemo(() => {
    return data.length < 1 && (LoadingVehicleList || LoadingCheckPoints);
  }, [data, LoadingVehicleList, LoadingCheckPoints]);

  const orderedData = useMemo(() => {
    return [...data].sort((a, b) => b.totalCps - a.totalCps);
  }, [data]);

  // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  // const handleCategoryChange = (category: string) => {
  //   setSelectedCategories((prev) =>
  //     prev.includes(category)
  //       ? prev.filter((item) => item !== category)
  //       : [...prev, category],
  //   );
  // };

  // const handleClearFilters = () => {
  //   setSelectedCategories([]);
  // };

  return (
    <div>
      {/* <div className="flex space-x-3 flex-row place-items-center">
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
                    <span className="text-sm text-stone-400  transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>

              <button
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
      </div> */}

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
                  className="border-b text-[12px]"
                  style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "rgb(84, 89, 95)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    color: "white",
                  }}
                >
                  <th className="pr-2 py-3 pl-4 w-14 text-left">
                    <span
                      className=" tracking-[0.2em] uppercase"
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
                      className="font-black tracking-[0.2em] uppercase"
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
                      className=" font-black tracking-[0.2em] uppercase"
                      style={{
                        color: "white",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Position
                    </span>
                  </th>
                  <th
                    className="py-3 pr-4 text-center"
                    style={{ minWidth: 160 }}
                  >
                    <span
                      className="text-center font-black tracking-[0.2em] uppercase"
                      style={{
                        color: "white",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Sector
                    </span>
                  </th>
                  <th
                    className="py-3 pr-4 text-center"
                    style={{ minWidth: 160 }}
                  >
                    <span
                      className="font-black tracking-[0.2em] uppercase"
                      style={{
                        color: "white",
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      Total Distance(KM)
                    </span>
                  </th>

                  <th className="pr-4 py-3 w-20" />
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {orderedData?.map((car, index) => {
                    const totalDistance =
                      car.pointToPointMileage.checkpoints.reduce(
                        (accumulator, currentItem) =>
                          accumulator + currentItem.mileage,
                        0,
                      );
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            paddingRight: 10,
                            whiteSpace: "nowrap",
                            paddingTop: 10,
                            paddingBottom: 10,
                          }}
                        >
                          <span
                            className="font-black text-sm tracking-widest px-2 rounded py-3 pr-3 text-[#46237A]"
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                            }}
                          >
                            {car.carNo}
                          </span>
                        </td>
                        <td
                          style={{
                            paddingRight: 10,
                            whiteSpace: "nowrap",
                            paddingTop: 3,
                            paddingBottom: 3,
                            // textAlign: "center",
                          }}
                        >
                          <span
                            className="font-black text-sm tracking-widest px-2 rounded py-3 pr-3 text-[#46237A]"
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                              textAlign: "center",
                            }}
                          >
                            {car.entrantName}
                          </span>
                        </td>
                        <td
                          style={{
                            paddingRight: 10,
                            whiteSpace: "nowrap",
                            paddingTop: 3,
                            paddingBottom: 3,
                            // textAlign: "center",
                          }}
                        >
                          <span
                            className="font-black text-sm tracking-widest px-2 rounded py-3 pr-3 text-[#46237A]"
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                              // textAlign: "center",
                            }}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td
                          className="text-center"
                          style={{
                            paddingRight: 10,
                            whiteSpace: "nowrap",
                            paddingTop: 3,
                            paddingBottom: 3,
                          }}
                        >
                          <span
                            className="font-black text-sm tracking-widest px-2 text-center rounded py-3 pr-3 text-[#46237A]"
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                              margin: "20px 0",
                            }}
                          >
                            {car.orderedCheckpoints.length}
                          </span>
                        </td>
                        <td
                          className="text-center"
                          style={{
                            paddingRight: 10,
                            whiteSpace: "nowrap",
                            paddingTop: 3,
                            paddingBottom: 3,
                          }}
                        >
                          <span
                            className="font-black text-sm tracking-widest px-2 rounded py-3 pr-3 text-[#46237A]"
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                            }}
                          >
                            {totalDistance.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-px flex-1" style={{ background: "#292524" }} />
        <span
          className="text-[9px] tracking-widest uppercase"
          style={{
            color: "#44403c",
            fontFamily: "'Oswald', sans-serif",
          }}
        ></span>
        <div className="h-px flex-1" style={{ background: "#292524" }} />
      </div>
    </div>
  );
};
export default Results;
