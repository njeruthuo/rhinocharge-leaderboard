import type { TripRecord } from "./state/types";
import type { CheckPoint, DataTypeCheckPoint, RowStatus } from "./types";

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
  // 1. Sort the checkpoints chronologically by time first
  const orderedCheckPoints = [...checkpointList].sort((a, b) => {
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  // 2. Find the start checkpoint from the SORTED list to know its exact chronological position
  // const startCpIndex = orderedCheckPoints.findIndex(
  //   (checkpoint) =>
  //     checkpoint.poi_name.toLowerCase().trim() ===
  //     start_cp.toLowerCase().trim(),
  // );

  // console.log(startCpIndex, "startCpIndex");

  // Fallback to 0 if the start_cp isn't found
  // const baseStartCp =
  //   startCpIndex !== -1
  //     ? orderedCheckPoints[startCpIndex]
  //     : orderedCheckPoints[0];

  // const baseOdometer = baseStartCp?.start_odo || 0;
  const baseOdometer = startOdometer;

  const seenNames = new Set();
  const uniqueCheckPoints: TripRecord[] = [];

  orderedCheckPoints?.forEach((checkpoint) => {
    const normalizedName = checkpoint?.poi_name?.toLowerCase().trim();
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName);
      uniqueCheckPoints.push(checkpoint);
    }
  });

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
      calculatedOdometer =
        checkpoint.start_odo - orderedCheckPoints[index - 1].start_odo;
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
