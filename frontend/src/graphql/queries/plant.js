import { gql } from "@apollo/client/core";

// GraphQL query to fetch the all plants.
export const GET_PLANTS = gql`
  query GetPlants($fields: [String]!) {
    getPlants(fields: $fields) {
      plantName
      plantPart
      plantWeight
      harvestDate
      plantBuyDate
      _id
    }
  }
`;

// GraphQL query to get plant details by ID
export const GET_PLANT_BY_ID = gql`
  query GetPlantById($id: ID!) {
    getPlantById(id: $id) {
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
