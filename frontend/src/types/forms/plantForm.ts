/**
 * Interface representing the structure of the plant form.
 */
export interface PlantForm {
  plantName: string;
  plantPart: string;
  plantOrigin: string;
  plantBuyDate: string;
  plantProducer: string;
  countryOfOrigin: string;
  harvestDate: string;
  harvestTemperature: number | null;
  harvestRange: [number, number];
  harvestStartTime: string;
  harvestEndTime: string;
  plantWeight: number | null;
  availableWeight: number | null;
  plantState: string;
  dryingTime: number | null;
  plantAge: number | null;
}

export interface BasicPlant {
  _id: string;
  plantName: string;
  plantPart: string;
  availableWeight: number;
  harvestDate?: string;
  plantBuyDate?: string;
}

export interface PlantFormSubmit extends Omit<PlantForm, "harvestRange"> {}

export interface GetPlantById {
  _id: string;
  plantName: string;
  plantPart: string;
  plantOrigin: string;
  plantBuyDate: string | null;
  plantProducer: string | null;
  countryOfOrigin: string | null;
  harvestDate: string | null;
  harvestTemperature: number | null;
  harvestStartTime: string | null;
  harvestEndTime: string | null;
  plantWeight: number;
  availableWeight: number;
  plantState: string;
  dryingTime: number | null;
  plantAge: number | null;
}

export interface NormalizedPlantById {
  _id: string;
  plantName: string;
  plantPart: string;
  plantOrigin: string;
  plantBuyDate: string;
  plantProducer: string;
  countryOfOrigin: string;
  harvestDate: string;
  harvestTemperature: number | null;
  harvestStartTime: string;
  harvestEndTime: string;
  plantWeight: number;
  availableWeight: number;
  plantState: string;
  dryingTime: number | null;
  plantAge: number | null;
}
