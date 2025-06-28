import { gql } from "@apollo/client/core";

/**
 * GraphQL mutation to create a new plant.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
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
      availableWeight
      plantState
      dryingTime
      plantAge
    }
  }
`;

/**
 * GraphQL mutation to update an existing plant.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
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
      availableWeight
      plantState
      dryingTime
      plantAge
    }
  }
`;

/**
 * GraphQL mutation to delete a plant by ID.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const DELETE_PLANT = gql`
  mutation DeletePlant($id: ID!) {
    deletePlant(id: $id)
  }
`;

/**
 * GraphQL mutation to update available weight of a plant after adding distillation to the database.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const UPDATE_AVAILABLE_WEIGHT = gql`
  mutation UpdateAvailableWeight($input: UpdateAvailableWeightInput!) {
    updateAvailableWeight(input: $input) {
      _id
      availableWeight
    }
  }
`;

/**
 * GraphQL mutation to change available weight of a plant.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const CHANGE_AVAILABLE_WEIGHT = gql`
  mutation ChangeAvailableWeight($input: ChangeAvailableWeightInput!) {
    changeAvailableWeight(input: $input) {
      _id
      availableWeight
    }
  }
`;
