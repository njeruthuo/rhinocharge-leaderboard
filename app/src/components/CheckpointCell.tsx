import { colors, permanentColors } from "@/constants";
import type { CheckPoint, Driver } from "@/types";
import { memo } from "react";
// import { getCheckpointStatus } from "@/utils";

function CheckpointCell({
  cp,
  start_cp,
  isViewer,
  completeTrip,
  driver,
}: {
  cp: CheckPoint;
  mileage: number;
  start_cp: string;
  isViewer: boolean;
  completeTrip: boolean;
  driver: Driver;
}) {
  const specificItem = driver.orderedCheckpoints.find(
    (item) => item.point === start_cp,
  );

  if (start_cp === cp.point) {
    // console.log("====================================");
    // console.log(`Car: ${driver.carNo}`);
    // console.log(` start Odometer: ${cp.startOdometer}`);
    // console.log(`odometer: ${cp.odometer}`);
    // console.log(`Start Cp: ${start_cp}`);
    // console.log(`specificItem: `, specificItem);
    // console.log(`checkpoint information: ${start_cp}`);
    // console.log(`start_cp === cp.point: ${start_cp === cp.point}`);
    // console.log(`Driver object: `, driver);
    // console.log("====================================");

    return (
      <div className="flex flex-col items-center justify-center min-w-10 gap-0.5 mt-0.5 ">
        <div
          className={`${completeTrip ? "px-1 py-0" : `${permanentColors.start} px-1 py-0.5`} rounded  w-full`}
        >
          <span
            className={`text-white text-[11px] block leading-none text-center py-0.5 rounded ${completeTrip ? permanentColors.complete : colors.primary}`}
          >
            {specificItem ? specificItem?.time : cp.time ? cp.time : "7:30"}
          </span>
        </div>

        {isViewer && (
          <div className="w-full">
            <span className="text-stone-500 font-mono text-[11px] block leading-none text-center opacity-80">
              {completeTrip
                ? cp?.distanceFromBase?.toFixed(3)
                : specificItem
                  ? specificItem?.distanceFromBase?.toFixed(3)
                  : 0}
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
      {cp.time && specificItem && (
        <div className={`${colors.bgPale} rounded px-1 py-0.5 w-full`}>
          <span
            className={`font-black text-[11px] block leading-none text-center ${colors.primary}`}
          >
            {cp?.time ?? specificItem.time}
          </span>
        </div>
      )}

      {isViewer && (
        <div className="w-full">
          <span className="text-stone-500 font-mono text-[11px] block leading-none text-center opacity-80">
            {new Intl.NumberFormat("en-US").format(
              cp?.distanceFromBase || cp.odometer,
            )}
          </span>
        </div>
      )}

      <div
        className={`w-full h-0.5  rounded-full mt-0.5 ${completeTrip ? permanentColors.complete : colors.pale}`}
      />
    </div>
  );
}
export default memo(CheckpointCell);
