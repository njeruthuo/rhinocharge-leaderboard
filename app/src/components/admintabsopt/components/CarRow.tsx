import type { Driver } from "@/types";
// import { CHECKPOINTS } from "@/data";
// import CpCell from "./CpCell";
// import { select } from "framer-motion/client";

function CarRow({
  car,
  isExpanded,
  selectedCp,
  // onSelectCp,
}: {
  car: Driver;
  isExpanded: boolean;
  onToggle: () => void;
  selectedCp: string;
  onSelectCp: (cp: string) => void;
}) {
  // console.log(selectedCp, "selecyedCP");

  return (
    <>
      <tr
        className="border-b transition-colors cursor-pointer group"
        style={{
          borderColor: "rgba(255,255,255,0.04)",
          background: isExpanded ? "rgba(217,119,6,0.06)" : "transparent",
        }}
      >
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
              color: "rgba(28,25,23,0.7)",
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            {car.entrantName}
          </div>
          <div
            className="text-[10px] uppercase tracking-wider truncate mt-0.5"
            style={{ color: "#78716c" }}
          >
            {car.team_name}
          </div>
        </td>

        <td className="py-3 pr-4 text-sm" style={{ minWidth: 160 }}>
          <span style={{ color: "#78716c" }}> {selectedCp}</span>
        </td>
        <td className="py-3 pr-4 text-sm" style={{ minWidth: 160 }}>
          <span style={{ color: "#78716c" }}> {}</span>
        </td>
        <td className="py-3 pr-4 text-sm" style={{ minWidth: 160 }}>
          <span style={{ color: "#78716c" }}> {}</span>
        </td>
        <td className="py-3 pr-4 text-sm" style={{ minWidth: 160 }}>
          <span style={{ color: "#78716c" }}> {}</span>
        </td>
      </tr>
    </>
  );
}
export default CarRow;
