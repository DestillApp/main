import { initialResultsForm } from "@/helpers/formsInitialState";
import type {
  ResultsForm,
  ResultsDistillation,
  ResultsPlant,
} from "@/types/forms/resultsForm";

/**
 * Results module mutations for updating the state.
 * @module resultsMutations
 */

/**
 * Represents the state for the results module.
 * @interface
 * @property {ResultsForm} resultsForm - The results form state.
 */
interface State {
  resultsForm: ResultsForm;
}

type ResultsFormKey = keyof ResultsForm;
type ResultsDistillationKey = keyof ResultsDistillation;
type ResultsPlantKey = keyof ResultsPlant;
type DistillationTimeKey = "distillationHours" | "distillationMinutes";

/**
 * Payload for changing a value in the results form.
 * @template K
 * @property {K} input - The key of the field to change.
 * @property {ResultsForm[K]} value - The new value for the field.
 */
type ChangeValuePayload<K extends ResultsFormKey> = {
  input: K;
  value: ResultsForm[K];
};

/**
 * Payload for changing a value in the distillationData object.
 * @template K
 * @property {K} input - The key of the field to change.
 * @property {ResultsDistillation[K]} value - The new value for the field.
 */
type ChangeDistillationDataPayload<K extends ResultsDistillationKey> = {
  input: K;
  value: ResultsDistillation[K];
};

/**
 * Payload for changing a value in the distilledPlant object.
 * @template K
 * @property {K} input - The key of the field to change.
 * @property {ResultsPlant[K]} value - The new value for the field.
 */
type ChangePlantDataPayload<K extends ResultsPlantKey> = {
  input: K;
  value: ResultsPlant[K];
};

/**
 * Payload for changing a value in the distillationTime object.
 * @property {DistillationTimeKey} input - The key of the field to change.
 * @property {number} value - The new value for the field.
 */
type ChangeDistillationTimePayload = {
  input: DistillationTimeKey;
  value: number;
};

export default {
  /**
   * Mutation to change the value of a field in the results form.
   * @param {State} state - The current state object.
   * @param {ChangeValuePayload<K>} payload - Payload containing the input field name and its new value.
   * @returns {void}
   */
  changeValue<K extends ResultsFormKey>(
    state: State,
    { input, value }: ChangeValuePayload<K>
  ): void {
    state.resultsForm[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * Mutation to change a value to an integer value in the results form.
   * @param {State} state - The current state object.
   * @param {{ input: string; value: number; object?: "isTime" | "isDistillation" }} payload - Payload containing the input field name, its new integer value, and the object type.
   * @returns {void}
   */
  changeIntegerNumber(
    state: State,
    {
      input,
      value,
      object,
    }: { input: string; value: number; object?: "isTime" | "isDistillation" }
  ): void {
    const integerNumber = parseInt(String(value), 10);
    if (object === "isTime") {
      (state.resultsForm.distillationData.distillationTime as any)[input] =
        integerNumber;
    }
    if (object === "isDistillation") {
      (state.resultsForm.distillationData as any)[input] = integerNumber;
    }
    localStorage.setItem(input, JSON.stringify(integerNumber));
  },

  /**
   * Mutation to change the format of a number value in the results form.
   * @param {State} state - The current state object.
   * @param {{ input: string; value: number; decimals?: number }} payload - Payload containing the input field name, its new number value, and optional decimals.
   * @returns {void}
   */
  changeNumberFormat(
    state: State,
    {
      input,
      value,
      decimals,
    }: { input: string; value: number; decimals?: number }
  ): void {
    const formatedNumber =
      decimals !== undefined
        ? parseFloat(Number(value).toFixed(decimals))
        : parseFloat(Number(value).toFixed(1));
    (state.resultsForm as any)[input] = formatedNumber;
    localStorage.setItem(input, JSON.stringify(formatedNumber));
  },

  /**
   * Mutation to change the value of a field inside distillationData in the results form.
   * @param {State} state - The current state object.
   * @param {ChangeDistillationDataPayload<K>} payload - Payload containing the input field name and its new value for distillationData.
   * @returns {void}
   */
  changeDistillationDataValue<K extends ResultsDistillationKey>(
    state: State,
    { input, value }: ChangeDistillationDataPayload<K>
  ): void {
    state.resultsForm.distillationData[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * Mutation to change the value of a field inside distilledPlant in the results form.
   * @param {State} state - The current state object.
   * @param {ChangePlantDataPayload<K>} payload - Payload containing the input field name and its new value for distilledPlant.
   * @returns {void}
   */
  changePlantDataValue<K extends ResultsPlantKey>(
    state: State,
    { input, value }: ChangePlantDataPayload<K>
  ): void {
    state.resultsForm.distilledPlant[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * Mutation to change the value of distillationHours and distillationMinutes inside distillationTime in the results form.
   * @param {State} state - The current state object.
   * @param {ChangeDistillationTimePayload} payload - Payload containing the input field name and its new value for distillationTime.
   * @returns {void}
   */
  changeDistillationTimeValue(
    state: State,
    { input, value }: ChangeDistillationTimePayload
  ): void {
    state.resultsForm.distillationData.distillationTime[input] = value;
    localStorage.setItem(input, JSON.stringify(value));
  },

  /**
   * Mutation to reset the resultsForm and remove resultsForm from localStorage.
   * @param {State} state - The current state object.
   * @returns {void}
   */
  resetResultsForm(state: State): void {
    state.resultsForm = JSON.parse(JSON.stringify(initialResultsForm));
  },
};
