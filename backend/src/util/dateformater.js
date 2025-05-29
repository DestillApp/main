const { format } = require("date-fns");

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy");
};

const formatDateToString = (dateString) => {
  const date = new Date(dateString);
  return date.toString();
};

const parseDDMMYYYYtoDate = (dateString) =>  {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`).toISOString();
}

module.exports = { formatDate, formatDateToString, parseDDMMYYYYtoDate };
