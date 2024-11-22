import { gql } from "@apollo/client/core";

// GraphQL mutation to create the new plant
export const CREATE_DISTILLATION = gql`
  mutation createDistillation($input: DistillationInput!) {
    createDistillation(distillationInput: $input) {
      _id
      weightForDistillation
      isPlantSoaked
      soakingTime
      weightAfterSoaking
      isPlantShredded
    }
  }
`;
