import { gql } from "@apollo/client/core";

// GraphQL mutation to create the new plant
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

// GraphQL mutation to create the new plant
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

// GraphQL mutation to delete plant by ID
export const DELETE_DISTILLATION = gql`
  mutation DeleteDistillation($id: ID!) {
    deleteDistillation(id: $id)
  }
`;
