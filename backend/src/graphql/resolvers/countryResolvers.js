/**
 * @module graphql/resolvers/countryResolvers
 * @description Country resolvers for GraphQL queries.
 * Handles fetching country names.
 */

const axios = require("axios");

const countryResolver = {
  Query: {
    /**
     * @async
     * @function getCountryNames
     * @description Fetches country names that match the given input name.
     * @param {Object} _ - Unused.
     * @param {String} name - The input name to search for matching country names.
     * @returns {Promise<Array<String>>} An array of matching country names.
     * @throws {Error} If the API call fails or an error occurs.
     */

    //add name translation from polish to english a(google cloud translate)
    getCountryNames: async (_, { name }) => {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${name}?lang=pl`
        );
        return response.data.map((country) => country.translations.pol.common);
      } catch (err) {
        console.error("Failed to fetch country names:", err);
        throw new Error("Failed to fetch country names");
      }
    },
  },
};

// Exporting the country resolvers
module.exports = countryResolver;
