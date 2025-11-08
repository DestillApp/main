const { escape, trim, toFloat, toInt } = require("validator");

/**
 * @function sanitizeDistillationInput
 * @description Sanitizes and validates distillation input data for security.
 * @param {Object} input - Raw distillation input data from GraphQL
 * @returns {Object} Sanitized distillation data safe for database storage
 */
function sanitizeDistillationInput(input) {
  return {
    choosedPlant: {
      id: input.choosedPlant.id ? escape(trim(input.choosedPlant.id)) : "",
      name: escape(trim(input.choosedPlant.name || "")),
      part: escape(trim(input.choosedPlant.part || "")),
      availableWeight:
        input.choosedPlant.availableWeight !== null && input.choosedPlant.availableWeight !== undefined
          ? toFloat(String(input.choosedPlant.availableWeight))
          : null,
      harvestDate: input.choosedPlant.harvestDate
        ? escape(trim(input.choosedPlant.harvestDate))
        : "",
      buyDate: input.choosedPlant.buyDate
        ? escape(trim(input.choosedPlant.buyDate))
        : "",
    },
    weightForDistillation:
      input.weightForDistillation !== null && input.weightForDistillation !== undefined
        ? toFloat(String(input.weightForDistillation))
        : null,
    isPlantSoaked: Boolean(input.isPlantSoaked),
    soakingTime:
      input.soakingTime !== null && input.soakingTime !== undefined
        ? toInt(String(input.soakingTime))
        : null,
    weightAfterSoaking:
      input.weightAfterSoaking !== null && input.weightAfterSoaking !== undefined
        ? toFloat(String(input.weightAfterSoaking))
        : null,
    isPlantShredded: Boolean(input.isPlantShredded),
    distillationType: escape(trim(input.distillationType || "")),
    distillationDate: escape(trim(input.distillationDate || "")),
    distillationApparatus: escape(trim(input.distillationApparatus || "")),
    waterForDistillation:
      input.waterForDistillation !== null && input.waterForDistillation !== undefined
        ? toInt(String(input.waterForDistillation))
        : null,
    distillationTime: input.distillationTime
      ? {
          distillationHours:
            input.distillationTime.distillationHours !== null &&
            input.distillationTime.distillationHours !== undefined
              ? toInt(String(input.distillationTime.distillationHours))
              : null,
          distillationMinutes:
            input.distillationTime.distillationMinutes !== null &&
            input.distillationTime.distillationMinutes !== undefined
              ? toInt(String(input.distillationTime.distillationMinutes))
              : null,
        }
      : null,
  };
}

module.exports = { sanitizeDistillationInput };