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
  Mutation: {
    /**
     * @async
     * @function createSettings
     * @description Creates initial default settings for a user and saves them to the database.
     * @param {Object} _ - Unused.
     * @param {Object} __ - Unused.
     * @param {Object} user - The authenticated user.
     * @returns {Promise<Object>} The created user settings.
     */
    createSettings: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError("Unauthorized");
      }

      // Initial default settings data
      const defaultSettings = {
        userId: user.id,
        listSettings: {
          plantListLength: 10,
          distillationListLength: 10,
          distillationArchivesListLength: 10,
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
  },
};

module.exports = settingsResolvers;