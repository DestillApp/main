import {
  DistillationForm,
  DistillationFormSubmit,
} from "@/types/forms/distillationForm";

import { PlantForm, PlantFormSubmit } from "@/types/forms/plantForm";

/**
 * Maps a DistillationForm object to a DistillationFormSubmit object.
 * @param form - The DistillationForm object to map.
 * @returns The mapped DistillationFormSubmit object.
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
