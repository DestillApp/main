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

/**
 * Enum for available distillation types.
 */
export enum DistillationType {
  WODNA = "wodna",
  WODNO_PAROWA = "wodno-parowa",
  PAROWA = "parowa",
}

/**
 * Enum for plant state options.
 */
export enum PlantState {
  ŚWIEŻY = "świeży",
  PODSUSZONY = "podsuszony",
  SUCHY = "suchy",
}

/**
 * Enum for plant origin options.
 */
export enum PlantOrigin {
  ZBIÓR = "zbiór",
  KUPNO = "kupno",
}
