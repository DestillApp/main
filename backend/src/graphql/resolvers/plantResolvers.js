//no code docs
/**
 * @module graphql/resolvers/plantResolvers
 * @description Plant resolvers for GraphQL queries and mutations.
 * Handles fetching and creating plants.
 */

// Importing the Plant model
const Plant = require("../../database/plant");

// Importing required modules
const DOMPurify = require("../../util/sanitizer");
const formatDate = require("../../util/dateformater");

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
     * @description Fetches plants from the database.
     * @returns {Promise<Array>} Array of plants.
     */
    getPlants: async (_, { fields, formatDates, name }) => {
      try {
        // Build a projection object based on the fields argument
        const projection = {};
        fields.forEach((field) => {
          projection[field] = 1;
        });

        // Build a query object for filtering
        const filter = {};
        console.log("name", name);
        // If a name is provided, add it to the filter
        if (name) {
          filter.plantName = { $regex: new RegExp(name, "i") }; // Case-insensitive search
        }

        // Fetch plants with the specified fields from database
        const plants = await Plant.find(filter, projection);

        // Format date fields before returning the result
        return plants.map((plant) => {
          const formattedPlant = { ...plant._doc }; // or plant._doc for Mongoose

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
        throw new Error("Failed to fetch plants", error);
      }
    },

    getPlantById: async (_, { id, formatDates }) => {
      try {
        const plant = await Plant.findById(id);
        if (!plant) {
          throw new Error("Plant not found");
        }

        // Format specific date fields
        if (formatDates) {
          if (plant.plantBuyDate) {
            plant.plantBuyDate = formatDate(plant.plantBuyDate);
          }
          if (plant.harvestDate) {
            plant.harvestDate = formatDate(plant.harvestDate);
          }
        }

        console.log("buy Date:", plant.plantBuyDate);
        console.log("harvest Date:", plant.harvestDate);
        return plant;
      } catch (error) {
        throw new Error("Failed to fetch plant by ID", error);
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
     * @returns {Promise<Object>} The created plant.
     */
    createPlant: async (_, { plantInput }) => {
      // Sanitizing the input data
      const sanitizedData = {
        plantName: DOMPurify.sanitize(plantInput.plantName),
        plantPart: DOMPurify.sanitize(plantInput.plantPart),
        plantOrigin: DOMPurify.sanitize(plantInput.plantOrigin),
        plantBuyDate: DOMPurify.sanitize(plantInput.plantBuyDate),
        plantProducer: DOMPurify.sanitize(plantInput.plantProducer),
        countryOfOrigin: DOMPurify.sanitize(plantInput.countryOfOrigin),
        harvestDate: DOMPurify.sanitize(plantInput.harvestDate),
        harvestTemperature: plantInput.harvestTemperature
          ? Number(DOMPurify.sanitize(plantInput.harvestTemperature))
          : null,
        harvestStartTime: DOMPurify.sanitize(plantInput.harvestStartTime),
        harvestEndTime: DOMPurify.sanitize(plantInput.harvestEndTime),
        plantWeight: plantInput.plantWeight
          ? Number(DOMPurify.sanitize(plantInput.plantWeight))
          : null,
        availableWeight: plantInput.plantWeight
          ? Number(DOMPurify.sanitize(plantInput.plantWeight))
          : null,
        plantState: DOMPurify.sanitize(plantInput.plantState),
        dryingTime: plantInput.dryingTime
          ? Number(DOMPurify.sanitize(plantInput.dryingTime))
          : null,
        plantAge: plantInput.plantAge
          ? Number(DOMPurify.sanitize(plantInput.plantAge))
          : null,
      };
      // Filtering out null or empty string values
      const filteredData = filterPlantData(sanitizedData);

      try {
        // Creating a new Plant instance
        const plant = new Plant(filteredData);
        // Saving the plant to the database
        const result = await plant.save();
        return result;
      } catch (err) {
        throw new Error("Failed to create plant");
      }
    },

    // Update an existing plant
    updatePlant: async (_, { id, plantInput }) => {
      // Sanitizing the input data
      const sanitizedData = {
        plantName: DOMPurify.sanitize(plantInput.plantName),
        plantPart: DOMPurify.sanitize(plantInput.plantPart),
        plantOrigin: DOMPurify.sanitize(plantInput.plantOrigin),
        plantBuyDate: DOMPurify.sanitize(plantInput.plantBuyDate),
        plantProducer: DOMPurify.sanitize(plantInput.plantProducer),
        countryOfOrigin: DOMPurify.sanitize(plantInput.countryOfOrigin),
        harvestDate: DOMPurify.sanitize(plantInput.harvestDate),
        harvestTemperature: plantInput.harvestTemperature
          ? Number(DOMPurify.sanitize(plantInput.harvestTemperature))
          : null,
        harvestStartTime: DOMPurify.sanitize(plantInput.harvestStartTime),
        harvestEndTime: DOMPurify.sanitize(plantInput.harvestEndTime),
        plantWeight: plantInput.plantWeight
          ? Number(DOMPurify.sanitize(plantInput.plantWeight))
          : null,
        availableWeight: plantInput.availableWeight
          ? Number(DOMPurify.sanitize(plantInput.availableWeight))
          : null,
        plantState: DOMPurify.sanitize(plantInput.plantState),
        dryingTime: plantInput.dryingTime
          ? Number(DOMPurify.sanitize(plantInput.dryingTime))
          : null,
        plantAge: plantInput.plantAge
          ? Number(DOMPurify.sanitize(plantInput.plantAge))
          : null,
      };
      // Filtering out null or empty string values
      const filteredData = filterPlantData(sanitizedData);

      try {
        const updatedPlant = await Plant.findByIdAndUpdate(id, filteredData, {
          new: true,
        });
        return updatedPlant;
      } catch (error) {
        throw new Error("Plant not found");
      }
    },

    deletePlant: async (_, { id }) => {
      try {
        await Plant.findByIdAndDelete(id);
        return true;
      } catch (error) {
        console.error("Failed to delete plant:", error);
        return false;
      }
    },

    updateAvailableWeight: async (_, { input }) => {
      try {
        const { id, availableWeight } = input;
        // Find plant by ID and update availableWeight
        const updatedPlant = await Plant.findByIdAndUpdate(
          id,
          { availableWeight: availableWeight },
          { new: true } // Returns the updated document
        );

        if (!updatedPlant) {
          throw new Error("Plant not found");
        }

        return updatedPlant;
      } catch (error) {
        throw new Error(
          "Failed to update plant's available weight: ",
          error.message
        );
      }
    },

    changeAvailableWeight: async (_, { input }) => {
      try {
        const { id, availableWeight } = input;
        // Find the plant by its ID
        const plant = await Plant.findById(id);

        if (!plant) {
          throw new Error("Plant not found");
        }

        plant.availableWeight += availableWeight;

        // Save the updated plant document
        const updatedPlant = await plant.save();

        return updatedPlant;
      } catch (error) {
        console.error("Error in changeAvailableWeight resolver:", error);
        throw new Error(
          "Failed to add weight to plant's available weight: " + error.message
        );
      }
    },
  },
};

// Exporting the plant resolvers
module.exports = plantResolver;
