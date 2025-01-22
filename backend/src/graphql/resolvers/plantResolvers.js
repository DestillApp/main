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
const { formatDate } = require("../../util/dateformater");

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
    getPlants: async (_, { fields, formatDates, name, sorting }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

      try {
        // Build a projection object based on the fields argument
        const projection = {};
        fields.forEach((field) => {
          projection[field] = 1;
        });

        // Build a query object for filtering
        const filter = { userId: user.id }; // Filter by user ID
        console.log("name", name);
        // If a name is provided, add it to the filter
        if (name) {
          filter.plantName = { $regex: new RegExp(name, "i") }; // Case-insensitive search
        }

        // Build a sort object based on sortingProps
        const sort = {};
        if (sorting === "plantName") {
          sort.plantName = 1;
        }

        if (sorting === "youngDate") {
          sort.date = -1;
        }

        if (sorting === "oldDate") {
          sort.date = 1;
        }

        if (sorting === "createdAt") {
          sort.createdAt = 1;
        }

        // Fetch plants with the specified fields from database
        const plants = await Plant.find(filter, projection).sort(sort);

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
        throw new Error("Failed to fetch plants: " + error.message);
      }
    },

    getPlantById: async (_, { id, formatDates }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

      try {
        const plant = await Plant.findOne({ _id: id, userId: user.id });
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
     * @param {Object} context - The Apollo Server context containing the request and user objects.
     * @returns {Promise<Object>} The created plant.
     */
    createPlant: async (_, { plantInput }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

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
        date: plantInput.plantBuyDate
          ? new Date(DOMPurify.sanitize(plantInput.plantBuyDate))
          : new Date(DOMPurify.sanitize(plantInput.harvestDate)),
        userId: user.id,
        createdAt: Date.now(),
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
    updatePlant: async (_, { id, plantInput }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

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
        date: plantInput.plantBuyDate
          ? new Date(DOMPurify.sanitize(plantInput.plantBuyDate))
          : new Date(DOMPurify.sanitize(plantInput.harvestDate)),
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
        throw new Error("Plant not found");
      }
    },

    deletePlant: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

      try {
        await Plant.findOneAndDelete({ _id: id, userId: user.id });
        return true;
      } catch (error) {
        console.error("Failed to delete plant:", error);
        return false;
      }
    },

    updateAvailableWeight: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

      try {
        const sanitizedId = DOMPurify.sanitize(input.id);
        const sanitizedAvailableWeight = Number(
          DOMPurify.sanitize(input.availableWeight)
        );

        // Find plant by ID and update availableWeight
        const updatedPlant = await Plant.findOneAndUpdate(
          { _id: sanitizedId, userId: user.id },
          { availableWeight: sanitizedAvailableWeight },
          { new: true } // Returns the updated document
        );
        return updatedPlant;
      } catch (error) {
        throw new Error(
          "Failed to update plant's available weight: " + error.message
        );
      }
    },

    changeAvailableWeight: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

      try {
        const sanitizedId = DOMPurify.sanitize(input.id);
        const sanitizedAvailableWeight = Number(
          DOMPurify.sanitize(input.availableWeight)
        );

        // Find the plant by its ID
        const plant = await Plant.findOne({
          _id: sanitizedId,
          userId: user.id,
        });

        if (!plant) {
          throw new Error("Plant not found");
        }

        plant.availableWeight = parseFloat(
          (plant.availableWeight + sanitizedAvailableWeight).toFixed(1)
        );

        // Save the updated plant document
        const updatedPlant = await plant.save();

        return updatedPlant;
      } catch (error) {
        console.error("Error in changeAvailableWeight resolver:", error);
        throw new Error(
          "Failed to change plant's available weight: " + error.message
        );
      }
    },
  },
};

// Exporting the plant resolvers
module.exports = plantResolver;
