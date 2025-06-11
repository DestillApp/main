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

/**
 * Represents the state for the distillation module.
 * @interface
 * @property {DistillationForm} distillationForm - The distillation form state.
 */
interface State {
  distillationForm: DistillationForm;
}

type DistillationFormKey = keyof DistillationForm;

/**
 * Payload for changing a value in the distillation form.
 * @template K
 * @property {K} input - The key of the field to change.
 * @property {DistillationForm[K]} value - The new value for the field.
 */
type ChangeValuePayload<K extends DistillationFormKey> = {
  input: K;
  value: DistillationForm[K];
};

/**
 * Payload for changing a numeric value in the distillation form.
 * @template K
 * @property {K} input - The key of the field to change.
 * @property {number} value - The new numeric value for the field.
 */
type ChangeValuePayloadNumber<K extends DistillationFormKey> = {
  input: K;
  value: number;
};

/**
 * Payload for changing a value in the choosedPlant object.
 * @template K
 * @property {K} key - The key of the choosedPlant field to change.
 * @property {FormChoosedPlant[K]} value - The new value for the field.
 */
type ChangeChoosedPlant<K extends keyof FormChoosedPlant> = {
  key: K;
  value: FormChoosedPlant[K];
};

/**
 * Payload for changing a value in the distillationTime object.
 * @template K
 * @property {K} key - The key of the distillationTime field to change.
 * @property {DistillationTime[K]} value - The new value for the field.
 */
type ChangeDistillationTime<K extends keyof DistillationTime> = {
  key: K;
  value: DistillationTime[K];
};

export default {
  /**
   * Mutation to change the value of a field in the distillation form.
   * @param {State} state - The current state object.
   * @param {ChangeValuePayload<K>} payload - Payload containing the input field name and its new value.
   * @returns {void}
   */
  changeValue<K extends keyof DistillationForm>(
    state: State,
    { input, value }: ChangeValuePayload<K>
  ): void {
    state.distillationForm[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * Mutation to change the value of a field in the distillation form choosedPlant.
   * @param {State} state - The current state object.
   * @param {ChangeChoosedPlant<K>} payload - Payload containing the key in the choosedPlant object and its new value.
   * @returns {void}
   */
  changeChoosedPlant<K extends keyof FormChoosedPlant>(
    state: State,
    { key, value }: ChangeChoosedPlant<K>
  ): void {
    state.distillationForm.choosedPlant[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Mutation to change the value of a field in the distillation time object.
   * @param {State} state - The current state object.
   * @param {ChangeDistillationTime<K>} payload - Payload containing the key in the distillationTime object and its new value.
   * @returns {void}
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
   * Mutation to change a value to an integer value in the distillation form.
   * @param {State} state - The current state object.
   * @param {{ input: "soakingTime"; value: number }} payload - Payload containing the input field name and its new integer value.
   * @returns {void}
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
   * Mutation to change the format of a number value in the distillation form.
   * @param {State} state - The current state object.
   * @param {{ input: "weightForDistillation" | "weightAfterSoaking"; value: number }} payload - Payload containing the input field name and its new formatted number value.
   * @returns {void}
   */
  changeNumberFormat(
    state: State,
    {
      input,
      value,
    }: { input: "weightForDistillation" | "weightAfterSoaking"; value: number }
  ): void {
    const formatedNumber = Number(value.toFixed(1));
    state.distillationForm[input] = formatedNumber;
    localStorage.setItem(input, JSON.stringify(formatedNumber));
  },

  /**
   * Mutation to reset the distillationForm and remove distillationForm from localStorage.
   * @param {State} state - The current state object.
   * @returns {void}
   */
  resetDistillationForm(state: State): void {
    state.distillationForm = JSON.parse(
      JSON.stringify(initialDistillationForm)
    );
  },
};
