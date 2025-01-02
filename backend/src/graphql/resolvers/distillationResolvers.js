/**
 * @module graphql/resolvers/distillationResolvers
 * @description Distillation resolvers for GraphQL queries and mutations.
 * Handles fetching and creating distillations.
 */

// Importing the Distillation model
const Distillation = require("../../database/distillation");

// Importing required modules
const DOMPurify = require("../../util/sanitizer");
const formatDate = require("../../util/dateformater");
const { filterData } = require("../../util/dataformating");
const { format } = require("date-fns");

const distillationResolvers = {
  Query: {
    getDistillations: async (_, { fields, name }) => {
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
          filter["choosedPlant.name"] = { $regex: new RegExp(name, "i") }; // Case-insensitive search
        }

        // Fetch distillations with the specified fields and filters from the database
        const distillations = await Distillation.find(filter, projection);

        // Return the formatted result
        return distillations.map((distillation) => {
          const formattedDistillation = { ...distillation._doc }; // For Mongoose

          //Formar specific date field
          if (formattedDistillation.distillationDate) {
            formattedDistillation.distillationDate = formatDate(
              formattedDistillation.distillationDate
            );
          }

          return formattedDistillation;
        });
      } catch (error) {
        throw new Error("Failed to fetch distillations: " + error.message);
      }
    },

    getDistillationById: async (_, { id, formatDates }) => {
      try {
        const distillation = await Distillation.findById(id);
        if (!distillation) {
          throw new Error("Distillation not found");
        }

        // Format specific date fields
        if (formatDates) {
          if (distillation.distillationDate) {
            distillation.distillationDate = formatDate(
              distillation.distillationDate
            );
          }
        }
        return distillation;
      } catch (error) {
        throw new Error("Failed to fetch distillation by ID", error);
      }
    },
  },

  Mutation: {
    /**
     * @async
     * @function createDistillation
     * @description Creates a new distillation and saves it to the database.
     * @param {Object} _ - Unused.
     * @param {Object} distillationInput - Input data for the new distillation.
     * @returns {Promise<Object>} The created distillation.
     */
    createDistillation: async (_, { distillationInput }) => {
      // Sanitizing and filtering the nested input object
      const sanitizedDistillationTime = distillationInput.distillationTime
        ? {
            distillationHours: distillationInput.distillationTime
              .distillationHours
              ? Number(
                  DOMPurify.sanitize(
                    distillationInput.distillationTime.distillationHours
                  )
                )
              : null,
            distillationMinutes: distillationInput.distillationTime
              .distillationMinutes
              ? Number(
                  DOMPurify.sanitize(
                    distillationInput.distillationTime.distillationMinutes
                  )
                )
              : null,
          }
        : null;

      // Function to format date
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toString();
      };

      // Sanitizing the input data
      const sanitizedData = {
        choosedPlant: {
          id: distillationInput.choosedPlant.id
            ? DOMPurify.sanitize(distillationInput.choosedPlant.id)
            : null,
          name: DOMPurify.sanitize(distillationInput.choosedPlant.name || ""),
          part: DOMPurify.sanitize(distillationInput.choosedPlant.part || ""),
          availableWeight: distillationInput.choosedPlant.availableWeight
            ? Number(
                DOMPurify.sanitize(
                  distillationInput.choosedPlant.availableWeight
                )
              )
            : null,
          harvestDate: distillationInput.choosedPlant.harvestDate
            ? formatDate(distillationInput.choosedPlant.harvestDate)
            : "",
          buyDate: distillationInput.choosedPlant.buyDate
            ? formatDate(distillationInput.choosedPlant.buyDate)
            : "",
        },
        weightForDistillation: distillationInput.weightForDistillation
          ? Number(DOMPurify.sanitize(distillationInput.weightForDistillation))
          : null,
        isPlantSoaked: Boolean(
          DOMPurify.sanitize(distillationInput.isPlantSoaked)
        ),
        soakingTime: distillationInput.soakingTime
          ? Number(DOMPurify.sanitize(distillationInput.soakingTime))
          : null,
        weightAfterSoaking: distillationInput.weightAfterSoaking
          ? Number(DOMPurify.sanitize(distillationInput.weightAfterSoaking))
          : null,
        isPlantShredded: Boolean(
          DOMPurify.sanitize(distillationInput.isPlantShredded)
        ),
        distillationType: DOMPurify.sanitize(
          distillationInput.distillationType
        ),
        distillationDate: DOMPurify.sanitize(
          distillationInput.distillationDate
        ),
        distillationApparatus: DOMPurify.sanitize(
          distillationInput.distillationApparatus
        ),
        waterForDistillation: distillationInput.waterForDistillation
          ? Number(DOMPurify.sanitize(distillationInput.waterForDistillation))
          : null,
        distillationTime: sanitizedDistillationTime,
      };
      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      try {
        // Creating a new Distillation instance
        const distillation = new Distillation(filteredData);
        // Saving the distillation to the database
        const result = await distillation.save();
        return result;
      } catch (err) {
        throw new Error("Failed to create distillation");
      }
    },

    updateDistillation: async (_, { id, distillationInput }) => {
      // Sanitizing and filtering the nested input object
      const sanitizedDistillationTime = distillationInput.distillationTime
        ? {
            distillationHours: distillationInput.distillationTime
              .distillationHours
              ? Number(
                  DOMPurify.sanitize(
                    distillationInput.distillationTime.distillationHours
                  )
                )
              : null,
            distillationMinutes: distillationInput.distillationTime
              .distillationMinutes
              ? Number(
                  DOMPurify.sanitize(
                    distillationInput.distillationTime.distillationMinutes
                  )
                )
              : null,
          }
        : null;

      // Sanitizing the input data
      const sanitizedData = {
        choosedPlant: {
          id: distillationInput.choosedPlant.id
            ? DOMPurify.sanitize(distillationInput.choosedPlant.id)
            : null,
          name: DOMPurify.sanitize(distillationInput.choosedPlant.name || ""),
          part: DOMPurify.sanitize(distillationInput.choosedPlant.part || ""),
          availableWeight: distillationInput.choosedPlant.availableWeight
            ? Number(
                DOMPurify.sanitize(
                  distillationInput.choosedPlant.availableWeight
                )
              )
            : null,
          harvestDate: DOMPurify.sanitize(
            distillationInput.choosedPlant.harvestDate || ""
          ),
          buyDate: DOMPurify.sanitize(
            distillationInput.choosedPlant.buyDate || ""
          ),
        },
        weightForDistillation: distillationInput.weightForDistillation
          ? Number(DOMPurify.sanitize(distillationInput.weightForDistillation))
          : null,
        isPlantSoaked: Boolean(
          DOMPurify.sanitize(distillationInput.isPlantSoaked)
        ),
        soakingTime: distillationInput.soakingTime
          ? Number(DOMPurify.sanitize(distillationInput.soakingTime))
          : null,
        weightAfterSoaking: distillationInput.weightAfterSoaking
          ? Number(DOMPurify.sanitize(distillationInput.weightAfterSoaking))
          : null,
        isPlantShredded: Boolean(
          DOMPurify.sanitize(distillationInput.isPlantShredded)
        ),
        distillationType: DOMPurify.sanitize(
          distillationInput.distillationType
        ),
        distillationDate: DOMPurify.sanitize(
          distillationInput.distillationDate
        ),
        distillationApparatus: DOMPurify.sanitize(
          distillationInput.distillationApparatus
        ),
        waterForDistillation: distillationInput.waterForDistillation
          ? Number(DOMPurify.sanitize(distillationInput.waterForDistillation))
          : null,
        distillationTime: sanitizedDistillationTime,
      };
      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      try {
        const updatedDistillation = await Distillation.findByIdAndUpdate(
          id,
          filteredData,
          {
            new: true,
          }
        );
        return updatedDistillation;
      } catch (error) {
        throw new Error("Distillation not found");
      }
    },

    deleteDistillation: async (_, { id }) => {
      try {
        await Distillation.findByIdAndDelete(id);
        return true;
      } catch (error) {
        console.error("Failed to delete distillation:", error);
        return false;
      }
    },
  },
};

// Exporting the distillation resolvers
module.exports = distillationResolvers;
