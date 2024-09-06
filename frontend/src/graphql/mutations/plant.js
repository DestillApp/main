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
      isPlantSoaked
      soakingTime
      weightAfterSoaking
    }
  }
`;

// GraphQL mutation to delete plant by ID
export const DELETE_PLANT = gql`
  mutation DeletePlant($id: ID!) {
    deletePlant(id: $id)
  }
`;
