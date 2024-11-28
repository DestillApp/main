/**
 * @module graphql/resolvers/distillationArchivesResolvers
 * @description Distillation Archives resolvers for GraphQL mutations.
 * Handles creating distillation archives.
 */

// Importing the DistillationArchives model
const DistillationArchives = require("../../database/distillationArchives");

const { filterData } = require("../../util/dataformating");

// Importing required modules
const DOMPurify = require("../../util/sanitizer");

const distillationArchivesResolvers = {
  Mutation: {
    /**
     * @async
     * @function createDistillationArchive
     * @description Creates a new distillation archive and saves it to the database.
     * @param {Object} _ - Unused.
     * @param {Object} distillationArchiveInput - Input data for the new distillation archive.
     * @returns {Promise<Object>} The created distillation archive.
     */
    createDistillationArchive: async (_, { distillationArchiveInput }) => {
      // Sanitizing the input data
      const sanitizedData = {
        oilAmount: distillationArchiveInput.oilAmount
          ? Number(DOMPurify.sanitize(distillationArchiveInput.oilAmount))
          : null,
        hydrosolAmount: distillationArchiveInput.hydrosolAmount
          ? Number(DOMPurify.sanitize(distillationArchiveInput.hydrosolAmount))
          : null,
        hydrosolpH: distillationArchiveInput.hydrosolpH
          ? Number(DOMPurify.sanitize(distillationArchiveInput.hydrosolpH))
          : null,
        oilDescription: DOMPurify.sanitize(
          distillationArchiveInput.oilDescription
        ),
        hydrosolDescription: DOMPurify.sanitize(
          distillationArchiveInput.hydrosolDescription
        ),
        distillationData: {
          weightForDistillation: distillationArchiveInput.distillationData
            .weightForDistillation
            ? Number(
                DOMPurify.sanitize(
                  distillationArchiveInput.distillationData
                    .weightForDistillation
                )
              )
            : null,
          isPlantSoaked: Boolean(
            DOMPurify.sanitize(
              distillationArchiveInput.distillationData.isPlantSoaked
            )
          ),
          soakingTime: distillationArchiveInput.distillationData.soakingTime
            ? Number(
                DOMPurify.sanitize(
                  distillationArchiveInput.distillationData.soakingTime
                )
              )
            : null,
          weightAfterSoaking: distillationArchiveInput.distillationData
            .weightAfterSoaking
            ? Number(
                DOMPurify.sanitize(
                  distillationArchiveInput.distillationData.weightAfterSoaking
                )
              )
            : null,
          isPlantShredded: Boolean(
            DOMPurify.sanitize(
              distillationArchiveInput.distillationData.isPlantShredded
            )
          ),
          distillationType: DOMPurify.sanitize(
            distillationArchiveInput.distillationData.distillationType
          ),
          distillationDate: DOMPurify.sanitize(
            distillationArchiveInput.distillationData.distillationDate
          ),
          distillationApparatus: DOMPurify.sanitize(
            distillationArchiveInput.distillationData.distillationApparatus
          ),
          waterForDistillation: distillationArchiveInput.distillationData
            .waterForDistillation
            ? Number(
                DOMPurify.sanitize(
                  distillationArchiveInput.distillationData.waterForDistillation
                )
              )
            : null,
          distillationTime: {
            distillationHours: distillationArchiveInput.distillationData
              .distillationTime.distillationHours
              ? Number(
                  DOMPurify.sanitize(
                    distillationArchiveInput.distillationData.distillationTime
                      .distillationHours
                  )
                )
              : null,
            distillationMinutes: distillationArchiveInput.distillationData
              .distillationTime.distillationMinutes
              ? Number(
                  DOMPurify.sanitize(
                    distillationArchiveInput.distillationData.distillationTime
                      .distillationMinutes
                  )
                )
              : null,
          },
        },
        distilledPlant: {
          plantName: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.plantName
          ),
          plantPart: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.plantPart
          ),
          plantOrigin: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.plantOrigin
          ),
          plantBuyDate: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.plantBuyDate
          ),
          plantProducer: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.plantProducer
          ),
          countryOfOrigin: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.countryOfOrigin
          ),
          harvestDate: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.harvestDate
          ),
          harvestTemperature: distillationArchiveInput.distilledPlant
            .harvestTemperature
            ? Number(
                DOMPurify.sanitize(
                  distillationArchiveInput.distilledPlant.harvestTemperature
                )
              )
            : null,
          harvestStartTime: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.harvestStartTime
          ),
          harvestEndTime: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.harvestEndTime
          ),
          plantState: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.plantState
          ),
          dryingTime: distillationArchiveInput.distilledPlant.dryingTime
            ? Number(
                DOMPurify.sanitize(
                  distillationArchiveInput.distilledPlant.dryingTime
                )
              )
            : null,
          plantAge: distillationArchiveInput.distilledPlant.plantAge
            ? Number(
                DOMPurify.sanitize(
                  distillationArchiveInput.distilledPlant.plantAge
                )
              )
            : null,
        },
      };

      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      try {
        // Creating a new DistillationArchives instance
        const distillationArchive = new DistillationArchives(filteredData);
        // Saving the distillation archive to the database
        const result = await distillationArchive.save();
        return result;
      } catch (err) {
        throw new Error("Failed to create distillation archive");
      }
    },
  },
};

// Exporting the distillation archives resolvers
module.exports = distillationArchivesResolvers;

//   isPlantShredded: Boolean(DOMPurify.sanitize(distillationArchiveInput.distillationData.isPlantShredded)),
//   distillationType: DOMPurify.sanitize(distillationArchiveInput.distillationData.distillationType),
//   distillationDate: DOMPurify.sanitize(distillationArchiveInput.distillationData.distillationDate),
//   distillationApparatus: DOMPurify.sanitize(distillationArchiveInput.distillationData.distillationApparatus),
//   waterForDistillation: distillationArchiveInput.distillationData.waterForDistillation
//     ? Number(DOMPurify.sanitize(distillationArchiveInput.distillationData.waterForDistillation))
//     : null,
//   distillationTime: {
//     distillationHours: distillationArchiveInput.distillationData.distillationTime.distillationHours
//       ? Number(DOMPurify.sanitize(distillationArchiveInput.distillationData.distillationTime.distillationHours))
//       : null,
//     distillationMinutes: distillationArchiveInput.distillationData.distillationTime.distillationMinutes
//       ? Number(DOMPurify.sanitize(distillationArchiveInput.distillationData.distillationTime.distillationMinutes))
//       : null,
//   },
