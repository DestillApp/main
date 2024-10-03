import { gql } from "@apollo/client/core";

// GraphQL query to fetch the all plants or all the plants with the same name.
export const GET_DISTILLATIONS = gql`
  query GetDistillations($fields: [String]!, $name: String) {
    getDistillations(fields: $fields, name: $name) {
      choosedPlant {
        name
        part
      }
      distillationType
      distillationDate
      _id
    }
  }
`;
