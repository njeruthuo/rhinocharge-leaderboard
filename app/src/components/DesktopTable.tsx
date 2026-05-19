import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useLocation } from "react-router-dom";
import React from "react";
import type { Driver, RowStatus } from "@/types";
import { CHECKPOINTS } from "@/data";
import { isOpen } from "@/utils";
import DesktopTableRow from "./DesktopTableRow";
import StartForm from "./StartForm";

function DesktopTable({
  drivers,
  isViewer,
}: {
  drivers: Driver[];
  isViewer: boolean;
}) {
  const [rowStatus, setRowStatus] = useState<RowStatus>({ 1: false });
  const { pathname } = useLocation();

  return (
    <div
      className="w-full rounded-xl border"
      style={{
        borderColor: "rgba(217,119,6,0.15)",
        backdropFilter: "blur(8px)",
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "78vh",
      }}
    >
      <table className="overflow-x-auto no-scrollbar w-full">
        <thead>
          <tr
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#D9D7D7",
            }}
            className="text-sky-600 bg-gray-200 space-x-2"
          >
            <th
              className="w-1"
              style={{ borderBottom: "1px solid rgba(217,119,6,0.15)" }}
            />
            <th
              className="py-3 pr-4 text-left"
              style={{ borderBottom: "1px solid rgba(217,119,6,0.15)" }}
            >
              <span className="text-[9px] font-bold tracking-[0.2em]  uppercase">
                Car
              </span>
            </th>
            <th
              className="py-3 pr-6 text-left"
              style={{ borderBottom: "1px solid rgba(217,119,6,0.15)" }}
            >
              <span className="text-[9px] font-bold tracking-[0.2em]  uppercase">
                Driver / Team
              </span>
            </th>
            {CHECKPOINTS.map((cp) => (
              <th
                className=""
                key={cp}
                style={{
                  width: 36,
                  minWidth: 60,
                  padding: "12px 16px 8px",

                  textAlign: "center",
                  verticalAlign: "bottom",
                  borderBottom: "1px solid rgba(217,119,6,0.15)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span
                    className="text-[9px] font-bold tracking-widest uppercase text-sky-600"
                    style={{
                      display: "block",
                      lineHeight: 1,
                      writingMode: "vertical-rl",
                      transform: "rotate(210deg)",
                      transformOrigin: "center center",
                      whiteSpace: "nowrap",
                      marginRight: 4,
                      marginLeft: 4,
                    }}
                  >
                    {cp}
                  </span>
                </div>
              </th>
            ))}

            {isViewer && (
              <th
                className="py-3 pl-2 pr-2 text-right"
                style={{ borderBottom: "1px solid rgba(217,119,6,0.15)" }}
              >
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
                  mil.
                </span>
              </th>
            )}

            {/* {isViewer && (
              <th
                className="py-3 pl-2 pr-2 text-right"
                style={{ borderBottom: "1px solid rgba(217,119,6,0.15)" }}
              >
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
                  penalty
                </span>
              </th>
            )} */}

            <th
              className="py-3 pl-2 pr-1 text-right"
              style={{ borderBottom: "1px solid rgba(217,119,6,0.15)" }}
            >
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
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
                <React.Fragment key={driver.id}>
                  <motion.tr
                    onClick={() =>
                      setRowStatus((prev) => ({
                        [index]: !prev?.[index],
                      }))
                    }
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
                    <DesktopTableRow
                      isViewer={isViewer}
                      driver={driver}
                      rank={rank}
                      open={isOpen(index, rowStatus, pathname)}
                      setOpen={setRowStatus}
                      id={index}
                      checkpoints={driver.checkpoints}
                    />
                  </motion.tr>
                  <AnimatePresence>
                    {isOpen(index, rowStatus, pathname) && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td
                          colSpan={CHECKPOINTS.length + 6}
                          style={{ padding: 0 }}
                        >
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{ width: "100%" }}>
                              <StartForm
                                driver={driver}
                                totalColumns={CHECKPOINTS.length + 6}
                              />
                            </div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </AnimatePresence>
      </table>
    </div>
  );
}
export default DesktopTable;
