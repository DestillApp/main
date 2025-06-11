import type {
  DistillationForm,
  DistillationFormSubmit,
} from "@/types/forms/distillationForm";

import type { PlantForm, PlantFormSubmit } from "@/types/forms/plantForm";

import type { ResultsForm } from "@/types/forms/resultsForm";

/**
 * Maps a DistillationForm object to a DistillationFormSubmit object.
 * @param {DistillationForm} form - The DistillationForm object to map.
 * @returns {DistillationFormSubmit} The mapped DistillationFormSubmit object.
 */
export const mapDistillationForm = (
  form: DistillationForm
): DistillationFormSubmit => ({
  choosedPlant: {
    id: form.choosedPlant.id,
    name: form.choosedPlant.name,
    part: form.choosedPlant.part,
    availableWeight: form.choosedPlant.availableWeight,
    harvestDate: form.choosedPlant.harvestDate,
    buyDate: form.choosedPlant.buyDate,
  },
  weightForDistillation: form.weightForDistillation,
  isPlantSoaked: form.isPlantSoaked,
  soakingTime: form.soakingTime,
  weightAfterSoaking: form.weightAfterSoaking,
  isPlantShredded: form.isPlantShredded,
  distillationType: form.distillationType,
  distillationDate: form.distillationDate,
  distillationApparatus: form.distillationApparatus,
  waterForDistillation: form.waterForDistillation,
  distillationTime: {
    distillationHours: form.distillationTime.distillationHours,
    distillationMinutes: form.distillationTime.distillationMinutes,
  },
});

/**
 * Maps a PlantForm object to a PlantFormSubmit object.
 * @param {PlantForm} form - The PlantForm object to map.
 * @returns {PlantFormSubmit} The mapped PlantFormSubmit object.
 */
export const mapPlantForm = (form: PlantForm): PlantFormSubmit => ({
  plantName: form.plantName,
  plantPart: form.plantPart,
  plantOrigin: form.plantOrigin,
  plantBuyDate: form.plantBuyDate,
  plantProducer: form.plantProducer,
  countryOfOrigin: form.countryOfOrigin,
  harvestDate: form.harvestDate,
  harvestTemperature: form.harvestTemperature,
  harvestStartTime: form.harvestStartTime,
  harvestEndTime: form.harvestEndTime,
  plantWeight: form.plantWeight,
  availableWeight: form.plantWeight,
  plantState: form.plantState,
  dryingTime: form.dryingTime,
  plantAge: form.plantAge,
});

/**
 * Maps a ResultsForm object to a ResultsForm object (deep copy).
 * @param {ResultsForm} form - The ResultsForm object to map.
 * @returns {ResultsForm} The mapped ResultsForm object.
 */
export const mapResultsForm = (form: ResultsForm): ResultsForm => ({
  oilAmount: form.oilAmount,
  hydrosolAmount: form.hydrosolAmount,
  hydrosolpH: form.hydrosolpH,
  oilDescription: form.oilDescription,
  hydrosolDescription: form.hydrosolDescription,
  distillationData: {
    weightForDistillation: form.distillationData.weightForDistillation,
    isPlantSoaked: form.distillationData.isPlantSoaked,
    soakingTime: form.distillationData.soakingTime,
    weightAfterSoaking: form.distillationData.weightAfterSoaking,
    isPlantShredded: form.distillationData.isPlantShredded,
    distillationType: form.distillationData.distillationType,
    distillationDate: form.distillationData.distillationDate,
    distillationApparatus: form.distillationData.distillationApparatus,
    waterForDistillation: form.distillationData.waterForDistillation,
    distillationTime: {
      distillationHours:
        form.distillationData.distillationTime.distillationHours,
      distillationMinutes:
        form.distillationData.distillationTime.distillationMinutes,
    },
  },
  distilledPlant: {
    plantName: form.distilledPlant.plantName,
    plantPart: form.distilledPlant.plantPart,
    plantOrigin: form.distilledPlant.plantOrigin,
    plantBuyDate: form.distilledPlant.plantBuyDate,
    plantProducer: form.distilledPlant.plantProducer,
    countryOfOrigin: form.distilledPlant.countryOfOrigin,
    harvestDate: form.distilledPlant.harvestDate,
    harvestTemperature: form.distilledPlant.harvestTemperature,
    harvestStartTime: form.distilledPlant.harvestStartTime,
    harvestEndTime: form.distilledPlant.harvestEndTime,
    plantState: form.distilledPlant.plantState,
    dryingTime: form.distilledPlant.dryingTime,
    plantAge: form.distilledPlant.plantAge,
  },
});
