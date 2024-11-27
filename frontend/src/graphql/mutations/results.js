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

// export const CREATE_DISTILLATION_ARCHIVE = gql`
//   mutation createDistillationArchive($input: DistillationArchiveInput!) {
//     createDistillationArchive(distillationArchiveInput: $input) {
//       _id
//       oilAmount
//       hydrosolAmount
//       hydrosolpH
//       oilDescription
//       hydrosolDescription
//       distillationData {
//         weightForDistillation
//         isPlantSoaked
//         soakingTime
//         weightAfterSoaking
//         isPlantShredded
//         distillationType
//         distillationDate
//         distillationApparatus
//         waterForDistillation
//         distillationTime {
//           distillationHours
//           distillationMinutes
//         }
//       }
//       distilledPlant {
//         plantName
//         plantPart
//         plantOrigin
//         plantBuyDate
//         plantProducer
//         countryOfOrigin
//         harvestDate
//         harvestTemperature
//         harvestStartTime
//         harvestEndTime
//         plantWeight
//         availableWeight
//         plantState
//         dryingTime
//         plantAge
//       }
//     }
//   }
// `;
