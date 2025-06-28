import { gql } from "@apollo/client/core";

/**
 * GraphQL query to fetch all plants or all plants with the same name.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const GET_PLANTS = gql`
  query GetPlants(
    $fields: [String]!
    $formatDates: Boolean!
    $name: String
    $sorting: String
  ) {
    getPlants(
      fields: $fields
      formatDates: $formatDates
      name: $name
      sorting: $sorting
    ) {
      plantName
      plantPart
      availableWeight
      harvestDate
      plantBuyDate
      _id
    }
  }
`;

/**
 * GraphQL query to get plant details by ID with optional date formatting.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const GET_PLANT_BY_ID = gql`
  query GetPlantById($id: ID!, $formatDates: Boolean!) {
    getPlantById(id: $id, formatDates: $formatDates) {
      _id
      plantName
      plantPart
      plantOrigin
      plantBuyDate
      plantProducer
      countryOfOrigin
      harvestDate
      harvestTemperature
      harvestStartTime
      harvestEndTime
      plantWeight
      availableWeight
      plantState
      dryingTime
      plantAge
    }
  }
`;

/**
 * GraphQL query to get basic plant details by ID with optional date formatting.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const GET_BASIC_PLANT_BY_ID = gql`
  query GetPlantById($id: ID!, $formatDates: Boolean!) {
    getPlantById(id: $id, formatDates: $formatDates) {
      _id
      plantName
      plantPart
      availableWeight
      plantBuyDate
      harvestDate
    }
  }
`;
