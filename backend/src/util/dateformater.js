/**
 * @module util/dateformater
 * @description Date formatting utility functions.
 */

const { format } = require("date-fns");

/**
 * @function formatDate
 * @description Formats a date string to DD-MM-YYYY format.
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date in DD-MM-YYYY format
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy");
};

/**
 * @function formatDateToString
 * @description Converts a date string to a readable string format.
 * @param {string} dateString - The date string to convert
 * @returns {string} Date as a readable string
 */
const formatDateToString = (dateString) => {
  const date = new Date(dateString);
  return date.toString();
};

/**
 * @function parseDDMMYYYYtoDate
 * @description Parses DD-MM-YYYY format to ISO date string.
 * @param {string} dateString - Date string in DD-MM-YYYY format
 * @returns {string} ISO date string
 */
const parseDDMMYYYYtoDate = (dateString) =>  {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`).toISOString();
}

module.exports = { formatDate, formatDateToString, parseDDMMYYYYtoDate };
