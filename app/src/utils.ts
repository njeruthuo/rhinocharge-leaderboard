import type { TripRecord } from "./state/types";
import type {
  CheckPoint,
  CheckPointType,
  DataTypeCheckPoint,
  // DateDataType,
  DeviceData,
  MileageResultsList,
  PointToPointType,
  RowStatus,
} from "./types";

export function getParsedTime(dateTime: string) {
  const regex = /(\d{1,2}:\d{2})(?::\d{2})?\s+([AP]M)/;

  const match = dateTime.match(regex);

  if (match) {
    return `${match[1]}${match[2]}`;
  }
  return dateTime;
}

export function parseTime(dateTime: string) {
  const dateObj = new Date(dateTime);

  dateObj.setHours(dateObj.getHours() + 3);

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(dateObj);
}

export function convertTo24Hour(timeStr: string) {
  const modifier = timeStr.slice(-2).toUpperCase();
  // eslint-disable-next-line prefer-const
  let [hours, minutes] = timeStr.slice(0, -2).split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  const paddedHours = hours.toString().padStart(2, "0");

  return `${paddedHours}:${minutes}`;
}

function orderAndReturnUniqueCheckPoints(
  checkpointList: TripRecord[],
  start_cp_name: string,
) {
  if (!checkpointList || checkpointList.length === 0) return [];

  const normalizedStartName = start_cp_name.toLowerCase().trim();

  // 1. Get all checkpoints EXCEPT the starting ones, and sort them
  const orderedCheckPoints = [...checkpointList]
    .filter(
      (checkpoint) =>
        checkpoint.poi_name?.toLowerCase().trim() !== normalizedStartName,
    )
    .sort((a, b) => {
      return (
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
    });

  // 2. Gather all potential start checkpoints (normalized to lowercase)
  const startCp = checkpointList.filter(
    (checkpoint) =>
      checkpoint.poi_name?.toLowerCase().trim() === normalizedStartName,
  );

  // 3. Deduplicate the non-start checkpoints
  const seenNames = new Set<string>();
  const uniqueCheckPoints: TripRecord[] = [];

  orderedCheckPoints.forEach((checkpoint) => {
    const normalizedName = checkpoint?.poi_name?.toLowerCase().trim();
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName);
      uniqueCheckPoints.push(checkpoint);
    }
  });

  if (startCp.length > 0) {
    if (startCp.length > 1) {
      const findClosestCheckpoint = (
        targetHour: number,
        targetMinute: number,
        direction: "forward" | "backward",
      ): TripRecord | null => {
        let closestCp: TripRecord | null = null;
        let minDifference = Infinity;
        const ONE_HOUR_MS = 60 * 60 * 1000;

        startCp.forEach((cp) => {
          const cpDate = new Date(cp.start_time);

          const targetDate = new Date(cpDate);
          targetDate.setHours(targetHour, targetMinute, 0, 0);

          const differenceInMs = cpDate.getTime() - targetDate.getTime();

          if (direction === "forward") {
            if (differenceInMs >= 0 && differenceInMs <= ONE_HOUR_MS) {
              if (differenceInMs < minDifference) {
                minDifference = differenceInMs;
                closestCp = cp;
              }
            }
          } else if (direction === "backward") {
            const absoluteDifference = Math.abs(differenceInMs);
            if (differenceInMs <= 0 && absoluteDifference <= ONE_HOUR_MS) {
              if (absoluteDifference < minDifference) {
                minDifference = absoluteDifference;
                closestCp = cp;
              }
            }
          }
        });

        return closestCp;
      };

      // Update your function calls to pass the direction parameter:
      const morningCp = findClosestCheckpoint(7, 30, "forward"); // 7:30 AM to 8:30 AM
      const eveningCp = findClosestCheckpoint(17, 30, "backward");

      if (morningCp) uniqueCheckPoints.push(morningCp);

      // Prevent pushing the exact same record twice if one record somehow fits both (unlikely, but safe)
      if (eveningCp && eveningCp !== morningCp)
        uniqueCheckPoints.push(eveningCp);

      // --- END OF NEW TIME-MATCHING LOGIC ---
    } else {
      // If there's only 1 start checkpoint, just push it
      uniqueCheckPoints.push(startCp[0]);
    }

    // 5. Final sort to integrate the added start checkpoints back into chronological order
    uniqueCheckPoints.sort((a, b) => {
      return (
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
    });
  }

  return uniqueCheckPoints;
}

