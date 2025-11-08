const { escape, trim } = require("validator");

/**
 * @function sanitizePlantInput
 * @description Sanitizes and validates plant input data for security.
 * @param {Object} input - Raw plant input data from GraphQL
 * @returns {Object} Sanitized plant data safe for database storage
 */
function sanitizePlantInput(input) {
  return {
    plantName: escape(trim(input.plantName || "")),
    plantPart: escape(trim(input.plantPart || "")),
    plantOrigin: escape(trim(input.plantOrigin || "")),
    plantBuyDate: input.plantBuyDate ? escape(trim(input.plantBuyDate)) : "",
    plantProducer: input.plantProducer ? escape(trim(input.plantProducer)) : "",
    countryOfOrigin: input.countryOfOrigin ? escape(trim(input.countryOfOrigin)) : "",
    harvestDate: input.harvestDate ? escape(trim(input.harvestDate)) : "",
    harvestTemperature: input.harvestTemperature ? parseFloat(input.harvestTemperature) : null,
    harvestStartTime: input.harvestStartTime ? escape(trim(input.harvestStartTime)) : "",
    harvestEndTime: input.harvestEndTime ? escape(trim(input.harvestEndTime)) : "",
    plantWeight: input.plantWeight ? parseFloat(input.plantWeight) : null,
    availableWeight: input.availableWeight ? parseFloat(input.availableWeight) : null,
    plantState: escape(trim(input.plantState || "")),
    dryingTime: input.dryingTime ? parseFloat(input.dryingTime) : null,
    plantAge: input.plantAge ? parseFloat(input.plantAge) : null,
  };
}

module.exports = { sanitizePlantInput };