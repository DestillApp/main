import { gql } from "@apollo/client/core";

/**
 * GraphQL mutation to create a new distillation archive.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const CREATE_DISTILLATION_ARCHIVE = gql`
  mutation createDistillationArchive($input: DistillationArchiveInput!) {
    createDistillationArchive(distillationArchiveInput: $input) {
      _id
      oilAmount
      hydrosolAmount
      hydrosolpH
      oilDescription
      hydrosolDescription
      distillationData {
        weightForDistillation
        isPlantSoaked
        soakingTime
        weightAfterSoaking
        isPlantShredded
        distillationType
        distillationDate
        distillationApparatus
        waterForDistillation
        distillationTime {
          distillationHours
          distillationMinutes
        }
      }
      distilledPlant {
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
        plantState
        dryingTime
        plantAge
      }
    }
  }
`;

/**
 * GraphQL mutation to update an existing distillation archive.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const UPDATE_DISTILLATION_ARCHIVE = gql`
  mutation updateDistillationArchive(
    $id: ID!
    $input: DistillationArchiveInput!
  ) {
    updateDistillationArchive(id: $id, distillationArchiveInput: $input) {
      _id
      oilAmount
      hydrosolAmount
      hydrosolpH
      oilDescription
      hydrosolDescription
      distillationData {
        weightForDistillation
        isPlantSoaked
        soakingTime
        weightAfterSoaking
        isPlantShredded
        distillationType
        distillationDate
        distillationApparatus
        waterForDistillation
        distillationTime {
          distillationHours
          distillationMinutes
        }
      }
      distilledPlant {
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
        plantState
        dryingTime
        plantAge
      }
    }
  }
`;

/**
 * GraphQL mutation to delete a distillation archive by ID.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const DELETE_DISTILLATION_ARCHIVE = gql`
  mutation DeleteDistillationArchive($id: ID!) {
    deleteDistillationArchive(id: $id)
  }
`;
