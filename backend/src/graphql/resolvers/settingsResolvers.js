/**
 * @module graphql/resolvers/settingsResolvers
 * @description Settings resolvers for GraphQL queries and mutations.
 * Handles creating and fetching user settings.
 */

// Importing the UserSettings model
const UserSettings = require("../../database/settings");

// Importing required modules
const { AuthenticationError } = require("apollo-server-express");

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
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      try {
        const userSettings = await UserSettings.findOne({ userId: user.id });
        if (!userSettings) {
          throw new Error("User settings not found");
        }
        return userSettings;
      } catch (err) {
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
        updatedAt: Date.now(),
      };

      try {
        // Creating a new UserSettings instance
        const userSettings = new UserSettings(defaultSettings);
        // Saving the user settings to the database
        const result = await userSettings.save();
        return result;
      } catch (err) {
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
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

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
      } catch (err) {
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
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

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
      } catch (err) {
        throw new Error("Failed to update user settings");
      }
    },
  },
};

module.exports = settingsResolvers;