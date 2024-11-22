import { gql } from "@apollo/client/core";

// GraphQL query to retrieve country names based on a given name.
export const GET_COUNTRY_NAMES = gql`
  query GetCountryNames($name: String!) {
    getCountryNames(name: $name)
  }
`;