// function orderAndReturnUniqueCheckPointsForP2P(
//   checkpointList: TripRecord[],
//   // start_cp_name: string,
// ) {
//   if (!checkpointList || checkpointList.length === 0) return [];

//   return [...checkpointList].sort(
//     (a, b) =>
//       new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
//   );
// }

function orderAndReturnUniqueCheckPointsForP2P(
  checkpointList: TripRecord[],
  start_cp_name: string,
): TripRecord[] {
  if (!checkpointList || checkpointList.length === 0) return [];

  const normalizedStartName = start_cp_name.toLowerCase().trim();

  // Sort everything chronologically first
  const sorted = [...checkpointList].sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );

  const isStartCp = (cp: TripRecord) =>
    cp.poi_name?.toLowerCase().trim() === normalizedStartName;

  // Trim leading duplicates of the start CP — keep only the last one (most recent before the route begins)
  let leadStart = 0;
  while (
    leadStart < sorted.length - 1 &&
    isStartCp(sorted[leadStart]) &&
    isStartCp(sorted[leadStart + 1])
  ) {
    leadStart++;
  }

  // Trim trailing duplicates of the start/end CP — keep only the first one (earliest after route ends)
  let trailEnd = sorted.length - 1;
  while (
    trailEnd > leadStart + 1 &&
    isStartCp(sorted[trailEnd]) &&
    isStartCp(sorted[trailEnd - 1])
  ) {
    trailEnd--;
  }

  return sorted.slice(leadStart, trailEnd + 1);
}

export function isOpen(
  index: number,
  rowStatus: RowStatus,
  pathname: string = "",
) {
  return Boolean(rowStatus?.[index]) && pathname === "/management/admin";
}

export function getCheckpointStatus(
  cp: CheckPoint,
): "completed" | "active" | "pending" {
  if (cp?.next && cp?.next !== "") return "active";
  if (cp?.time && cp?.time !== "") return "completed";
  return "pending";
}

export function calculateHistory(
  checkpointList: TripRecord[],
  start_cp: string,
  startOdometer: number,
): DataTypeCheckPoint[] {
  const baseOdometer = startOdometer;

  // const seenNames = new Set();
  const uniqueCheckPoints: TripRecord[] = orderAndReturnUniqueCheckPoints(
    checkpointList,
    start_cp,
  );

  // orderedCheckPoints?.forEach((checkpoint) => {
  //   const normalizedName = checkpoint?.poi_name?.toLowerCase().trim();
  //   if (!seenNames.has(normalizedName)) {
  //     seenNames.add(normalizedName);
  //     uniqueCheckPoints.push(checkpoint);
  //   }
  // });

  return uniqueCheckPoints.map((checkpoint, index) => {
    const time = parseTime(checkpoint?.start_time)?.split(":");

    let calculatedOdometer = 0;

    // RULE 1: If it's the designated start checkpoint, calculated is ALWAYS 0
    if (
      checkpoint.poi_name.toLowerCase().trim() === start_cp.toLowerCase().trim()
    ) {
      calculatedOdometer = 0;
    }
    // RULE 2: For the very first chronological point (if it's not the start_cp)
    else if (index === 0) {
      calculatedOdometer = checkpoint.start_odo - baseOdometer;
    }
    // RULE 3: Every subsequent point subtracts the previous checkpoint's odometer
    else {
      // calculatedOdometer =
      //   checkpoint.start_odo - orderedCheckPoints[index - 1].start_odo;
      calculatedOdometer =
        checkpoint.start_odo - uniqueCheckPoints[index - 1].start_odo;
    }

    // Force negative segment deltas to 0 (handles edge-case anomalies)
    if (calculatedOdometer < 0) calculatedOdometer = 0;

    // NEW LOGIC: Calculate cumulative distance from the designated start point baseline
    // Math.abs handles scenarios where a tracked point chronologically occurred *before* the official start line
    const distanceFromBase = Math.abs(checkpoint.start_odo - baseOdometer);

    return {
      point: checkpoint?.poi_name?.toUpperCase(),
      odometer: checkpoint?.start_odo,
      time: `${time[0]}:${time[1]}`,
      calculated_odometer: calculatedOdometer,
      distanceFromBase: distanceFromBase, // <-- Added here
      next: "",
      startOdometer: baseOdometer,
    };
  });
}

