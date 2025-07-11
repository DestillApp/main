/**
 * @module graphql/resolvers/settingsResolvers
 * @description Settings resolvers for GraphQL queries and mutations.
 * Handles creating and fetching user settings.
 */

// Importing the UserSettings model
const UserSettings = require("../../database/settings");

// Importing required modules
const { GraphQLError } = require("graphql");
const { requireAuth } = require("../../util/authChecking");
const {
  sanitizeDistillerInput,
} = require("../../util/sanitization/distillerSanitizer");

const settingsResolvers = {
  Query: {
    /**
     * @async
     * @function getUserSettings
     * @description Fetches the user settings for the authenticated user.
     * @param {Object} _ - Unused.
     * @param {Object} __ - Unused.
     * @param {Object} user - The authenticated user.
     * @returns {Promise<Object>} The user settings.
     */
    getUserSettings: async (_, __, { user }) => {
      requireAuth(user);

      try {
        const userSettings = await UserSettings.findOne({ userId: user.id });
        if (!userSettings) {
          throw new Error("User settings not found");
        }
        return userSettings;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to fetch user settings");
      }
    },
  },

  Mutation: {
    /**
     * @async
     * @function createSettings
     * @description Creates initial default settings for a user and saves them to the database.
     * @param {Object} _ - Unused.
     * @param {Object} userId - The authenticated user.
     * @returns {Promise<Object>} The created user settings.
     */
    createSettings: async (_, { userId }) => {
      // Initial default settings data
      const defaultSettings = {
        userId: userId,
        listSettings: {
          plantListLength: 10,
          distillationListLength: 10,
          distillationArchivesListLength: 10,
        },
        listSorting: {
          plantListSorting: "createdAt",
          distillationListSorting: "createdAt",
          archiveDistillationListSorting: "createdAt",
        },
        distillerList: [],
        isDarkTheme: false,
        updatedAt: Date.now(),
      };

      try {
        // Creating a new UserSettings instance
        const userSettings = new UserSettings(defaultSettings);
        // Saving the user settings to the database
        const result = await userSettings.save();
        return result;
      } catch (err) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to create user settings");
      }
    },

    /**
     * @async
     * @function updateListSettings
     * @description Updates a specific item in the listSettings object and updates the updatedAt date.
     * @param {Object} _ - Unused.
     * @param {Object} input - The input data containing the setting to update.
     * @param {Object} user - The authenticated user.
     * @returns {Promise<Object>} The updated user settings.
     */
    updateListSettings: async (_, { input }, { user }) => {
      requireAuth(user);

      const { settingKey, settingValue } = input;

      try {
        // Find the user settings and update the specific setting
        const updatedSettings = await UserSettings.findOneAndUpdate(
          { userId: user.id },
          {
            $set: { [`listSettings.${settingKey}`]: settingValue },
            $currentDate: { updatedAt: true },
          },
          { new: true }
        );

        if (!updatedSettings) {
          throw new Error("User settings not found");
        }

        return updatedSettings;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to update user settings");
      }
    },

    /**
     * @async
     * @function updateListSorting
     * @description Updates a specific item in the listSorting object and updates the updatedAt date.
     * @param {Object} _ - Unused.
     * @param {Object} input - The input data containing the setting to update.
     * @param {Object} user - The authenticated user.
     * @returns {Promise<Object>} The updated user settings.
     */
    updateListSorting: async (_, { input }, { user }) => {
      requireAuth(user);

      const { settingKey, settingValue } = input;

      try {
        // Find the user settings and update the specific setting
        const updatedSettings = await UserSettings.findOneAndUpdate(
          { userId: user.id },
          {
            $set: { [`listSorting.${settingKey}`]: settingValue },
            $currentDate: { updatedAt: true },
          },
          { new: true }
        );

        if (!updatedSettings) {
          throw new Error("User settings not found");
        }

        return updatedSettings;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to update user settings");
      }
    },

    /**
     * @async
     * @function addDistiller
     * @description Adds a new distiller to the distillerList and updates the updatedAt date.
     * @param {Object} _ - Unused.
     * @param {Object} userId - The authenticated user.
     * @param {Object} distiller - The distiller data to add.
     * @returns {Promise<Object>} The updated user settings.
     */
    addDistiller: async (_, { userId, distiller }, { user }) => {
      requireAuth(user);

      // Sanitize distiller input
      const sanitizedDistiller = sanitizeDistillerInput(distiller);

      try {
        // Find the user settings and add the new distiller
        const updatedSettings = await UserSettings.findOneAndUpdate(
          { userId: user.id },
          {
            $push: { distillerList: sanitizedDistiller },
            $currentDate: { updatedAt: true },
          },
          { new: true }
        );

        if (!updatedSettings) {
          throw new Error("User settings not found");
        }

        return updatedSettings;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to add distiller");
      }
    },

    /**
     * @async
     * @function deleteDistiller
     * @description Deletes a distiller from the distillerList by its ID and updates the updatedAt date.
     * @param {Object} _ - Unused.
     * @param {Object} userId - The authenticated user.
     * @param {ID} distillerId - The ID of the distiller to delete.
     * @returns {Promise<Object>} The updated user settings.
     */
    deleteDistiller: async (_, { userId, distillerId }, { user }) => {
      requireAuth(user);

      try {
        // Find the user settings and remove the distiller by its ID
        const updatedSettings = await UserSettings.findOneAndUpdate(
          { userId: user.id },
          {
            $pull: { distillerList: { _id: distillerId } },
            $currentDate: { updatedAt: true },
          },
          { new: true }
        );

        if (!updatedSettings) {
          throw new Error("User settings not found");
        }

        return updatedSettings;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to delete distiller");
      }
    },

    /**
     * @async
     * @function updateDarkTheme
     * @description Updates the isDarkTheme setting and updates the updatedAt date.
     * @param {Object} _ - Unused.
     * @param {Boolean} isDarkTheme - The new value for the isDarkTheme setting.
     * @param {Object} user - The authenticated user.
     * @returns {Promise<Object>} The updated user settings.
     */
    updateDarkTheme: async (_, { isDarkTheme }, { user }) => {
      requireAuth(user);

      try {
        // Find the user settings and update the isDarkTheme setting
        const updatedSettings = await UserSettings.findOneAndUpdate(
          { userId: user.id },
          {
            $set: { isDarkTheme: isDarkTheme },
            $currentDate: { updatedAt: true },
          },
          { new: true }
        );

        if (!updatedSettings) {
          throw new Error("User settings not found");
        }

        return updatedSettings;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to update dark theme setting");
      }
    },
  },
};

module.exports = settingsResolvers;
