/**
 * Interface representing the structure of the choosedPlant object.
 */
export interface FormChoosedPlant {
  id: string | null;
  name: string;
  part: string;
  availableWeight: number | null;
  harvestDate: string;
  buyDate: string;
}

export interface ChoosedPlant extends Pick<FormChoosedPlant, "name" | "part"> {
  id: string;
  availableWeight: number;
  harvestDate?: string;
  buyDate?: string;
}

/*
 * Interface representing the structure of the distillation time.
 */
export interface DistillationTime {
  distillationHours: number | null;
  distillationMinutes: number | null;
}

/**
 * Interface representing the structure of the distillation form.
 */
export interface DistillationForm {
  choosedPlant: FormChoosedPlant;
  weightForDistillation: number | null;
  initialWeightForDistillation: number | null;
  isPlantSoaked: boolean;
  soakingTime: number | null;
  weightAfterSoaking: number | null;
  isPlantShredded: boolean;
  distillationType: string;
  distillationDate: string;
  distillationApparatus: string;
  waterForDistillation: number | null;
  distillationTime: DistillationTime;
}

export interface DistillationFormSubmit
  extends Omit<DistillationForm, "initialWeightForDistillation"> {}
