import { gql } from "@apollo/client/core";

export const CREATE_SETTINGS = gql`
  mutation {
    createSettings {
      userId
      listSettings {
        plantListLength
        distillationListLength
        distillationArchivesListLength
      }
      updatedAt
    }
  }
`;