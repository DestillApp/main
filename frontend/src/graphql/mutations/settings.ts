import { gql } from "@apollo/client/core";

/**
 * GraphQL mutation to create initial user settings.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
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
      distillerList {
        id
        material
        capacity
        heating
      }
      updatedAt
    }
  }
`;

/**
 * GraphQL mutation to update list settings.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
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

/**
 * GraphQL mutation to update list sorting settings.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const UPDATE_LIST_SORTING = gql`
  mutation UpdateListSorting($input: UpdateListSortingInput!) {
    updateListSorting(input: $input) {
      userId
      listSorting {
        plantListSorting
        distillationListSorting
        archiveDistillationListSorting
      }
      updatedAt
    }
  }
`;

/**
 * GraphQL mutation to add a distiller to the user's distiller list.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const ADD_DISTILLER = gql`
  mutation AddDistiller($distiller: DistillerInput!) {
    addDistiller(distiller: $distiller) {
      userId
      distillerList {
        material
        capacity
        heating
      }
      updatedAt
    }
  }
`;

/**
 * GraphQL mutation to delete a distiller from the user's distiller list.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const DELETE_DISTILLER = gql`
  mutation DeleteDistiller($distillerId: ID!) {
    deleteDistiller(distillerId: $distillerId) {
      userId
      distillerList {
        id
        material
        capacity
        heating
      }
      updatedAt
    }
  }
`;

/**
 * GraphQL mutation to update the dark theme setting.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const UPDATE_DARK_THEME = gql`
  mutation UpdateDarkTheme($isDarkTheme: Boolean!) {
    updateDarkTheme(isDarkTheme: $isDarkTheme) {
      userId
      isDarkTheme
      updatedAt
    }
  }
`;
