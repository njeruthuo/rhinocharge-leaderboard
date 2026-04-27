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
