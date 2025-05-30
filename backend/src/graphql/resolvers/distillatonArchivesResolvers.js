/**
 * @module graphql/resolvers/distillationArchivesResolvers
 * @description Distillation Archives resolvers for GraphQL queries and mutations.
 * Handles creating and fetching distillation archives.
 */

// Importing the DistillationArchives model
const DistillationArchives = require("../../database/distillationArchives");

const { filterData } = require("../../util/dataformating");
const { formatDate, formatDateToString, parseDDMMYYYYtoDate } = require("../../util/dateformater");

// Importing required modules
const DOMPurify = require("../../util/sanitizer");
const { AuthenticationError } = require("@apollo/server/errors");

const distillationArchivesResolvers = {
  Query: {
    /**
     * @async
     * @function getDistillationArchives
     * @description Fetches all distillation archives from the database.
     * @returns {Promise<Array>} Array of distillation archives.
     */
    getDistillationArchives: async (_, { fields, name, sorting, formatDates }, { user }) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      try {
        // Build a projection object based on the fields argument
        const projection = {};
        fields.forEach((field) => {
          projection[field] = 1;
        });

        const filter = { userId: user.id };

        // If a name is provided, add it to the filter
        if (name) {
          filter["distilledPlant.plantName"] = {
            $regex: new RegExp(name, "i"),
          }; // Case-insensitive search
        }

        // Build a sort object based on sortingProps
        let sort = null;
        if (sorting === "plantName") {
          sort = { "distilledPlant.plantName": 1 };
        } else if (sorting === "createdAt") {
          sort = { createdAt: 1 };
        } else if (sorting === "youngDate") {
          sort = { date: -1 };
        } else if (sorting === "oldDate") {
          sort = { date: 1 };
        }

        // Fetch distillation archives with the specified fields and filters from the database
        const distillationArchives = sort
          ? await DistillationArchives.find(filter, projection).sort(sort)
          : await DistillationArchives.find(filter, projection);

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
        if (error instanceof AuthenticationError) {
          throw error;
        }
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
     * @param {Boolean} formatDates - Whether to format the date fields.
     * @returns {Promise<Object>} The fetched distillation archive.
     */
    getArchiveDistillationById: async (
      _,
      { id, formatDistillDate },
      { user }
    ) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }
      try {
        const archive = await DistillationArchives.findOne({
          _id: id,
          userId: user.id,
        });
        if (!archive) {
          throw new Error("Distillation archive not found");
        }

        if (archive.distilledPlant.plantBuyDate) {
          archive.distilledPlant.plantBuyDate = formatDate(
            archive.distilledPlant.plantBuyDate
          );
        }
        if (archive.distilledPlant.harvestDate) {
          archive.distilledPlant.harvestDate = formatDate(
            archive.distilledPlant.harvestDate
          );
        }

        // Format specific date fields if needed
        if (formatDistillDate) {
          if (archive.distillationData.distillationDate) {
            archive.distillationData.distillationDate = formatDate(
              archive.distillationData.distillationDate
            );
          }
        }

        return archive;
      } catch (error) {
        if (error instanceof AuthenticationError) {
          throw error;
        }
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
     * @param {Object} user - The user creating the distillation archive.
     * @returns {Promise<Object>} The created distillation archive.
     */
    createDistillationArchive: async (
      _,
      { distillationArchiveInput },
      { user }
    ) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      const sanitizedDate = DOMPurify.sanitize(
        distillationArchiveInput.distillationData.distillationDate
      );

      console.log("Sanitized date:", sanitizedDate);
      const validDate = parseDDMMYYYYtoDate(sanitizedDate);
      console.log("Valid date:", validDate);

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
          distillationDate: parseDDMMYYYYtoDate(distillationArchiveInput.distillationData
            .distillationDate),
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
          plantBuyDate: distillationArchiveInput.distilledPlant.plantBuyDate ? parseDDMMYYYYtoDate(distillationArchiveInput.distilledPlant.plantBuyDate) : "",
          plantProducer: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.plantProducer
          ),
          countryOfOrigin: DOMPurify.sanitize(
            distillationArchiveInput.distilledPlant.countryOfOrigin
          ),
          harvestDate: distillationArchiveInput.distilledPlant.harvestDate ? parseDDMMYYYYtoDate(distillationArchiveInput.distilledPlant.harvestDate) : "",
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
        date: validDate,
        userId: user.id,
        createdAt: Date.now(),
      };

      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      console.log(filterData, "filtered data");

      try {
        // Creating a new DistillationArchives instance
        const distillationArchive = new DistillationArchives(filteredData);
        // Saving the distillation archive to the database
        const result = await distillationArchive.save();
        return result;
      } catch (error) {
        if (error instanceof AuthenticationError) {
          throw error;
        }
        console.error("Error details:", err);
        throw new Error("Failed to create distillation archive");
      }
    },

    /**
     * @async
     * @function updateDistillationArchive
     * @description Updates an existing distillation archive and saves it to the database.
     * @param {Object} _ - Unused.
     * @param {Object} id - ID of the distillation archive to update.
     * @param {Object} distillationArchiveInput - Input data for the distillation archive update.
     * @returns {Promise<Object>} The updated distillation archive.
     */
    updateDistillationArchive: async (
      _,
      { id, distillationArchiveInput },
      { user }
    ) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      const sanitizedDate = DOMPurify.sanitize(
        distillationArchiveInput.distillationData.distillationDate
      );
      const validDate = parseDDMMYYYYtoDate(sanitizedDate);

      // Sanitizing and filtering the nested input object
      const sanitizedDistillationTime = distillationArchiveInput
        .distillationData.distillationTime
        ? {
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
          }
        : null;

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
          distillationTime: sanitizedDistillationTime,
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
        date: validDate,
        userId: user.id,
      };

      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      try {
        const { createdAt, ...updateData } = filteredData;

        const updatedDistillationArchive =
          await DistillationArchives.findByIdAndUpdate(id, updateData, {
            new: true,
          });
        return updatedDistillationArchive;
      } catch (error) {
        if (error instanceof AuthenticationError) {
          throw error;
        }
        throw new Error("Failed to update distillation archive");
      }
    },

    deleteDistillationArchive: async (_, { id }, { user }) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      try {
        await DistillationArchives.findOneAndDelete({
          _id: id,
          userId: user.id,
        });
        return true;
      } catch (error) {
        if (error instanceof AuthenticationError) {
          throw error;
        }
        console.error("Failed to delete distillation archive:", error);
        return false;
      }
    },
  },
};

// Exporting the distillation archives resolvers
module.exports = distillationArchivesResolvers;
