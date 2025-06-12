/**
 * Interface representing the structure of the choosedPlant object.
 * @property {string | null} id - The unique identifier of the plant or null if not set.
 * @property {string} name - The name of the plant.
 * @property {string} part - The part of the plant used.
 * @property {number | null} availableWeight - The available weight of the plant.
 * @property {string} harvestDate - The date the plant was harvested.
 * @property {string} buyDate - The date the plant was bought.
 */
export interface FormChoosedPlant {
  id: string | null;
  name: string;
  part: string;
  availableWeight: number | null;
  harvestDate: string;
  buyDate: string;
}

/**
 * Interface representing a selected plant with required fields.
 * @interface
 * @property {string} id - The unique identifier of the plant.
 * @property {string} name - The name of the plant.
 * @property {string} part - The part of the plant used.
 * @property {number} availableWeight - The available weight of the plant.
 * @property {string} [harvestDate] - The date the plant was harvested (optional).
 * @property {string} [buyDate] - The date the plant was bought (optional).
 */
export interface ChoosedPlant extends Pick<FormChoosedPlant, "name" | "part"> {
  id: string;
  availableWeight: number;
  harvestDate?: string;
  buyDate?: string;
}

/**
 * Interface representing a short version of a plant.
 * @interface
 */
export interface ShortPlant
  extends Omit<ChoosedPlant, "availableWeight" | "harvestDate" | "buyDate"> {}

/**
 * Interface representing the structure of the distillation time.
 * @interface
 * @property {number | null} distillationHours - The number of hours for distillation.
 * @property {number | null} distillationMinutes - The number of minutes for distillation.
 */
export interface DistillationTime {
  distillationHours: number | null;
  distillationMinutes: number | null;
}

/**
 * Interface representing the structure of the distillation form.
 * @interface
 * @property {FormChoosedPlant} choosedPlant - The selected plant for distillation.
 * @property {number | null} weightForDistillation - The weight used for distillation.
 * @property {number | null} initialWeightForDistillation - The initial weight for distillation.
 * @property {boolean} isPlantSoaked - Whether the plant is soaked.
 * @property {number | null} soakingTime - The soaking time in minutes.
 * @property {number | null} weightAfterSoaking - The weight after soaking.
 * @property {boolean} isPlantShredded - Whether the plant is shredded.
 * @property {string} distillationType - The type of distillation.
 * @property {string} distillationDate - The date of distillation.
 * @property {string} distillationApparatus - The apparatus used for distillation.
 * @property {number | null} waterForDistillation - The amount of water used for distillation.
 * @property {DistillationTime} distillationTime - The distillation time.
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

/**
 * Interface representing the distillation form data for submission.
 * @interface
 */
export interface DistillationFormSubmit
  extends Omit<DistillationForm, "initialWeightForDistillation"> {}

/**
 * Interface representing the structure of a distillation fetched by ID.
 * @interface
 * @property {string} _id - The unique identifier of the distillation.
 * @property {ShortPlant} choosedPlant - The selected plant.
 * @property {number} weightForDistillation - The weight used for distillation.
 * @property {boolean} isPlantSoaked - Whether the plant is soaked.
 * @property {number | null} soakingTime - The soaking time in minutes.
 * @property {number | null} weightAfterSoaking - The weight after soaking.
 * @property {boolean} isPlantShredded - Whether the plant is shredded.
 * @property {string} distillationType - The type of distillation.
 * @property {string} distillationDate - The date of distillation.
 * @property {string} distillationApparatus - The apparatus used for distillation.
 * @property {number} waterForDistillation - The amount of water used for distillation.
 * @property {DistillationTime} distillationTime - The distillation time.
 */
export interface GetDistillationById {
  _id: string;
  choosedPlant: ShortPlant;
  weightForDistillation: number;
  isPlantSoaked: boolean;
  soakingTime: number | null;
  weightAfterSoaking: number | null;
  isPlantShredded: boolean;
  distillationType: string;
  distillationDate: string;
  distillationApparatus: string;
  waterForDistillation: number;
  distillationTime: DistillationTime;
}
