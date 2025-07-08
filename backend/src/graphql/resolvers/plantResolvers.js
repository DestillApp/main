/**
 * @module graphql/resolvers/plantResolvers
 * @description Plant resolvers for GraphQL queries and mutations.
 * Handles fetching and creating plants.
 */

// Importing the Plant model
const Plant = require("../../database/plant");

// Importing required modules
const { formatDate } = require("../../util/dateformater");
const { requireAuth } = require("../../util/authChecking");
const { GraphQLError } = require("graphql");
const { trim } = require("validator");

const {
  sanitizePlantInput,
} = require("../../util/sanitization/plantSanitizator");

// Utility function to filter data
function filterPlantData(data) {
  const filteredData = {};

  if (data.plantOrigin === "kupno") {
    data.harvestEndTime = "";
    data.harvestStartTime = "";
  }

  for (const key in data) {
    if (data[key] !== null && data[key] !== "") {
      filteredData[key] = data[key];
    }
  }
  return filteredData;
}

const plantResolver = {
  Query: {
    /**
     * @async
     * @function getPlants
     * @param {Object} _ - Unused parameter.
     * @param {Object} args - An object containing query arguments.
     * @param {Array<string>} args.fields - Fields to include in the result.
     * @param {boolean} args.formatDates - Whether to format date fields.
     * @param {string} args.name - Name of the plant to filter by.
     * @param {string} args.sorting - Sorting criteria.
     * @param {Object} context - Context object containing the request user.
     * @param {Object} context.user - The authenticated user.
     * @returns {Promise<Array<Object>>} A promise resolving to a list of plants.
     */
    getPlants: async (_, { fields, formatDates, name, sorting }, { user }) => {
      requireAuth(user);

      try {
        // Build a projection object based on the fields argument
        const projection = {};
        fields.forEach((field) => {
          projection[field] = 1;
        });

        // Build a query object for filtering
        const filter = { userId: user.id }; // Filter by user ID
        if (name) {
          filter.plantName = { $regex: new RegExp(name, "i") }; // Case-insensitive search
        }

        // Build a sort object based on sortingProps
        let sort = null;
        if (sorting === "plantName") {
          sort = { plantName: 1 };
        } else if (sorting === "youngDate") {
          sort = { date: -1 };
        } else if (sorting === "oldDate") {
          sort = { date: 1 };
        } else if (sorting === "createdAt") {
          sort = { createdAt: 1 };
        }

        // Fetch plants with the specified fields from database
        const plants = sort
          ? await Plant.find(filter, projection).sort(sort)
          : await Plant.find(filter, projection);

        // Format date fields before returning the result
        return plants.map((plant) => {
          const formattedPlant = plant.toObject(); // Convert Mongoose document to plain JavaScript object

          // Format specific date fields
          if (formatDates) {
            if (formattedPlant.harvestDate) {
              formattedPlant.harvestDate = formatDate(
                formattedPlant.harvestDate
              );
            }
            if (formattedPlant.plantBuyDate) {
              formattedPlant.plantBuyDate = formatDate(
                formattedPlant.plantBuyDate
              );
            }
          }

          return formattedPlant;
        });
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to fetch plants: " + error.message);
      }
    },

    getPlantById: async (_, { id, formatDates }, { user }) => {
      requireAuth(user);

      try {
        const plant = await Plant.findOne({ _id: id, userId: user.id });
        if (!plant) {
          throw new Error("Plant not found");
        }
        console.log("plant", plant);

        // Format specific date fields
        if (formatDates) {
          if (plant.plantBuyDate) {
            plant.plantBuyDate = formatDate(plant.plantBuyDate);
          }
          if (plant.harvestDate) {
            plant.harvestDate = formatDate(plant.harvestDate);
          }
        }
        return plant;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to fetch plant by ID: " + error.message);
      }
    },
  },

  Mutation: {
    /**
     * @async
     * @function createPlant
     * @description Creates a new plant and saves it to the database.
     * @param {Object} _ - Unused.
     * @param {Object} plantInput - Input data for the new plant.
     * @param {Object} context - The Apollo Server context containing the request and user objects.
     * @returns {Promise<Object>} The created plant.
     */
    createPlant: async (_, { plantInput }, { user }) => {
      requireAuth(user);

      // Sanitize all input fields
      const sanitizedPlant = sanitizePlantInput(plantInput);

      // Add backend-only fields, including the required date
      const sanitizedData = {
        ...sanitizedPlant,
        date: sanitizedPlant.plantBuyDate
          ? new Date(sanitizedPlant.plantBuyDate)
          : new Date(sanitizedPlant.harvestDate),
        userId: user.id,
        createdAt: Date.now(),
      };

      // Optionally filter out null/empty values
      const filteredData = filterPlantData(sanitizedData);

      try {
        const plant = new Plant(filteredData);
        const result = await plant.save();
        return result;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to create plant: " + error.message);
      }
    },

    // Update an existing plant
    updatePlant: async (_, { id, plantInput }, { user }) => {
      requireAuth(user);

      // Sanitize all input fields
      const sanitizedPlant = sanitizePlantInput(plantInput);

      // Add backend-only fields, including the required date
      const sanitizedData = {
        ...sanitizedPlant,
        date: sanitizedPlant.plantBuyDate
          ? new Date(sanitizedPlant.plantBuyDate)
          : new Date(sanitizedPlant.harvestDate),
        userId: user.id,
      };

      // Filtering out null or empty string values
      const filteredData = filterPlantData(sanitizedData);

      try {
        const { createdAt, ...updateData } = filteredData;

        const updatedPlant = await Plant.findByIdAndUpdate(id, updateData, {
          new: true,
        });
        return updatedPlant;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to update plant: " + error.message);
      }
    },

    deletePlant: async (_, { id }, { user }) => {
      requireAuth(user);

      try {
        await Plant.findOneAndDelete({ _id: id, userId: user.id });
        return true;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error("Failed to delete plant:", error);
        return false;
      }
    },

    updateAvailableWeight: async (_, { input }, { user }) => {
      requireAuth(user);

      // Sanitize input fields using validator (no error throwing here)
      const sanitizedId = trim(input.id || "");
      const sanitizedAvailableWeight = trim(String(input.availableWeight));

      // Convert to number after sanitization
      const availableWeightNumber = parseFloat(sanitizedAvailableWeight);

      try {
        // Find plant by ID and update availableWeight
        const updatedPlant = await Plant.findOneAndUpdate(
          { _id: sanitizedId, userId: user.id },
          { availableWeight: availableWeightNumber },
          { new: true } // Returns the updated document
        );
        return updatedPlant;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error(
          "Failed to update plant's available weight: " + error.message
        );
      }
    },

    changeAvailableWeight: async (_, { input }, { user }) => {
      requireAuth(user);

      try {
        // Sanitize and validate input fields using validator
        const sanitizedId = trim(input.id || "");
        const sanitizedAvailableWeight = trim(String(input.availableWeight));

        const availableWeightNumber = parseFloat(sanitizedAvailableWeight);

        // Find the plant by its ID
        const plant = await Plant.findOne({
          _id: sanitizedId,
          userId: user.id,
        });

        if (!plant) {
          throw new GraphQLError("Plant not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        plant.availableWeight = parseFloat(
          (plant.availableWeight + availableWeightNumber).toFixed(1)
        );

        // Save the updated plant document
        const updatedPlant = await plant.save();

        return updatedPlant;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error(
          "Failed to change plant's available weight: " + error.message
        );
      }
    },
  },
};

// Exporting the plant resolvers
module.exports = plantResolver;
