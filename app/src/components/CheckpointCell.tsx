import { colors, permanentColors } from "@/constants";
import type { CheckPoint } from "@/types";
// import { getCheckpointStatus } from "@/utils";

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
              {completeTrip ? cp?.distanceFromBase?.toFixed(3) : 0}
            </span>
          </div>
        )}

        <div
          className={`w-full h-0.5  rounded-full mt-0.5 ${completeTrip ? permanentColors.complete : permanentColors.start}`}
        />
      </div>
    );
  }

  // const status = getCheckpointStatus(cp);

  return (
    <div className="flex flex-col items-center justify-center min-w-[40px] gap-0.5 mx-2">
      {cp.time && (
        <div className={`${colors.bgPale} rounded px-1 py-0.5 w-full`}>
          <span
            className={`font-black text-[11px] block leading-none text-center ${colors.primary}`}
          >
            {cp?.time}
          </span>
        </div>
      )}

      {isViewer && (
        <div className="w-full">
          <span className="text-stone-500 font-mono text-[11px] block leading-none text-center opacity-80">
            {new Intl.NumberFormat("en-US").format(cp?.distanceFromBase || cp.odometer)}
          </span>
        </div>
      )}

      <div
        className={`w-full h-0.5  rounded-full mt-0.5 ${completeTrip ? permanentColors.complete : colors.pale}`}
      />
    </div>
  );
}
export default CheckpointCell;
