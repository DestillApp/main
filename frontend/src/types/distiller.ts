/**
 * Interface for distiller object.
 * @interface
 * @property {string} id
 * @property {string} material
 * @property {number} capacity
 * @property {string} heating
 */
export interface Distiller {
  material: string;
  capacity: number;
  heating: string;
}

/**
 *  Interface for a distiller object with an additional unique identifier.
 * @interface DistillerWithId
 * @property {string} id - The unique identifier for the distiller.
 * @property {string} material - The material of the distiller.
 * @property {number} capacity - The capacity of the distiller.
 * @property {string} heating - The heating type of the distiller.
 */
export interface DistillerWithId extends Distiller {
  id: string;
}