export function formatDate(
  dateString: Date | string,
  subtract: boolean = false,
) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  // Months are 0-indexed in JS, so we add 1
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(
    subtract ? date.getHours() - 3 : date.getHours(),
  ).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDateWithZ(
  dateString: Date | string,
  subtract: boolean = false,
) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  // Months are 0-indexed in JS, so we add 1
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(
    subtract ? date.getHours() - 3 : date.getHours(),
  ).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");

  // return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  return `${year}-${month}-${day}T${hours}:${minutes}:00Z`;
}

export async function calculatePointToPointMileage(
  checkpointList: TripRecord[],
  getMovementSummary: (dates: DeviceData) => Promise<unknown>, // Changed to any to comfortably read RTK .data wrapper
  resolvedTime: boolean,
  deviceID: string,
  assetNumber: string,
  start_cp_name: string,
): Promise<PointToPointType> {
  const uniqueCheckPoints: TripRecord[] = orderAndReturnUniqueCheckPointsForP2P(
    checkpointList,
    start_cp_name,
  );

  const summaryPromises = [];

  const segmentMetadata: {
    checkpoint1Name: string;
    checkpoint2Name: string;
  }[] = [];

  for (let i = 0; i < uniqueCheckPoints.length - 1; i++) {
    const currentPoint = uniqueCheckPoints[i];
    const nextPoint = uniqueCheckPoints[i + 1];

    if (currentPoint.start_time && nextPoint.start_time) {
      const payload: DeviceData = {
        startDate: formatDateWithZ(currentPoint.start_time),
        endDate: formatDateWithZ(nextPoint.start_time),
        isBackup: resolvedTime,
        deviceID: deviceID,
        // info: `startDate: ${formatDateWithZ(currentPoint.start_time)} at: ${currentPoint.poi_name}, endDate: ${formatDateWithZ(nextPoint.start_time)} at: ${nextPoint.poi_name} `,
      };

      summaryPromises.push(getMovementSummary(payload));

      // Save names from the current loop context (adjust currentPoint.name / nextPoint.name to match your TripRecord structure)
      segmentMetadata.push({
        checkpoint1Name: currentPoint.poi_name || `Point ${i + 1}`,
        checkpoint2Name: nextPoint.poi_name || `Point ${i + 2}`,
      });
    }
  }

  try {
    const results = await Promise.all(summaryPromises);

    // Map through results and construct the CheckPointType objects
    const checkpoints: CheckPointType[] = results.map((res, index) => {
      // RTK Query mutations encapsulate payload data inside a .data field
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const apiData: MileageResultsList[] = res.data ?? [];

      // Extract mileage safely from the first list element if it exists
      const totalMileage = apiData.length > 0 ? apiData[0].mileage : 0;
      const metadata = segmentMetadata[index];

      return {
        Checkpoint1: metadata.checkpoint1Name,
        Checkpoint2: metadata.checkpoint2Name,
        mileage: totalMileage,
      };
    });

    return {
      assetName: assetNumber,
      checkpoints: checkpoints,
    };
  } catch (error) {
    console.error("Failed to fetch mileage segments:", error);
    throw error;
  }
}
