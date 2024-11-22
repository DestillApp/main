// Sets the time format based on the given minutes amount
// Parameters:
// - minutesAmount: The amount of minutes
// Returns: The formatted time string (HH:MM)
export const setTimeFromMinutesAmount = (minutesAmount) => {
  const hours = Math.floor(minutesAmount / 60);
  const minutes = minutesAmount % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

export const getMinutesFromTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};
