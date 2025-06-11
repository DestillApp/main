import {
  setTimeFromMinutesAmount,
  getMinutesFromTime,
} from "@/helpers/dateHelpers";
import { initialPlantForm } from "@/helpers/formsInitialState";
import type { PlantForm } from "@/types/forms/plantForm";

/**
 * Plant module mutations for updating the state.
 * @module plantMutations
 */

/**
 * Represents the state for the plant module.
 * @interface
 * @property {PlantForm} plantForm - The plant form state.
 */
interface State {
  plantForm: PlantForm;
}

type PlantFormKey = keyof PlantForm;

/**
 * Payload for changing a value in the plant form.
 * @template K
 * @property {K} input - The key of the field to change.
 * @property {PlantForm[K]} value - The new value for the field.
 */
type ChangeValuePayload<K extends PlantFormKey> = {
  input: K;
  value: PlantForm[K];
};

/**
 * Payload for changing a numeric value in the plant form.
 * @template K
 * @property {K} input - The key of the field to change.
 * @property {number} value - The new numeric value for the field.
 */
type ChangeValuePayloadNumber<K extends PlantFormKey> = {
  input: K;
  value: number;
};

export default {
  /**
   * Mutation to change the value of a field in the plant form.
   * @param {State} state - The current state object.
   * @param {ChangeValuePayload<K>} payload - Payload containing the input field name and its new value.
   * @returns {void}
   */
  changeValue<K extends keyof PlantForm>(
    state: State,
    { input, value }: ChangeValuePayload<K>
  ): void {
    state.plantForm[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * Mutation to change a value to an integer value in the plant form.
   * @param {State} state - The current state object.
   * @param {{ input: "dryingTime" | "plantAge" | "harvestTemperature"; value: number }} payload - Payload containing the input field name and its new integer value.
   * @returns {void}
   */
  changeIntegerNumber(
    state: State,
    {
      input,
      value,
    }: {
      input: "dryingTime" | "plantAge" | "harvestTemperature";
      value: number;
    }
  ): void {
    const integerNumber = parseInt(String(value), 10);
    state.plantForm[input] = integerNumber;
    localStorage.setItem(input as string, JSON.stringify(integerNumber));
  },

  /**
   * Mutation to change the format of the start time for harvesting.
   * @param {State} state - The current state object.
   * @returns {void}
   */
  changeStartTimeFormat(state: State): void {
    const startTime = setTimeFromMinutesAmount(state.plantForm.harvestRange[0]);
    state.plantForm.harvestStartTime = startTime;
    localStorage.setItem("harvestStartTime", JSON.stringify(startTime));
  },

  /**
   * Mutation to change the format of the end time for harvesting.
   * @param {State} state - The current state object.
   * @returns {void}
   */
  changeEndTimeFormat(state: State): void {
    const endTime = setTimeFromMinutesAmount(state.plantForm.harvestRange[1]);
    state.plantForm.harvestEndTime = endTime;
    localStorage.setItem("harvestEndTime", JSON.stringify(endTime));
  },

  /**
   * Mutation to change the harvest range by formatting the harvestStartTime and harvestEndTime.
   * @param {State} state - The current state object.
   * @returns {void}
   */
  changeHarvestRange(state: State): void {
    if (state.plantForm.harvestStartTime || state.plantForm.harvestEndTime) {
      const startMinutes = getMinutesFromTime(state.plantForm.harvestStartTime);
      const endMinutes = getMinutesFromTime(state.plantForm.harvestEndTime);
      const range: [number, number] = [startMinutes, endMinutes];
      state.plantForm.harvestRange = range;
      localStorage.setItem("harvestRange", JSON.stringify(range));
    } else {
      const range: [number, number] = [600, 900];
      state.plantForm.harvestRange = range;
      localStorage.setItem("harvestRange", JSON.stringify(range));
    }
  },

  /**
   * Mutation to change the format of a number value in the plant form.
   * @param {State} state - The current state object.
   * @param {{ input: "plantWeight" | "availableWeight"; value: number }} payload - Payload containing the input field name and its new number value.
   * @returns {void}
   */
  changeNumberFormat(
    state: State,
    {
      input,
      value,
    }: { input: "plantWeight" | "availableWeight"; value: number }
  ): void {
    const formatedNumber = parseFloat(Number(value).toFixed(1));
    state.plantForm[input] = formatedNumber;
    localStorage.setItem(input, JSON.stringify(formatedNumber));
  },

  /**
   * Mutation to reset the plantForm and remove plantForm from localStorage.
   * @param {State} state - The current state object.
   * @returns {void}
   */
  resetPlantForm(state: State): void {
    state.plantForm = { ...initialPlantForm };
  },
};
