import { gql } from "@apollo/client/core";

// GraphQL mutation to create the new plant
export const CREATE_PLANT = gql`
  mutation createPlant($input: PlantInput!) {
    createPlant(plantInput: $input) {
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

export const UPDATE_PLANT = gql`
  mutation UpdatePlant($id: ID!, $plantInput: PlantInput!) {
    updatePlant(id: $id, plantInput: $plantInput) {
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

// GraphQL mutation to delete plant by ID
export const DELETE_PLANT = gql`
  mutation DeletePlant($id: ID!) {
    deletePlant(id: $id)
  }
`;
