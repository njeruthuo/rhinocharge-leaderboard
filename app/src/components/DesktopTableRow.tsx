import { CHECKPOINTS } from "@/data";
import type { DesktopRowType } from "@/types";
import { motion } from "framer-motion";

import React from "react";
import CheckpointCell from "./CheckpointCell";

const TD_V = 12;
const TD_CELL: React.CSSProperties = {
  paddingTop: TD_V,
  paddingBottom: TD_V,
  verticalAlign: "middle",
};

function DesktopTableRow({ driver, rank, isViewer }: DesktopRowType) {
  const totalCheckpoints = CHECKPOINTS.length + 1 || 0;
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
                    : "#FBFBFB",
          }}
        />
      </td>
      <td
        style={{
          ...TD_CELL,
          paddingRight: 10,
          whiteSpace: "nowrap",
          paddingTop: 3,
          paddingBottom: 3,
        }}
      >
        <span
          className="font-black text-sm tracking-widest px-2 rounded py-3 pr-3 text-[#46237A]"
          style={{
            background: "rgba(217,119,6,0.15)",
            // color: "#ED6A5E",
            border: "1px solid rgba(217,119,6,0.3)",
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          {driver.carNo}
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
          {driver.team_name}
        </div>
      </td>
      {CHECKPOINTS.map((cpName, index) => {
        const cpData = driver?.orderedCheckpoints?.find(
          (c) => c.point === cpName.toUpperCase(),
        ) || {
          point: cpName,
          odometer: 0,
          time: "",
          next: "",
        };

        return (
          <td
            key={index}
            style={{
              ...TD_CELL,
              width: 36,
              textAlign: "center",
              margin: 20,
            }}
          >
            <CheckpointCell
              isViewer
              cp={cpData}
              start_cp={driver?.start_cp || ""}
            />
          </td>
        );
      })}

      {isViewer && (
        <td
          style={{
            ...TD_CELL,
            paddingRight: 16,
            whiteSpace: "nowrap",
            paddingTop: 3,
            paddingBottom: 3,
            textAlign: "right",
          }}
        >
          <span className="font-black text-sm tracking-widest rounded py-3 text-[#46237A]">
            {new Intl.NumberFormat("en-US").format(driver?.mileage ?? 0)}
          </span>
        </td>
      )}

      {/* {isViewer && (
        <td
          style={{
            ...TD_CELL,
            paddingRight: 16,
            whiteSpace: "nowrap",
            paddingTop: 3,
            paddingBottom: 3,
            textAlign: "right",
          }}
        >
          <span className="font-black text-sm tracking-widest rounded py-3 pr-3 text-[#46237A]">
            {driver?.penalties ?? 0}
          </span>
        </td>
      )} */}

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
              color: rank === 1 ? "#3DDC97" : "#d6d3d1",
            }}
          >
            {driver.totalCps}
            <span className="text-[14px] font-semibold text-stone-600 ml-1">
              /{CHECKPOINTS.length + 1 || 0}
            </span>
          </span>
          <div className="w-16 h-0.5 rounded-full bg-stone-800">
            <motion.div
              className={`h-full rounded-full bg-green-500`}
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

export default DesktopTableRow;
