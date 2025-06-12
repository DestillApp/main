/**
 * Interface representing the structure of the plant form.
 * @interface
 * @property {string} plantName - The name of the plant.
 * @property {string} plantPart - The part of the plant.
 * @property {string} plantOrigin - The origin of the plant.
 * @property {string} plantBuyDate - The date the plant was bought.
 * @property {string} plantProducer - The producer of the plant.
 * @property {string} countryOfOrigin - The country of origin.
 * @property {string} harvestDate - The date of harvest.
 * @property {number | null} harvestTemperature - The temperature at harvest.
 * @property {[number, number]} harvestRange - The range of harvest times.
 * @property {string} harvestStartTime - The start time of harvest.
 * @property {string} harvestEndTime - The end time of harvest.
 * @property {number | null} plantWeight - The weight of the plant.
 * @property {number | null} availableWeight - The available weight of the plant.
 * @property {string} plantState - The state of the plant.
 * @property {number | null} dryingTime - The drying time.
 * @property {number | null} plantAge - The age of the plant.
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

/**
 * Interface representing a basic plant.
 * @interface
 * @property {string} _id - The unique identifier of the plant.
 * @property {string} plantName - The name of the plant.
 * @property {string} plantPart - The part of the plant.
 * @property {number} availableWeight - The available weight of the plant.
 * @property {string} [harvestDate] - The date of harvest (optional).
 * @property {string} [plantBuyDate] - The date the plant was bought (optional).
 */
export interface BasicPlant {
  _id: string;
  plantName: string;
  plantPart: string;
  availableWeight: number;
  harvestDate?: string;
  plantBuyDate?: string;
}

/**
 * Interface representing the plant form data for submission.
 * @interface
 */
export interface PlantFormSubmit extends Omit<PlantForm, "harvestRange"> {}

/**
 * Interface representing a plant fetched by ID.
 * @interface
 * @property {string} _id - The unique identifier of the plant.
 * @property {string} plantName - The name of the plant.
 * @property {string} plantPart - The part of the plant.
 * @property {string} plantOrigin - The origin of the plant.
 * @property {string | null} plantBuyDate - The date the plant was bought.
 * @property {string | null} plantProducer - The producer of the plant.
 * @property {string | null} countryOfOrigin - The country of origin.
 * @property {string | null} harvestDate - The date of harvest.
 * @property {number | null} harvestTemperature - The temperature at harvest.
 * @property {string | null} harvestStartTime - The start time of harvest.
 * @property {string | null} harvestEndTime - The end time of harvest.
 * @property {number} plantWeight - The weight of the plant.
 * @property {number} availableWeight - The available weight of the plant.
 * @property {string} plantState - The state of the plant.
 * @property {number | null} dryingTime - The drying time.
 * @property {number | null} plantAge - The age of the plant.
 */
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

/**
 * Interface representing a normalized plant fetched by ID.
 * @interface
 * @property {string} _id - The unique identifier of the plant.
 * @property {string} plantName - The name of the plant.
 * @property {string} plantPart - The part of the plant.
 * @property {string} plantOrigin - The origin of the plant.
 * @property {string} plantBuyDate - The date the plant was bought.
 * @property {string} plantProducer - The producer of the plant.
 * @property {string} countryOfOrigin - The country of origin.
 * @property {string} harvestDate - The date of harvest.
 * @property {number | null} harvestTemperature - The temperature at harvest.
 * @property {string} harvestStartTime - The start time of harvest.
 * @property {string} harvestEndTime - The end time of harvest.
 * @property {number} plantWeight - The weight of the plant.
 * @property {number} availableWeight - The available weight of the plant.
 * @property {string} plantState - The state of the plant.
 * @property {number | null} dryingTime - The drying time.
 * @property {number | null} plantAge - The age of the plant.
 */
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
