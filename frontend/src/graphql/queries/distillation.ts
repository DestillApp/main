import { gql } from "@apollo/client/core";

/**
 * GraphQL query to fetch all distillations or distillations with the same name.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const GET_DISTILLATIONS = gql`
  query GetDistillations($fields: [String]!, $name: String, $sorting: String) {
    getDistillations(fields: $fields, name: $name, sorting: $sorting) {
      choosedPlant {
        id
        name
        part
      }
      weightForDistillation
      distillationType
      distillationDate
      _id
    }
  }
`;

/**
 * GraphQL query to get distillation details by ID with optional date formatting.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const GET_DISTILLATION_BY_ID = gql`
  query GetDistillationById($id: ID!, $formatDates: Boolean!) {
    getDistillationById(id: $id, formatDates: $formatDates) {
      _id
      choosedPlant {
        id
        name
        part
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
