const { format } = require("date-fns");

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy");
};

module.exports = formatDate;
