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

interface State {
  plantForm: PlantForm;
}

type PlantFormKey = keyof PlantForm;

type ChangeValuePayload<K extends PlantFormKey> = {
  input: K;
  value: PlantForm[K];
};

type ChangeValuePayloadNumber<K extends PlantFormKey> = {
  input: K;
  value: number;
};

export default {
  /**
   * @function changeValue
   * @description Mutation to change the value of a field in the plant form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {any} payload.value - The new value for the input field.
   */
  changeValue<K extends keyof PlantForm>(
    state: State,
    { input, value }: ChangeValuePayload<K>
  ): void {
    state.plantForm[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  // Functions used in plant origin
  /**
   * @function changeIntegerNumber
   * @description Mutation to change a value to an integer value in the plant form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new integer value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new integer value for the input field.
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
   * @function changeStartTimeFormat
   * @description Mutation to change the format of the start time for harvesting.
   * @param {Object} state - The current state object.
   */
  changeStartTimeFormat(state: State): void {
    const startTime = setTimeFromMinutesAmount(state.plantForm.harvestRange[0]);
    state.plantForm.harvestStartTime = startTime;
    localStorage.setItem("harvestStartTime", JSON.stringify(startTime));
  },

  /**
   * @function changeEndTimeFormat
   * @description Mutation to change the format of the end time for harvesting.
   * @param {Object} state - The current state object.
   */
  changeEndTimeFormat(state: State): void {
    const endTime = setTimeFromMinutesAmount(state.plantForm.harvestRange[1]);
    state.plantForm.harvestEndTime = endTime;
    localStorage.setItem("harvestEndTime", JSON.stringify(endTime));
  },

  /**
   * @function changeHarvestRange
   * @description Mutation to change the harvest range by formatting the harvestStartTime and harvestEndTime.
   * @param {Object} state - The current state object.
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

  // Functions used in plant data
  /**
   * @function changeNumberFormat
   * @description Mutation to change the format of a number value in the plant form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new formatted number value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new number value for the input field.
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
   * @function resetPlantForm
   * @description Mutation to reset the plantForm and remove plantForm from localStorage.
   * @param {Object} state - The current state object.
   */
  resetPlantForm(state: State): void {
    state.plantForm = { ...initialPlantForm };
  },
};
