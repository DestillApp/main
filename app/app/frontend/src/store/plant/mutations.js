import {
  setTimeFromMinutesAmount,
  getMinutesFromTime,
} from "@/helpers/dateHelpers";
import { initialPlantForm } from "@/helpers/formsInitialState";

/**
 * Plant module mutations for updating the state.
 * @module plantMutations
 */
export default {
  /**
   * @function changeValue
   * @description Mutation to change the value of a field in the plant form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {any} payload.value - The new value for the input field.
   */
  changeValue(state, { input, value }) {
    state.plantForm[input] = value;
    localStorage.setItem(input, JSON.stringify(value));
  },

  //Functions used in plant origin
  /**
   * @function changeIntegerNumber
   * @description Mutation to change a value to an integer value in the plant form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new integer value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new integer value for the input field.
   */
  changeIntegerNumber(state, { input, value }) {
    const integerNumber = parseInt(value);
    state.plantForm[input] = integerNumber;
    localStorage.setItem(input, JSON.stringify(integerNumber));
  },

  /**
   * @function changeStartTimeFormat
   * @description utation to change the format of the start time for harvesting.
   * @param {Object} state - The current state object.
   */
  changeStartTimeFormat(state) {
    const startTime = setTimeFromMinutesAmount(state.plantForm.harvestRange[0]);
    state.plantForm.harvestStartTime = startTime;
    localStorage.setItem("harvestStartTime", JSON.stringify(startTime));
  },

  /**
   * @function changeEndTimeFormat
   * @description Mutation to change the format of the end time for harvesting.
   * @param {Object} state - The current state object.
   */
  changeEndTimeFormat(state) {
    const endTime = setTimeFromMinutesAmount(state.plantForm.harvestRange[1]);
    state.plantForm.harvestEndTime = endTime;
    localStorage.setItem("harvestEndTime", JSON.stringify(endTime));
  },

  /**
   * @function changeHarvestRange
   * @description Mutation to change the harvest range by formating the harvestStartTime and harvestEndTime.
   * @param {Object} state - The current state object.
   */
  changeHarvestRange(state) {
    const startMinutes = getMinutesFromTime(state.plantForm.harvestStartTime);
    const endMinutes = getMinutesFromTime(state.plantForm.harvestEndTime);
    const range = [startMinutes, endMinutes];
    state.plantForm.harvestRange = range;
    localStorage.setItem("harvestRange", JSON.stringify(range));
  },

  //Functions used in plant data
  /**
   * @function changeNumberFormat
   * @description Mutation to change the format of a number value in the plant form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new formatted number value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new number value for the input field.
   */
  changeNumberFormat(state, { input, value }) {
    const formatedNumber = parseFloat(parseFloat(value).toFixed(1));
    state.plantForm[input] = formatedNumber;
    localStorage.setItem(input, JSON.stringify(formatedNumber));
  },

  /**
   * @function resetPlantForm
   * @description Mutation to reset the plantForm and remove plantForm from localStorage.
   * @param {Object} state - The current state object.
   */
  resetPlantForm(state) {
    state.plantForm = { ...initialPlantForm };
    console.log("from vuex", state.plantForm);
  },
};
