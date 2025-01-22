import { gql } from "@apollo/client/core";

export const CREATE_SETTINGS = gql`
  mutation CreateSettings($userId: ID!) {
    createSettings(userId: $userId) {
      userId
      listSettings {
        plantListLength
        distillationListLength
        distillationArchivesListLength
      }
      listSorting {
        plantListSorting
        distillationListSorting
        archiveDistillationListSorting
      }
      updatedAt
    }
  }
`;

// Define the GraphQL mutation
export const UPDATE_LIST_SETTINGS = gql`
  mutation UpdateListSettings($input: UpdateListSettingsInput!) {
    updateListSettings(input: $input) {
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
