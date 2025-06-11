/**
 * Converts a number of minutes to a formatted time string (HH:MM).
 * @param {number} minutesAmount - The amount of minutes to convert.
 * @returns {string} The formatted time string in "HH:MM" format.
 * @example
 * setTimeFromMinutesAmount(75); // "01:15"
 */
export const setTimeFromMinutesAmount = (minutesAmount: number): string => {
  const hours = Math.floor(minutesAmount / 60);
  const minutes = minutesAmount % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

/**
 * Converts a formatted time string (HH:MM) to the total number of minutes.
 * @param {string} timeString - The time string in "HH:MM" format.
 * @returns {number} The total number of minutes.
 * @example
 * getMinutesFromTime("01:15"); // 75
 */
export const getMinutesFromTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};
