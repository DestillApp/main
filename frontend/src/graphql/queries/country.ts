import { gql } from "@apollo/client/core";

/**
 * GraphQL query to retrieve country names based on a given name.
 * @constant
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const GET_COUNTRY_NAMES = gql`
  query GetCountryNames($name: String!) {
    getCountryNames(name: $name)
  }
`;
