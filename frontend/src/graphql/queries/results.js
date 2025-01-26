import { gql } from "@apollo/client/core";

// GraphQL query to fetch the all archived distillations or all archived distillation with the same name.
export const GET_DISTILLATION_ARCHIVES = gql`
  query GetDistillationArchives($fields: [String]!, $name: String, $sorting: String, $formatDates: Boolean!) {
    getDistillationArchives(fields: $fields, name: $name, sorting: $sorting, formatDates: $formatDates) {
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

// GraphQL query to fetch archive distillation details by ID
export const GET_ARCHIVE_DISTILLATION_BY_ID = gql`
  query GetArchiveDistillationById($id: ID!, $formatDistillDate: Boolean!) {
    getArchiveDistillationById(id: $id, formatDistillDate: $formatDistillDate) {
      _id
      oilAmount
      hydrosolAmount
      hydrosolpH
      oilDescription
      hydrosolDescription
      distillationData {
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
      distilledPlant {
        plantName
        plantPart
        plantOrigin
        plantBuyDate
        plantProducer
        countryOfOrigin
        harvestDate
        harvestTemperature
        harvestStartTime
        harvestEndTime
        plantState
        dryingTime
        plantAge
      }
    }
  }
`;
