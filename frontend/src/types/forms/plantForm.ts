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
