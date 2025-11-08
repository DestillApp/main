const { escape, trim, toFloat, toInt } = require("validator");

/**
 * @function sanitizeDistillationInput
 * @description Sanitizes and validates distillation input data for security.
 * @param {Object} input - Raw distillation input data
 * @returns {Object} Sanitized distillation data
 */
function sanitizeDistillationArchiveInput(input) {
  return {
    oilAmount:
      input.oilAmount !== null && input.oilAmount !== undefined
        ? toFloat(String(input.oilAmount))
        : null,
    hydrosolAmount:
      input.hydrosolAmount !== null && input.hydrosolAmount !== undefined
        ? toFloat(String(input.hydrosolAmount))
        : null,
    hydrosolpH:
      input.hydrosolpH !== null && input.hydrosolpH !== undefined
        ? toFloat(String(input.hydrosolpH))
        : null,
    oilDescription: escape(trim(input.oilDescription || "")),
    hydrosolDescription: escape(trim(input.hydrosolDescription || "")),
    distillationData: input.distillationData
      ? {
          weightForDistillation:
            input.distillationData.weightForDistillation !== null &&
            input.distillationData.weightForDistillation !== undefined
              ? toFloat(String(input.distillationData.weightForDistillation))
              : null,
          isPlantSoaked: Boolean(input.distillationData.isPlantSoaked),
          soakingTime:
            input.distillationData.soakingTime !== null &&
            input.distillationData.soakingTime !== undefined
              ? toInt(String(input.distillationData.soakingTime))
              : null,
          weightAfterSoaking:
            input.distillationData.weightAfterSoaking !== null &&
            input.distillationData.weightAfterSoaking !== undefined
              ? toFloat(String(input.distillationData.weightAfterSoaking))
              : null,
          isPlantShredded: Boolean(input.distillationData.isPlantShredded),
          distillationType: escape(
            trim(input.distillationData.distillationType || "")
          ),
          distillationDate: escape(
            trim(input.distillationData.distillationDate || "")
          ),
          distillationApparatus: escape(
            trim(input.distillationData.distillationApparatus || "")
          ),
          waterForDistillation:
            input.distillationData.waterForDistillation !== null &&
            input.distillationData.waterForDistillation !== undefined
              ? toFloat(String(input.distillationData.waterForDistillation))
              : null,
          distillationTime: input.distillationData.distillationTime
            ? {
                distillationHours:
                  input.distillationData.distillationTime.distillationHours !==
                    null &&
                  input.distillationData.distillationTime.distillationHours !==
                    undefined
                    ? toInt(
                        String(
                          input.distillationData.distillationTime
                            .distillationHours
                        )
                      )
                    : null,
                distillationMinutes:
                  input.distillationData.distillationTime
                    .distillationMinutes !== null &&
                  input.distillationData.distillationTime
                    .distillationMinutes !== undefined
                    ? toInt(
                        String(
                          input.distillationData.distillationTime
                            .distillationMinutes
                        )
                      )
                    : null,
              }
            : null,
        }
      : null,
    distilledPlant: input.distilledPlant
      ? {
          plantName: escape(trim(input.distilledPlant.plantName || "")),
          plantPart: escape(trim(input.distilledPlant.plantPart || "")),
          plantOrigin: escape(trim(input.distilledPlant.plantOrigin || "")),
          plantBuyDate: input.distilledPlant.plantBuyDate
            ? escape(trim(input.distilledPlant.plantBuyDate))
            : "",
          plantProducer: escape(trim(input.distilledPlant.plantProducer || "")),
          countryOfOrigin: escape(
            trim(input.distilledPlant.countryOfOrigin || "")
          ),
          harvestDate: input.distilledPlant.harvestDate
            ? escape(trim(input.distilledPlant.harvestDate))
            : "",
          harvestTemperature:
            input.distilledPlant.harvestTemperature !== null &&
            input.distilledPlant.harvestTemperature !== undefined
              ? toFloat(String(input.distilledPlant.harvestTemperature))
              : null,
          harvestStartTime: escape(
            trim(input.distilledPlant.harvestStartTime || "")
          ),
          harvestEndTime: escape(
            trim(input.distilledPlant.harvestEndTime || "")
          ),
          plantState: escape(trim(input.distilledPlant.plantState || "")),
          dryingTime:
            input.distilledPlant.dryingTime !== null &&
            input.distilledPlant.dryingTime !== undefined
              ? toFloat(String(input.distilledPlant.dryingTime))
              : null,
          plantAge:
            input.distilledPlant.plantAge !== null &&
            input.distilledPlant.plantAge !== undefined
              ? toFloat(String(input.distilledPlant.plantAge))
              : null,
        }
      : null,
  };
}

module.exports = { sanitizeDistillationArchiveInput };
