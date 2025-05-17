import type { Store } from "vuex";
import type { RootState } from "@/types/store/index";
/**
 * Formats the number input and dispatches the formatted value to the store.
 * @function setNumberFormat
 * @param {number} currentValue - The current value of the input.
 * @param {string} input - The input identifier.
 */
export const setNumberFormat = (
  store: Store<RootState>,
  currentValue: number | null,
  input: string,
  storeName: string,
  decimals?: number
): void => {
  if (!currentValue || isNaN(currentValue)) {
    store.dispatch(`${storeName}/setValue`, { input, value: null });
  } else {
    store.dispatch(`${storeName}/setNumberFormat`, {
      input,
      value: currentValue,
      decimals,
    });
  }
};

/**
 * Formats the number input to an integer and dispatches the value to the store.
 * @function setIntegerNumber
 * @param {number} currentValue - The current value of the input.
 * @param {string} input - The input identifier.
 */
export const setIntegerNumber = (
  store: Store<RootState>,
  currentValue: number | null,
  input: string,
  storeName: string
): void => {
  if (!currentValue || isNaN(currentValue)) {
    store.dispatch(`${storeName}/setValue`, { input, value: null });
  } else {
    store.dispatch(`${storeName}/setIntegerValue`, {
      input,
      value: currentValue,
    });
  }
};

/**
 * Prevents keyboard input for non-integer values.
 * @function setKeyboardIntegerNumber
 * @param {Event} e - The keyboard event.
 */
export const setKeyboardIntegerNumber = (e: KeyboardEvent): void => {
  if (e.key === "." || e.key === ",") {
    e.preventDefault();
  }
};

/**
 * Prevents keyboard input for non-formatted number values.
 * @function setKeyboardFormatedNumber
 * @param {Event} e - The keyboard event.
 */
export const setKeyboardFormatedNumber = (e: KeyboardEvent): void => {
  if (e.key === "." || e.key === "-") {
    e.preventDefault();
  }
};
