const { escape, trim, toInt } = require("validator");

function sanitizeDistillerInput(input) {
  return {
    material: escape(trim(input.material || "")),
    capacity: input.capacity !== null && input.capacity !== undefined
      ? toInt(String(input.capacity))
      : null,
    heating: escape(trim(input.heating || "")),
  };
}

module.exports = { sanitizeDistillerInput };