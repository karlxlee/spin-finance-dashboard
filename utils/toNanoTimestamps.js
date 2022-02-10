export default function toNanoTimestamps({
  startTimestamp,
  endTimestamp,
  lastHours,
}) {
  let startNanoTimestamp;
  let endNanoTimestamp;
  if (lastHours) {
    endNanoTimestamp = Math.round(new Date().getTime() * 10 ** 6);
    startNanoTimestamp = endNanoTimestamp - lastHours * 60 * 60 * 10 ** 9;
  } else {
    startNanoTimestamp = startTimestamp * 10 ** 9;
    endNanoTimestamp = endTimestamp * 10 ** 9;
  }
  return [startNanoTimestamp, endNanoTimestamp];
}
