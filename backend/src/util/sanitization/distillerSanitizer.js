const { escape, trim, toInt } = require("validator");

/**
 * @function sanitizeDistillerInput
 * @description Sanitizes and validates distiller input data for security.
 * @param {Object} input - Raw distiller input data from GraphQL
 * @returns {Object} Sanitized distiller data safe for database storage
 */
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