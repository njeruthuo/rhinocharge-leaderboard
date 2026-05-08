import type { TripRecord } from "./state/types";
import type { CheckPoint, RowStatus } from "./types";

export function getParsedTime(dateTime: string) {
  const regex = /(\d{1,2}:\d{2})(?::\d{2})?\s+([AP]M)/;

  const match = dateTime.match(regex);

  if (match) {
    return `${match[1]}${match[2]}`;
  }
  return dateTime;
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
) {
  const startCheckPoint = checkpointList?.find(
    (checkpoint) =>
      checkpoint.poi_name.toLowerCase().trim() ===
      start_cp.toLowerCase().trim(),
  );

  // Order the checkpoints using time
  const orderedCheckPoints = checkpointList.sort((a, b) => {
    const timeA = new Date(a.start_time);
    const timeB = new Date(b.start_time);
    return timeB.getTime() - timeA.getTime();
  });

  // Create a new item in the checkpoints that contains the differences between points
  return orderedCheckPoints.map((checkpoint) => ({
    ...checkpoint,
    point: checkpoint?.poi_name?.toUpperCase(),
    odometer: checkpoint?.start_odo,
    time: getParsedTime(checkpoint?.start_time),
    calculated_odometer:
      checkpoint.start_odo - (startCheckPoint?.start_odo || 0),
    next: "",
  }));
}
