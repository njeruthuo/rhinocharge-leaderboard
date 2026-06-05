import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoading = useMemo(() => {
    return data.length < 1 && (LoadingVehicleList || LoadingCheckPoints);
  }, [data, LoadingVehicleList, LoadingCheckPoints]);

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

  const orderedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (b.totalCps !== a.totalCps) return b.totalCps - a.totalCps;

      const totalDistanceA = a.pointToPointMileage.checkpoints.reduce(
        (accumulator, currentItem) => accumulator + currentItem.mileage,
        0,
      );
      const totalDistanceB = a.pointToPointMileage.checkpoints.reduce(
        (accumulator, currentItem) => accumulator + currentItem.mileage,
        0,
      );

      return totalDistanceA - totalDistanceB;
    });
  }, [data]);

  return (
    <div>
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
                            {car.orderedCheckpoints.length > 1
                              ? car.orderedCheckpoints.length - 1
                              : 0}
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
