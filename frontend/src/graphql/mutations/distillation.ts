import { gql } from "@apollo/client/core";

/**
 * GraphQL mutation to create a new distillation.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const CREATE_DISTILLATION = gql`
  mutation createDistillation($input: DistillationInput!) {
    createDistillation(distillationInput: $input) {
      _id
      choosedPlant {
        id
        name
        part
        availableWeight
        harvestDate
        buyDate
      }
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
  }
`;

/**
 * GraphQL mutation to update an existing distillation.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const UPDATE_DISTILLATION = gql`
  mutation updateDistillation($id: ID!, $input: DistillationInput!) {
    updateDistillation(id: $id, distillationInput: $input) {
      _id
      choosedPlant {
        id
        name
        part
        availableWeight
        harvestDate
        buyDate
      }
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
  }
`;

/**
 * GraphQL mutation to delete a distillation by ID.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const DELETE_DISTILLATION = gql`
  mutation DeleteDistillation($id: ID!) {
    deleteDistillation(id: $id)
  }
`;
