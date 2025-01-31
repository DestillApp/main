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

// Define the GraphQL mutation
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
