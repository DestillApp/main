import { gql } from "@apollo/client/core";

// GraphQL query to fetch the all archived distillations or all archived distillation with the same name.
export const GET_DISTILLATION_ARCHIVES = gql`
  query GetDistillationArchives($fields: [String]!, $name: String) {
    getDistillationArchives(fields: $fields, name: $name) {
      _id
      oilAmount
      hydrosolAmount
      distillationData {
        distillationType
        distillationDate
      }
      distilledPlant {
        plantName
        plantPart
      }
    }
  }
`;
