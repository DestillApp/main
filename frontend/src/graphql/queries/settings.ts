import { gql } from "@apollo/client/core";

/**
 * GraphQL query to fetch user settings including list settings, sorting, distiller list, and theme.
 * @constant
 * @type {import("@apollo/client/core").DocumentNode}
 */
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
