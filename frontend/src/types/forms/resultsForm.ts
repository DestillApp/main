import { DistillationForm } from "@/types/forms/distillationForm";
import { PlantForm } from "@/types/forms/plantForm";

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
