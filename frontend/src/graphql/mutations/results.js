import { gql } from "@apollo/client/core";

// GraphQL mutation to create a new distillation archive
export const CREATE_DISTILLATION_ARCHIVE = gql`
  mutation createDistillationArchive($input: DistillationArchiveInput!) {
    createDistillationArchive(distillationArchiveInput: $input) {
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

// GraphQL mutation to delete plant by ID
export const DELETE_DISTILLATION_ARCHIVE = gql`
  mutation DeleteDistillationArchive($id: ID!) {
    deleteDistillationArchive(id: $id)
  }
`;
