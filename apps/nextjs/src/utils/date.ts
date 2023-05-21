export function formatDateSince(timestampMS: number) {
  const curDate = new Date().getTime();
  const ms = curDate - timestampMS;
  let timeDiff = 0;
  let unit = "";
  if (ms >= 2592000000) {
    timeDiff = Math.floor(ms / 2592000000);
    unit = " month";
  } else if (ms >= 604800000) {
    timeDiff = Math.floor(ms / 604800000);
    unit = " week";
  } else if (ms >= 86400000) {
    timeDiff = Math.floor(ms / 86400000);
    unit = " day";
  } else if (ms >= 3600000) {
    timeDiff = Math.floor(ms / 3600000);
    unit = " hour";
  } else {
    timeDiff = Math.floor(ms / 3600000);
    unit = " minute";
  }
  return timeDiff.toString() + unit + (timeDiff > 1 ? "s" : "");
}
