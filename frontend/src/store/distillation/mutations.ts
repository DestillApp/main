import { initialDistillationForm } from "@/helpers/formsInitialState";
import type {
  DistillationForm,
  FormChoosedPlant,
  DistillationTime,
} from "@/types/forms/distillationForm";

/**
 * Destillation module mutations for updating the state.
 * @module distillationMutations
 */

interface State {
  distillationForm: DistillationForm;
}

type DistillationFormKey = keyof DistillationForm;

type ChangeValuePayload<K extends DistillationFormKey> = {
  input: K;
  value: DistillationForm[K];
};

type ChangeValuePayloadNumber<K extends DistillationFormKey> = {
  input: K;
  value: number;
};

type ChangeChoosedPlant<K extends keyof FormChoosedPlant> = {
  key: K;
  value: FormChoosedPlant[K];
};

type ChangeDistillationTime<K extends keyof DistillationTime> = {
  key: K;
  value: DistillationTime[K];
};

export default {
  /**
   * Mutation to change the value of a field in the plant form.
   * @function changeValue
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {any} payload.value - The new value for the input field.
   */
  changeValue<K extends keyof DistillationForm>(
    state: State,
    { input, value }: ChangeValuePayload<K>
  ): void {
    state.distillationForm[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * Mutation to change the value of a field in the plant form choosedPlant.
   * @function changeValue
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.key - The name of the key in the choosedPlant object to be updated.
   * @param {any} payload.value - The new value for the key field.
   */
  changeChoosedPlant<K extends keyof FormChoosedPlant>(
    state: State,
    { key, value }: ChangeChoosedPlant<K>
  ): void {
    state.distillationForm.choosedPlant[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Mutation to change the value of a field in the in distillation time object.
   * @function changeDistillationTime
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.key - The name of the key in the distillationTime object to be updated.
   * @param {any} payload.value - The new value for the key field.
   */
  changeDistillationTime<K extends keyof DistillationTime>(
    state: State,
    { key, value }: ChangeDistillationTime<K>
  ): void {
    if (!value || isNaN(value)) {
      state.distillationForm.distillationTime[key] = null;
      localStorage.setItem(key, JSON.stringify(null));
    } else {
      const stringValue = String(value);
      const integerNumber = parseInt(stringValue, 10);
      state.distillationForm.distillationTime[key] = integerNumber;
      localStorage.setItem(key, JSON.stringify(integerNumber));
    }
  },

  /**
   * @function changeIntegerNumber
   * @description Mutation to change a value to an integer value in the distillation form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new integer value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new integer value for the input field.
   */
  changeIntegerNumber(
    state: State,
    { input, value }: { input: "soakingTime"; value: number }
  ): void {
    const stringValue = String(value);
    const integerNumber = parseInt(stringValue, 10);
    state.distillationForm[input] = integerNumber;
    localStorage.setItem(input, JSON.stringify(integerNumber));
  },

  /**
   * Mutation to change the format of a number value in the plant form.
   * @function changeNumberFormat
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
    }: { input: "weightForDistillation" | "weightAfterSoaking"; value: number }
  ): void {
    // const formatedNumber = parseFloat(parseFloat(value).toFixed(1));
    const formatedNumber = Number(value.toFixed(1));
    state.distillationForm[input] = formatedNumber;
    localStorage.setItem(input, JSON.stringify(formatedNumber));
  },

  /**
   * @function resetDistillationForm
   * @description Mutation to reset the distillationForm and remove distillationForm from localStorage.
   * @param {Object} state - The current state object.
   */
  resetDistillationForm(state: State) {
    state.distillationForm = JSON.parse(
      JSON.stringify(initialDistillationForm)
    );
  },
};
