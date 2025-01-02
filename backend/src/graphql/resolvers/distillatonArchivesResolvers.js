/**
 * @module graphql/resolvers/distillationArchivesResolvers
 * @description Distillation Archives resolvers for GraphQL queries and mutations.
 * Handles creating and fetching distillation archives.
 */

// Importing the DistillationArchives model
const DistillationArchives = require("../../database/distillationArchives");

const { filterData } = require("../../util/dataformating");
const { formatDate } = require("../../util/dateformater");

// Importing required modules
const DOMPurify = require("../../util/sanitizer");

const distillationArchivesResolvers = {
  Query: {
    /**
     * @async
     * @function getDistillationArchives
     * @description Fetches all distillation archives from the database.
     * @returns {Promise<Array>} Array of distillation archives.
     */
    getDistillationArchives: async (_, { fields, name, formatDates }) => {
      try {
        // Build a projection object based on the fields argument
        const projection = {};
        fields.forEach((field) => {
          projection[field] = 1;
        });

        // Build a filter object for potential filtering
        const filter = {};

        // If a name is provided, add it to the filter
        if (name) {
          filter["distilledPlant.plantName"] = {
            $regex: new RegExp(name, "i"),
          }; // Case-insensitive search
        }

        // Fetch distillation archives with the specified fields and filters from the database
        const distillationArchives = await DistillationArchives.find(
          filter,
          projection
        );

        // Return the formatted result
        return distillationArchives.map((archive) => {
          const formattedArchive = { ...archive._doc }; // For Mongoose

          // Format specific date fields if needed
          if (formatDates) {
            if (formattedArchive.distillationData.distillationDate) {
              formattedArchive.distillationData.distillationDate = formatDate(
                formattedArchive.distillationData.distillationDate
              );
            }
            if (formattedArchive.distilledPlant.plantBuyDate) {
              formattedArchive.distilledPlant.plantBuyDate = formatDate(
                formattedArchive.distilledPlant.plantBuyDate
              );
            }
            if (formattedArchive.distilledPlant.harvestDate) {
              formattedArchive.distilledPlant.harvestDate = formatDate(
                formattedArchive.distilledPlant.harvestDate
              );
            }
          }

          return formattedArchive;
        });
      } catch (error) {
        throw new Error(
          "Failed to fetch distillation archives: " + error.message
        );
      }
    },
    /**
     * @async
     * @function getArchiveDistillationById
     * @description Fetches a distillation archive by ID from the database.
     * @param {Object} _ - Unused.
     * @param {Object} id - ID of the distillation archive to fetch.
     * @returns {Promise<Object>} The fetched distillation archive.
     */
    getArchiveDistillationById: async (_, { id, formatDates = false }) => {
      try {
        const archive = await DistillationArchives.findById(id);
        if (!archive) {
          throw new Error("Distillation archive not found");
        }

        console.log(formatDates);

        //Format specific date fields if needed
        if (formatDates && archive.distillationData.distillationDate) {
          const date = new Date(archive.distillationData.distillationDate);
          archive.distillationData.distillationDate = date.toString();
        }

        return archive;
      } catch (error) {
        throw new Error(
          "Failed to fetch distillation archive by ID: " + error.message
        );
      }
    },
  },

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
          distillationDate: distillationArchiveInput.distillationData
            .distillationDate
            ? formatDateToString(
                DOMPurify.sanitize(
                  distillationArchiveInput.distillationData.distillationDate
                )
              )
            : "",
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
          plantBuyDate: distillationArchiveInput.distilledPlant.plantBuyDate
            ? formatDateToString(
                DOMPurify.sanitize(
                  distillationArchiveInput.distilledPlant.plantBuyDate
                )
              )
            : "",
          plantProducer: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.plantProducer
          ),
          countryOfOrigin: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.countryOfOrigin
          ),
          harvestDate: distillationArchiveInput.distilledPlant.harvestDate
            ? formatDateToString(
                DOMPurify.sanitize(
                  distillationArchiveInput.distilledPlant.harvestDate
                )
              )
            : "",
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

    deleteDistillationArchive: async (_, { id }) => {
      try {
        await DistillationArchives.findByIdAndDelete(id);
        return true;
      } catch (error) {
        console.error("Failed to delete archive distillation:", error);
        return false;
      }
    },
  },
};

// Exporting the distillation archives resolvers
module.exports = distillationArchivesResolvers;
