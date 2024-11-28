const filterData = (data) => {
  const filteredData = {};

  const filterNestedData = (obj) => {
    const filteredNestedData = {};
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== "") {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          filteredNestedData[key] = filterNestedData(obj[key]);
        } else {
          filteredNestedData[key] = obj[key];
        }
      }
    }
    return filteredNestedData;
  };

  for (const key in data) {
    if (data[key] !== null && data[key] !== "") {
      if (typeof data[key] === "object" && !Array.isArray(data[key])) {
        filteredData[key] = filterNestedData(data[key]);
      } else {
        filteredData[key] = data[key];
      }
    }
  }

  return filteredData;
};

module.exports = { filterData };
