export function getParsedTime(dateTime: string) {
  const regex = /(\d{1,2}:\d{2})(?::\d{2})?\s+([AP]M)/;

  const match = dateTime.match(regex);

  if (match) {
    return `${match[1]}${match[2]}`;
  }
  return dateTime;
}
