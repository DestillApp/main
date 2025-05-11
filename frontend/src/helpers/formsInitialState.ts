import { PlantForm } from "@/types/forms/plantForm";
import { DistillationForm } from "@/types/forms/distillationForm";
import { ResultsForm } from "@/types/forms/resultsForm";

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
  isPlantSoaked: false,
  soakingTime: null,
  weightAfterSoaking: null,
};

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
