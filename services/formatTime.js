function convertTo24HourFormat(timeString) {
  const [time, period] = timeString.split(" ");
  const [hours, minutes] = time.split(":");

  let hours24 = parseInt(hours, 10);

  if (period.toLowerCase() === "pm" && hours24 < 12) {
    hours24 += 12;
  } else if (period.toLowerCase() === "am" && hours24 === 12) {
    hours24 = 0;
  }

  const formattedTime = `${hours24.toString().padStart(2, "0")}:${minutes}:00`;
  return formattedTime;
}

module.exports = {
  convertTo24HourFormat,
};
