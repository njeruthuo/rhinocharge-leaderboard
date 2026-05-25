import { colors, permanentColors } from "@/constants";
import type { CheckPoint } from "@/types";
import { getCheckpointStatus } from "@/utils";

function CheckpointCell({
  cp,
  start_cp,
  isViewer,
  completeTrip,
}: {
  cp: CheckPoint;
  mileage: number;
  start_cp: string;
  isViewer: boolean;
  completeTrip: boolean;
}) {
  if (start_cp === cp.point) {
    return (
      <div className="flex flex-col items-center justify-center min-w-[40px] gap-0.5 mt-0.5 ">
        <div
          className={`${completeTrip ? "px-1 py-0" : `${permanentColors.start} px-1 py-0.5`} rounded  w-full`}
        >
          <span
            className={`text-white text-[11px] block leading-none text-center py-0.5 rounded ${completeTrip ? permanentColors.complete : colors.primary}`}
          >
            {cp.time}
          </span>
        </div>

        {isViewer && (
          <div className="w-full">
            <span className="text-stone-500 font-mono text-[11px] block leading-none text-center opacity-80">
              {completeTrip ? cp?.distanceFromBase?.toFixed(2) : 0}
            </span>
          </div>
        )}

        <div
          className={`w-full h-0.5  rounded-full mt-0.5 ${completeTrip ? permanentColors.complete : permanentColors.start}`}
        />
      </div>
    );
  }

  const status = getCheckpointStatus(cp);

  if (status === "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-w-[40px] gap-0.5 mx-2">
        {cp.time && (
          <div className={`${colors.bgPale} rounded px-1 py-0.5 w-full`}>
            <span
              className={`font-black text-[11px] block leading-none text-center ${colors.primary}`}
            >
              {cp?.time}
              {/* {convertTo24Hour(cp?.time)} */}
            </span>
          </div>
        )}

        {isViewer && (
          <div className="w-full">
            <span className="text-stone-500 font-mono text-[11px] block leading-none text-center opacity-80">
              {new Intl.NumberFormat("en-US").format(cp?.distanceFromBase || 0)}
            </span>
          </div>
        )}

        <div
          className={`w-full h-0.5  rounded-full mt-0.5 ${completeTrip ? permanentColors.complete : colors.pale}`}
        />
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="flex flex-col items-center justify-center py-2 mx-2">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-[#EF476F] animate-ping opacity-20" />
          <div className="w-3 h-3 rounded-full bg-[#EF476F] border border-[#EF476F] flex items-center justify-center shadow-[0_0_12px_#38bdf8]">
            <span className="w-1 h-1 rounded-full bg-white" />
          </div>
        </div>
        <span className="text-sky-400 text-[7px] font-black mt-1 tracking-tighter">
          NEXT
        </span>
      </div>
    );
  }

  // Pending State
  return (
    <div className="flex items-center justify-center opacity-20">
      <div className="w-1 h-4 bg-stone-700 rounded-full" />
    </div>
  );
}
export default CheckpointCell;
