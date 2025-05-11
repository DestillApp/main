import {
  DistillationForm,
  DistillationFormSubmit,
} from "@/types/forms/distillationForm";

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
