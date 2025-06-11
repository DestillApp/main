import type { PlantForm } from "@/types/forms/plantForm";
import type { DistillationForm } from "@/types/forms/distillationForm";
import type { ResultsForm } from "@/types/forms/resultsForm";

/**
 * The initial state for the plant form.
 * @type {PlantForm}
 */
export const initialPlantForm: PlantForm = {
  plantName: "",
  plantPart: "",
  plantOrigin: "",
  plantBuyDate: "",
  plantProducer: "",
  countryOfOrigin: "",
  harvestDate: "",
  harvestTemperature: null,
  harvestRange: [600, 900],
  harvestStartTime: "10:00",
  harvestEndTime: "15:00",
  plantWeight: null,
  availableWeight: null,
  plantState: "",
  dryingTime: null,
  plantAge: null,
};

/**
 * The initial state for the distillation form.
 * @type {DistillationForm}
 */
export const initialDistillationForm: DistillationForm = {
  choosedPlant: {
    id: null,
    name: "",
    part: "",
    availableWeight: null,
    harvestDate: "",
    buyDate: "",
  },
  weightForDistillation: null,
  initialWeightForDistillation: null,
  isPlantSoaked: false,
  soakingTime: null,
  weightAfterSoaking: null,
  isPlantShredded: false,
  distillationType: "",
  distillationDate: "",
  distillationApparatus: "",
  waterForDistillation: null,
  distillationTime: {
    distillationHours: null,
    distillationMinutes: null,
  },
};

/**
 * The initial state for the results form.
 * @type {ResultsForm}
 */
export const initialResultsForm: ResultsForm = {
  oilAmount: null,
  hydrosolAmount: null,
  hydrosolpH: null,
  oilDescription: "",
  hydrosolDescription: "",
  distillationData: {
    weightForDistillation: null,
    isPlantSoaked: false,
    soakingTime: null,
    weightAfterSoaking: null,
    isPlantShredded: false,
    distillationType: "",
    distillationDate: "",
    distillationApparatus: "",
    waterForDistillation: null,
    distillationTime: {
      distillationHours: null,
      distillationMinutes: null,
    },
  },
  distilledPlant: {
    plantName: "",
    plantPart: "",
    plantOrigin: "",
    plantBuyDate: "",
    plantProducer: "",
    countryOfOrigin: "",
    harvestDate: "",
    harvestTemperature: null,
    harvestStartTime: "10:00",
    harvestEndTime: "15:00",
    plantState: "",
    dryingTime: null,
    plantAge: null,
  },
};
