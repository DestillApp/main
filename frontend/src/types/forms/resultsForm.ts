import { DistillationForm } from "@/types/forms/distillationForm";
import { NormalizedPlantById, PlantForm } from "@/types/forms/plantForm";

export interface ResultsDistillation
  extends Omit<
    DistillationForm,
    "choosedPlant" | "initialWeightForDistillation"
  > {}

export interface ResultsPlant
  extends Omit<PlantForm, "harvestRange" | "plantWeight" | "availableWeight"> {}

export interface ResultsForm {
  oilAmount: number | null;
  hydrosolAmount: number | null;
  hydrosolpH: number | null;
  oilDescription: string;
  hydrosolDescription: string;
  distillationData: ResultsDistillation;
  distilledPlant: ResultsPlant;
}

export interface DistillationArchivePlant
  extends Omit<NormalizedPlantById, "availableWeight" | "plantWeight"> {}

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
