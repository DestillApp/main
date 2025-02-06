import { gql } from "@apollo/client/core";

export const GET_USER_SETTINGS = gql`
  query GetUserSettings {
    getUserSettings {
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
      distillerList {
        material
        capacity
        heating
        id
      }
      isDarkTheme
    }
  }
`;
