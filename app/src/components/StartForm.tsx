import { CHECKPOINTS } from "@/data";
import type { Driver } from "@/types";
import { motion } from "framer-motion";
import { useState } from "react";

const StartForm = ({ driver }: { driver: Driver; totalColumns: number }) => {
  const [selectedCP, setSelectedCP] = useState("");
  const [startTime, setStartTime] = useState("08:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      `Setting start for ${driver.id}: ${selectedCP} at ${startTime}`,
    );
  };
  return (
    // <td colSpan={totalColumns} className="p-0">
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden bg-[#1a1a1a] border-b border-white/5 w-full"
    >
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3
            className="text-amber-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
            Initialize Starting Checkpoint
          </h3>
          <div className="flex items-center gap-3">
            <label className="text-[10px] text-stone-500 uppercase font-bold">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-stone-900 border border-stone-700 text-amber-500 text-sm px-3 py-1 rounded focus:outline-none focus:border-amber-600"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            />
          </div>
        </div>

        {/* Radio Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {CHECKPOINTS.map((cp) => (
            <label
              key={cp}
              className={`
                  cursor-pointer group flex items-center gap-2 p-2 rounded border transition-all
                  ${
                    selectedCP === cp
                      ? "bg-amber-600/20 border-amber-600/50"
                      : "bg-stone-900/40 border-white/5 hover:border-white/20"
                  }
                `}
            >
              <input
                type="radio"
                name="checkpoint"
                value={cp}
                checked={selectedCP === cp}
                onChange={(e) => setSelectedCP(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedCP === cp ? "border-amber-500" : "border-stone-600"}`}
              >
                {selectedCP === cp && (
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] uppercase font-medium tracking-tight ${selectedCP === cp ? "text-amber-400" : "text-stone-400"}`}
              >
                {cp}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!selectedCP}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-30 disabled:hover:bg-amber-600 text-black font-black text-xs px-8 py-2 rounded uppercase tracking-widest transition-colors"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Confirm Start
          </button>
        </div>
      </form>
    </motion.div>
    // </td>
  );
};
export default StartForm;
