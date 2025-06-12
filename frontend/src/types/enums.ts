/**
 * Enum representing sorting options for lists.
 * @enum {string}
 * @property {string} PlantName - Sort by plant name.
 * @property {string} CreatedAt - Sort by creation date.
 * @property {string} YoungDate - Sort by youngest date.
 * @property {string} OldDate - Sort by oldest date.
 */
export enum ListSortingOptions {
  PlantName = "plantName",
  CreatedAt = "createdAt",
  YoungDate = "youngDate",
  OldDate = "oldDate",
}
