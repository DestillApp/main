import { DistillationForm } from "@/types/forms/distillationForm";
import { NormalizedPlantById, PlantForm } from "@/types/forms/plantForm";

/**
 * Interface representing the distillation data in the results form.
 * @interface
 * @augments Omit<DistillationForm, "choosedPlant" | "initialWeightForDistillation">
 */
export interface ResultsDistillation
  extends Omit<
    DistillationForm,
    "choosedPlant" | "initialWeightForDistillation"
  > {}

/**
 * Interface representing the plant data in the results form.
 * @interface
 * @augments Omit<PlantForm, "harvestRange" | "plantWeight" | "availableWeight">
 */
export interface ResultsPlant
  extends Omit<PlantForm, "harvestRange" | "plantWeight" | "availableWeight"> {}

/**
 * Interface representing the structure of the results form.
 * @interface
 * @property {number | null} oilAmount - The amount of oil obtained.
 * @property {number | null} hydrosolAmount - The amount of hydrosol obtained.
 * @property {number | null} hydrosolpH - The pH of the hydrosol.
 * @property {string} oilDescription - The description of the oil.
 * @property {string} hydrosolDescription - The description of the hydrosol.
 * @property {ResultsDistillation} distillationData - The distillation data.
 * @property {ResultsPlant} distilledPlant - The distilled plant data.
 */
export interface ResultsForm {
  oilAmount: number | null;
  hydrosolAmount: number | null;
  hydrosolpH: number | null;
  oilDescription: string;
  hydrosolDescription: string;
  distillationData: ResultsDistillation;
  distilledPlant: ResultsPlant;
}

/**
 * Interface representing a plant in the distillation archive.
 * @interface
 * @augments Omit<NormalizedPlantById, "availableWeight" | "plantWeight">
 */
export interface DistillationArchivePlant
  extends Omit<NormalizedPlantById, "availableWeight" | "plantWeight"> {}

/**
 * Interface representing a distillation archive entry.
 * @interface
 * @property {string} _id - The unique identifier for the archive entry.
 * @property {number} oilAmount - The amount of oil obtained.
 * @property {number} hydrosolAmount - The amount of hydrosol obtained.
 * @property {number} hydrosolpH - The pH of the hydrosol.
 * @property {string} oilDescription - The description of the oil.
 * @property {string} hydrosolDescription - The description of the hydrosol.
 * @property {ResultsDistillation} distillationData - The distillation data.
 * @property {DistillationArchivePlant} distilledPlant - The distilled plant data.
 */
export interface DistillationArchive {
  _id: string;
  oilAmount: number;
  hydrosolAmount: number;
  hydrosolpH: number;
  oilDescription: string;
  hydrosolDescription: string;
  distillationData: ResultsDistillation;
  distilledPlant: DistillationArchivePlant;
}
