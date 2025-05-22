import { initialResultsForm } from "@/helpers/formsInitialState";
import type { ResultsForm, ResultsDistillation, ResultsPlant } from "@/types/forms/resultsForm";

/**
 * Results module mutations for updating the state.
 * @module resultsMutations
 */

interface State {
  resultsForm: ResultsForm;
}

type ResultsFormKey = keyof ResultsForm;
type ResultsDistillationKey = keyof ResultsDistillation;
type ResultsPlantKey = keyof ResultsPlant;
type DistillationTimeKey = "distillationHours" | "distillationMinutes";

type ChangeValuePayload<K extends ResultsFormKey> = {
  input: K;
  value: ResultsForm[K];
};

type ChangeDistillationDataPayload<K extends ResultsDistillationKey> = {
  input: K;
  value: ResultsDistillation[K];
};

type ChangePlantDataPayload<K extends ResultsPlantKey> = {
  input: K;
  value: ResultsPlant[K];
};

type ChangeDistillationTimePayload = {
  input: DistillationTimeKey;
  value: number;
};

export default {
  /**
   * @function changeValue
   * @description Mutation to change the value of a field in the results form.
   */
  changeValue<K extends ResultsFormKey>(
    state: State,
    { input, value }: ChangeValuePayload<K>
  ): void {
    state.resultsForm[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * @function changeIntegerNumber
   * @description Mutation to change a value to an integer value in the results form.
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
      (state.resultsForm.distillationData.distillationTime as any)[input] = integerNumber;
    }
    if (object === "isDistillation") {
      (state.resultsForm.distillationData as any)[input] = integerNumber;
    }
    localStorage.setItem(input, JSON.stringify(integerNumber));
  },

  /**
   * @function changeNumberFormat
   * @description Mutation to change the format of a number value in the results form.
   */
  changeNumberFormat(
    state: State,
    {
      input,
      value,
      decimals,
    }: { input: string; value: number; decimals?: number }
  ): void {
    const formatedNumber = decimals !== undefined
      ? parseFloat(Number(value).toFixed(decimals))
      : parseFloat(Number(value).toFixed(1));
    (state.resultsForm as any)[input] = formatedNumber;
    localStorage.setItem(input, JSON.stringify(formatedNumber));
  },

  /**
   * @function changeDistillationDataValue
   * @description Mutation to change the value of a field inside distillationData in the results form.
   */
  changeDistillationDataValue<K extends ResultsDistillationKey>(
    state: State,
    { input, value }: ChangeDistillationDataPayload<K>
  ): void {
    state.resultsForm.distillationData[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * @function changePlantDataValue
   * @description Mutation to change the value of a field inside distilledPlant in the results form.
   */
  changePlantDataValue<K extends ResultsPlantKey>(
    state: State,
    { input, value }: ChangePlantDataPayload<K>
  ): void {
    state.resultsForm.distilledPlant[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * @function changeDistillationTimeValue
   * @description Mutation to change the value of distillationHours and distillationMinutes inside distillationTime in the results form.
   */
  changeDistillationTimeValue(
    state: State,
    { input, value }: ChangeDistillationTimePayload
  ): void {
    state.resultsForm.distillationData.distillationTime[input] = value;
    localStorage.setItem(input, JSON.stringify(value));
  },

  /**
   * @function resetResultsForm
   * @description Mutation to reset the resultsForm and remove resultsForm from localStorage.
   */
  resetResultsForm(state: State): void {
    state.resultsForm = JSON.parse(JSON.stringify(initialResultsForm));
  },
};
