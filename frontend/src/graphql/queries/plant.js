import { gql } from "@apollo/client/core";

// GraphQL query to fetch the all plants or all the plants with the same name.
export const GET_PLANTS = gql`
  query GetPlants($fields: [String]!, $name: String) {
    getPlants(fields: $fields, name: $name) {
      plantName
      plantPart
      plantWeight
      harvestDate
      plantBuyDate
      _id
    }
  }
`;

// GraphQL query to get plant details by ID with formating date boolean
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
      plantState
      dryingTime
      plantAge
    }
  }
`;

// GraphQL query to get plant details by ID with formating date boolean
export const GET_BASIC_PLANT_BY_ID = gql`
  query GetPlantById($id: ID!, $formatDates: Boolean!) {
    getPlantById(id: $id, formatDates: $formatDates) {
      _id
      plantName
      plantPart
      plantWeight
      plantBuyDate
      harvestDate
    }
  }
`;
